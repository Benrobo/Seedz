import prisma from "../config/prisma";
import UserController from "../controller/user";
import wrapResolver from "../helper/wrapResolver";

const userController = new UserController();

interface GetUserType {
  id: string;
}

const userResolvers = {
  Query: {
    getUser: wrapResolver(async (_: any, { id }: GetUserType) =>
      userController.getUser(id)
    ),
    getUsers: async () => userController.getUsers(),
  },
};

export default userResolvers;
