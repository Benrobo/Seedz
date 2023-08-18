import { CreateUserType, FundWalletType } from "../../@types";
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
      args: any,
      context: any,
      { payload }: { payload: FundWalletType }
    ) => {
      // isAuthenticated middleware
      isAuthenticated(context);
      paymentController.fundWallet(payload, context.user.id);
    },
  },
};

export default paymentResolvers;
