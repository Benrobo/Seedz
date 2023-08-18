import { CreateUserType } from "../../@types";
import prisma from "../../config/prisma";
import UserController from "../../controller/user";
import memcache from "memory-cache";
import ServerResponseError from "../../helper/errorHandler";

const userController = new UserController();

interface GetUserType {
  id: string;
}

type AddUserToCacheType = {
  role: string;
};

const userResolvers = {
  Query: {
    getUser: async (_: any, { id }: GetUserType) =>
      await userController.getUser(id),
    getUsers: async () => userController.getUsers(),
  },
  Mutation: {
    createUser: async (_: any, { payload }: { payload: CreateUserType }) =>
      await userController.createUser(payload),
    addUserToCache: async (
      parent: any,
      { payload }: { payload: AddUserToCacheType },
      context: any,
      info: any
    ) => {
      const validRoles = ["MERCHANT", "BUYER", "SUPPLIER"];
      const ipAddr =
        context.headers["x-real-ip"] || context.connection.remoteAddress;
      const role = payload.role;

      if (!validRoles.includes(role)) {
        throw new ServerResponseError(
          "INVALID_USER_ROLE",
          "Invalid role selected."
        );
      }

      const cacheTime = 30 * 60 * 1000; // 30 min
      memcache.put(ipAddr, role, cacheTime);

      return { success: true };
    },
  },
};

export default userResolvers;
