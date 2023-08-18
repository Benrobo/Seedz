import { CreateUserType } from "../@types";
import prisma from "../config/prisma";
import UserController from "../controller/user";

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
  },
};

export default userResolvers;
