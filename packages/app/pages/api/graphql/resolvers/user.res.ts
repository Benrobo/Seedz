import { CreateUserType } from "../../../../@types";
import prisma from "../../config/prisma";
import UserController from "../../controller/user";
import memcache from "memory-cache";
import ServerResponseError from "../../helper/errorHandler";

const userController = new UserController();

interface GetUserType {
  id: string;
}

const userResolvers = {
  Query: {
    getUser: async (_: any, { id }: GetUserType) =>
      await userController.getUser(id),
    getUsers: async () => userController.getUsers(),
  },
  Mutation: {
    createUser: async (_: any, { payload }: { payload: CreateUserType }) =>
      await userController.createUser(payload),
    addRoleToCache: async (
      parent: any,
      { role }: { role: string },
      context: any,
      info: any
    ) => {
      const validRoles = ["MERCHANT", "BUYER", "SUPPLIER"];
      let ipAddr: any;

      if (context.headers["x-forwarded-for"]) {
        ipAddr = context.headers["x-forwarded-for"].split(",")[0];
      } else if (context.headers["x-real-ip"]) {
        ipAddr = context.connection.remoteAddress;
      } else {
        ipAddr = context.connection.remoteAddress;
      }

      console.log({ ipAddr });

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
