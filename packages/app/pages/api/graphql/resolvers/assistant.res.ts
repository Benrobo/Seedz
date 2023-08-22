import { SeedzAiPayload } from "@/@types";
import seedzAIAssistant from "../../controller/assistant";
import { isAuthenticated } from "../middlewares/auth";

const seedzAiResolvers = {
  Mutation: {
    askSeedzAi: async (
      parent: any,
      { payload }: { payload: SeedzAiPayload },
      context: any,
      info: any
    ) => {
      // isAuthenticated middleware
      isAuthenticated(context);

      return await seedzAIAssistant(payload);
    },
  },
};

export default seedzAiResolvers;
