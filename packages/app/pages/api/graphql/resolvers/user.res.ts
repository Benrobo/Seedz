import { CreateUserType } from "../../../../@types";
import prisma from "../../config/prisma";
import UserController from "../../controller/user";
import memcache from "memory-cache";
import ServerResponseError from "../../helper/errorHandler";
import { isLoggedIn } from "../middlewares/auth";

const userController = new UserController();

const userResolvers = {
  Query: {
    getUser: async (parent: any, payload: any, context: any, info: any) => {
      await isLoggedIn(context.req);
      return await userController.getUser(context.userId);
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { payload }: { payload: CreateUserType },
      context: any,
      info: any
    ) => {
      await isLoggedIn(context.req);
      return await userController.createUser(payload, context.userId);
    },
  },
};

export default userResolvers;
