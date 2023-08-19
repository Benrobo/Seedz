import { GraphQLError } from "graphql";

class ServerResponseError extends Error {
  extensions;
  isCustomError;
  constructor(code: string, message: string) {
    super(message);
    this.name = "ServerResponseError";
    this.extensions = { code };

    throw new GraphQLError(message, { extensions: { code: code, name: code } });
  }
}

export default ServerResponseError;
