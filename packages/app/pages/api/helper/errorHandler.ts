import { GraphQLError } from "graphql";

class ServerResponseError extends GraphQLError {
  extensions;
  isCustomError;
  constructor(code: string, message: string) {
    super(message);
    this.name = "ServerResponseError";
    this.extensions = { code };
    throw new GraphQLError(message, { extensions: { code: code } });
  }
}

export default ServerResponseError;
