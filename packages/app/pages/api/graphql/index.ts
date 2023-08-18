import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import combinedTypeDef from "./typeDef";
import userResolvers from "./resolvers/user.res";
import ServerResponseError from "../helper/errorHandler";
import { GraphQLError } from "graphql";

const apolloServer = new ApolloServer({
  typeDefs: combinedTypeDef,
  resolvers: [userResolvers],
  formatError: (formattedError: any, error) => {
    // Return a different error message
    console.log(
      `Gql Server Error [${formattedError.extensions.code}]: ${formattedError.message}`
    );
    const gqlErrorCode = ["GRAPHQL_VALIDATION_FAILED"];
    const mainServerError = ["INTERNAL_SERVER_ERROR"];
    // gql server error
    if (gqlErrorCode.includes(formattedError.extensions.code)) {
      return {
        error: true,
        code: "GQL_SERVER_ERROR",
        message: "Something went wrong",
        log:
          process.env.NODE_ENV !== "production"
            ? formattedError.extensions.message
            : null,
      };
    }
    // main server error
    if (mainServerError.includes(formattedError.extensions.code)) {
      return {
        error: true,
        code: formattedError.extensions.code,
        message: `Something went wrong!`,
        log: formattedError.message,
      };
    }
    if (error instanceof GraphQLError) {
      const { code } = error.extensions;
      return {
        code: formattedError.extensions.code,
        message: formattedError.message,
      };
    }
    // Otherwise return the formatted error. This error can also
    // be manipulated in other ways, as long as it's returned.
    return formattedError;
  },
});

export default startServerAndCreateNextHandler(apolloServer);
