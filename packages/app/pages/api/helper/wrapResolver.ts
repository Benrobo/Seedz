import { GraphQLResolveInfo } from "graphql";

const wrapResolver = (resolver: any) => {
  return async (
    parent: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ) => {
    try {
      const data = await resolver(parent, args, context, info);
      return data;
    } catch (error: any) {
      console.log(error.message);
      return {
        error: true,
        message: `${error?.message}`,
        data: null,
      };
    }
  };
};

export default wrapResolver;
