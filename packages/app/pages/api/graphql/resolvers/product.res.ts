import { ApiAddProductProp, CreateUserType } from "../../../../@types";
import prisma from "../../config/prisma";
import ProductController from "../../controller/product";
import { isAuthenticated, notBuyer } from "../middlewares/auth";

const productController = new ProductController();

const productResolvers = {
  Query: {
    // getUser: async (_: any, { id }: GetUserType) =>
    //   await userController.getUser(id),
    // getUsers: async () => userController.getUsers(),
  },
  Mutation: {
    addProduct: async (
      parent: any,
      args: ApiAddProductProp,
      context: any,
      info: any
    ) => {
      // isAuthenticated middleware
      isAuthenticated(context);

      //   notBuyer middleware
      notBuyer(context);

      return await productController.addProduct(args, context.user.id);
    },
  },
};

export default productResolvers;
