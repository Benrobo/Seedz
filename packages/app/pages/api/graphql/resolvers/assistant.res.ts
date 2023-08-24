import { SeedzAiPayload } from "@/@types";
import seedzAIAssistant from "../../controller/assistant";
import { isLoggedIn } from "../middlewares/auth";

const seedzAiResolvers = {
  Mutation: {
    askSeedzAi: async (
      parent: any,
      { payload }: { payload: SeedzAiPayload },
      context: any,
      info: any
    ) => {
      // isAuthenticated middleware
      await isLoggedIn(context.req);

      return await seedzAIAssistant(payload);
    },
  },
};

export default seedzAiResolvers;
