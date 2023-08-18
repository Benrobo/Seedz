import { GraphQLResolveInfo } from "graphql";

const wrapResolver = (resolver: any) => {
  return async (
    parent: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ) => {
    const data = await resolver(parent, args, context, info);
    return data;
  };
};

export default wrapResolver;
