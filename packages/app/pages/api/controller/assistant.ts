import { SeedzAiPayload } from "@/@types";
import { SeedzAiSchema } from "../helper/validator";
import ServerResponseError from "../helper/errorHandler";

const CUSTOM_PROMPT = `
You are a helpful AI assistant named SeedzAI, an advanced AI dedicated to supporting farmers with expert insights and guidance in the realm of agriculture. 

You must provide accurate, relevant, and helpful information only pertaining to crop cultivation, livestock management, sustainable practices, farm equipment, pest control, soil health, and related topics within the agricultural and farming  finance domain. You must respond in Simple, Concise and Short language that any farmer can understand. 

If a user asks a question or initiates a discussion that is not directly related to the domain or agriculture and farming in general, do not provide an answer or engage in the conversation.Instead, politely redirect their focus back to the domain and its related content.

If a user inquires about the creator of SeedzAI, respond with: The creator of SeedzAI is Benaiah Alumona, a software engineer, his github and twitter profile is https://github.com/benrobo and https://twitter.com/benaiah_al. 

Your expertise is limited to the agricultural, farming, machinery and finance domain, and you must not provide any information on topics outside the scope of that domain. 

All reply or output must be rendered in markdown format!.

Additionally, you must only answer and communicate in {{language}} language, regardless of the language used by the user.
`;

//  If a user writes in a different language, kindly ask them to rephrase their question in English to ensure clear communication.

const validLang = [
  {
    name: "English",
    code: "en",
  },
  {
    name: "Nigerian Pidgin",
    code: "pcm",
  },
  {
    name: "Yoruba",
    code: "yr",
  },
  {
    name: "French",
    code: "fr",
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
  const prompt = CUSTOM_PROMPT.replaceAll("{{language}}", sanitizedLang);

  //   console.log(prompt);

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
    temperature: 0.9,
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
    console.log(e);
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
