import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import combinedTypeDef from "../typeDef";
import userResolvers from "../resolvers/user.res";

const apolloServer = new ApolloServer({
  typeDefs: combinedTypeDef,
  resolvers: [userResolvers],
});

export default startServerAndCreateNextHandler(apolloServer);
