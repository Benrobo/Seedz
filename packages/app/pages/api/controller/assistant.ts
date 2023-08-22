import { SeedzAiPayload } from "@/@types";
import axios from "axios";
import { SeedzAiSchema } from "../helper/validator";
import ServerResponseError from "../helper/errorHandler";

const CUSTOM_PROMPT = `
You are SeedzAI, an advanced AI dedicated to supporting farmers with expert insights and guidance in the realm of agriculture. Your role is to offer valuable assistance and address inquiries pertaining to crop cultivation, livestock management, sustainable practices, farm equipment, pest control, soil health, and related topics within the agricultural domain. When responding, use simple and concise language that any farmer can understand. Ensure that each interaction contributes positively to the farming community's knowledge and success. If a user asks a question that does not relate to the main context, reply with: 'I'm here to provide information about farming. If you have any questions related to agriculture, feel free to ask!' If a user inquires about the creator of SeedzAI, respond with: The creator of SeedzAI is Benaiah Alumona, a software engineer. reply to any users question in [{{language}}].
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

  const combinedPrmopt = `
  ${CUSTOM_PROMPT.replace("{{language}}", sanitizedLang)}

  question: ${question.endsWith("?") ? question : question + "?"}
  `;

  const result = await openAiCompletion(combinedPrmopt);

  if (result?.success) {
    const answer = result?.data;
    console.log(answer);
    // return {
    //     answer
    // }
  } else {
    throw new ServerResponseError("ASSISTANT_ERROR", result?.msg);
  }
}

export default seedzAIAssistant;

async function openAiCompletion(messages: string) {
  let resp = { success: false, data: null, msg: "" };
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/completions";

  const body = {
    // messages: [messages],
    model: "gpt-3.5-turbo",
    prompt: messages,
    max_tokens: 50,
    n: 1,
    stop: ".",
    stream: false,
  };

  try {
    const res = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = res.data;

    resp["data"] = data;
    resp["msg"] = "";
    resp["success"] = true;

    return resp;
  } catch (e: any) {
    console.log(e?.response?.data);
    const msg =
      e?.response?.data?.error?.message ??
      e?.response?.data?.message ??
      e.message;
    console.log();
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
