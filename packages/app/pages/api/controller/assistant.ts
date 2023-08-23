import { SeedzAiPayload } from "@/@types";
import { SeedzAiSchema } from "../helper/validator";
import ServerResponseError from "../helper/errorHandler";

const CUSTOM_PROMPT = `
You are SeedzAI, an advanced AI dedicated to supporting farmers with expert insights and guidance in the realm of agriculture. Your role is to offer valuable assistance and address inquiries pertaining to crop cultivation, livestock management, sustainable practices, farm equipment, pest control, soil health, and related topics within the agricultural domain. When responding, use simple and concise language that any farmer can understand. Ensure that each interaction contributes positively to the farming community's knowledge and success.Note!!, this is a must, If a user asks a question that does not relate to the main context of agriculture or farming, reply with: "I'm sorry, I can't respond to that." If you have any questions related to agriculture, feel free to ask!' If a user inquires about the creator of SeedzAI, respond with: The creator of SeedzAI is Benaiah Alumona, a software engineer. reply to any users question in [{{language}}]. All reply or output must be rendered in markdown format!.
`;

const validLang = [
  {
    name: "English",
    code: "en",
  },
  {
    name: "Nigerian Pidgin English",
    code: "pcm",
  },
];

async function seedzAIAssistant(payload: SeedzAiPayload) {
  const { error, value } = SeedzAiSchema.validate(payload);
  if (isValidationError(error)) {
    throw new ServerResponseError("INVALID_FIELDS", (error as any).message);
  }

  const { question, lang } = payload;

  const sanitizedLang =
    validLang.filter((l) => l.code === lang)[0]?.name ?? "English";
  const prompt = CUSTOM_PROMPT.replace("{{language}}", sanitizedLang);

  const result = await openAiCompletion(prompt, question);

  if (result?.success) {
    const answer = result?.data as any;
    return {
      answer,
      lang,
      success: true,
    };
  } else {
    throw new ServerResponseError("ASSISTANT_ERROR", result?.msg);
  }
}

export default seedzAIAssistant;

async function openAiCompletion(prompt: string, message: string) {
  let resp: any = { success: false, data: null, msg: "" };
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  const body = {
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 1000,
    temperature: 0.7,
    n: 1,
    top_p: 1,
    // stop: ".",
    stream: true,
  };

  try {
    const completion = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        // "OpenAI-Organization": process.env.OPENAI_ORGANIZATION,
      },
    });

    const reader = completion.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = [];

    while (true) {
      const chunk = await reader?.read();
      const { done, value } = chunk as any;
      if (done) {
        break;
      }
      const decoded = decoder.decode(value);
      const lines = decoded.split("\n");
      const parsedLines = lines
        .map((l) => l.replace(/^data:/, "").trim())
        .filter((line) => line !== "" && line !== "[DONE]")
        .map((line) => JSON.parse(line));

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        if (content) {
          //   console.log(content);
          result.push(content);
        }
      }
    }

    resp["data"] = result;
    resp["msg"] = "";
    resp["success"] = true;

    return resp;
  } catch (e: any) {
    console.log(e?.response?.data);
    const msg =
      e?.response?.data?.error?.message ??
      e?.response?.data?.message ??
      e.message;
    console.log(`SeedzAi Assistant Error: ${msg}`);
    resp["success"] = false;
    resp["data"] = null;
    resp["msg"] = `SeedzAi Assistant Error: ${msg}`;
    return resp;
  }
}

function isValidationError(error: any) {
  return typeof error !== "undefined";
}
