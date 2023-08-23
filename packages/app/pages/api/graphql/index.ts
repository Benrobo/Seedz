// import { ApolloServer, BaseContext } from "@apollo/server";
// import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "apollo-server-micro";
import combinedTypeDef from "./typeDef";
import userResolvers from "./resolvers/user.res";
import { GraphQLError } from "graphql";
import paymentResolvers from "./resolvers/payment.res";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import productResolvers from "./resolvers/product.res";
import seedzAiResolvers from "./resolvers/assistant.res";
import Cors from "micro-cors";

const cors = Cors();

const apolloServer = new ApolloServer({
  typeDefs: combinedTypeDef,
  resolvers: [
    userResolvers,
    paymentResolvers,
    productResolvers,
    seedzAiResolvers,
  ],
  context: ({ req }: { req: NextApiRequest }) => {
    const { userId } = getAuth(req);
    const user = { id: userId };

    // Create a new context object by spreading properties from req and adding user
    const context = {
      req,
      user,
    };

    return { user };
  },
  formatError: (error: GraphQLError) => {
    // Return a different error message
    console.log(
      `Gql Server Error [${error?.extensions.code}]: ${error?.message}`
    );
    const gqlErrorCode = ["GRAPHQL_VALIDATION_FAILED", "BAD_USER_INPUT"];
    const mainServerError = ["INTERNAL_SERVER_ERROR"];
    // gql server error
    if (gqlErrorCode.includes(error?.extensions.code as string)) {
      return {
        error: true,
        code: "GQL_SERVER_ERROR",
        message: "Something went wrong",
        log:
          process.env.NODE_ENV !== "production"
            ? error?.extensions.message
            : null,
      };
    }
    // main server error
    if (mainServerError.includes(error?.extensions.code as string)) {
      return {
        error: true,
        code: error?.extensions.code,
        message: `Something went wrong!`,
        log: error?.message,
      };
    }
    if (error instanceof GraphQLError) {
      const { code } = error.extensions;
      return {
        code: error?.extensions.code,
        message: error?.message,
      };
    }
    // Otherwise return the formatted error. This error can also
    // be manipulated in other ways, as long as it's returned.
    return error;
  },
});

const startServer = apolloServer.start();

// @ts-ignore
export default cors(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;

  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
