import { CreateUserType } from "../../../../@types";
import prisma from "../../config/prisma";
import PaymentController from "../../controller/payment";
import UserController from "../../controller/user";
import { isAuthenticated } from "../middlewares/auth";

const paymentController = new PaymentController();

const paymentResolvers = {
  Query: {
    // getUser: async (_: any, { id }: GetUserType) =>
    //   await userController.getUser(id),
    // getUsers: async () => userController.getUsers(),
  },
  Mutation: {
    fundWallet: async (
      parent: any,
      { amount, currency }: { amount: number; currency: string },
      context: any,
      info: any
    ) => {
      // isAuthenticated middleware
      isAuthenticated(context);
      return await paymentController.fundWallet(
        { amount, currency },
        context.user.id
      );
    },
  },
};

export default paymentResolvers;
