import { ApolloServer, BaseContext } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import combinedTypeDef from "./typeDef";
import userResolvers from "./resolvers/user.res";
import { GraphQLError } from "graphql";
import paymentResolvers from "./resolvers/payment.res";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import productResolvers from "./resolvers/product.res";

const apolloServer = new ApolloServer({
  typeDefs: combinedTypeDef,
  resolvers: [userResolvers, paymentResolvers, productResolvers],
  formatError: (formattedError: any, error) => {
    // Return a different error message
    console.log(
      `Gql Server Error [${formattedError.extensions.code}]: ${formattedError.message}`
    );
    const gqlErrorCode = ["GRAPHQL_VALIDATION_FAILED", "BAD_USER_INPUT"];
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

export const config = {
  api: {
    bodyParser: true,
  },
};

export default startServerAndCreateNextHandler(apolloServer, {
  context: async (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<BaseContext> => {
    const { userId } = getAuth(req);
    (req as any).user = { id: userId };
    return req;
  },
});
