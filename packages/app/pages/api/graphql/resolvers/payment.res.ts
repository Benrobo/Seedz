import { CreateUserType } from "../../@types";
import prisma from "../../config/prisma";
import PaymentController from "../../controller/payment";
import UserController from "../../controller/user";

const paymentController = new PaymentController();

interface GetUserType {
  id: string;
}

const paymentResolvers = {
  Query: {
    // getUser: async (_: any, { id }: GetUserType) =>
    //   await userController.getUser(id),
    // getUsers: async () => userController.getUsers(),
  },
  Mutation: {
    // createUser: async (_: any, { payload }: { payload: CreateUserType }) =>
    //   await userController.createUser(payload),
  },
};

export default paymentResolvers;
