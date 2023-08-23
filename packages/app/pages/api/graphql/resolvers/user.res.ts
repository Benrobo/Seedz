import { CreateUserType } from "../../../../@types";
import prisma from "../../config/prisma";
import UserController from "../../controller/user";
import memcache from "memory-cache";
import ServerResponseError from "../../helper/errorHandler";
import { isAuthenticated } from "../middlewares/auth";

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
    updateUserRole: async (
      parent: any,
      { role }: { role: "MERCHANT" | "BUYER" | "SUPPLIER" },
      context: any,
      info: any
    ) => {
      isAuthenticated(context);

      if (typeof role === "undefined" || role.length === 0) {
        throw new ServerResponseError("INVALID_FIELD", "Invalid role");
      }

      const userId = context.user?.id;

      console.log({ role, userId });

      // check if user exists
      const user = await prisma.users.findFirst({
        where: { id: userId },
      });

      if (user === null) {
        throw new ServerResponseError("USER_NOTFOUND", "user not found");
      }

      // check if role is valid
      const validRoles = ["MERCHANT", "BUYER", "SUPPLIER"];

      if (!validRoles.includes(role)) {
        throw new ServerResponseError("INVALID_ROLE", "Invalid role given.!");
      }

      await prisma.users.update({
        where: { id: userId },
        data: { role },
      });

      return { success: true };
    },
  },
};

export default userResolvers;
