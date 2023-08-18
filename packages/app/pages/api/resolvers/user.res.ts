import prisma from "../config/prisma";
import UserController from "../controller/user";

const userController = new UserController();

interface GetUserType {
  id: string;
}

interface CreateUserType {
  id: string;
  email: string;
  fullname: string;
  role: "MERCHANT" | "SUPPLIER" | "BUYER";
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
