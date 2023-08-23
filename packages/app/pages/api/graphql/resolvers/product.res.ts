import {
  ApiAddProductProp,
  ApiProductCheckoutProps,
  CreateUserType,
} from "../../../../@types";
import prisma from "../../config/prisma";
import ProductController from "../../controller/product";
import ServerResponseError from "../../helper/errorHandler";
import { isAuthenticated, notBuyer } from "../middlewares/auth";

const productController = new ProductController();

const productResolvers = {
  Query: {
    getProducts: async () => await productController.getProducts(),
    //   await userController.getUser(id),
    // getUsers: async () => userController.getUsers(),
  },
  Mutation: {
    addProduct: async (
      parent: any,
      { payload }: { payload: ApiAddProductProp },
      context: any,
      info: any
    ) => {
      // isAuthenticated middleware
      isAuthenticated(context);

      // notBuyer middleware
      await notBuyer(context);

      return await productController.addProduct(payload, context.user.id);
    },
    deleteProduct: async (
      parent: any,
      { prodId }: { prodId: string },
      context: any,
      info: any
    ) => {
      // isAuthenticated middleware
      isAuthenticated(context);

      // notBuyer middleware
      await notBuyer(context);

      return await productController.deleteProduct(prodId, context.user.id);
    },
    productCheckout: async (
      parent: any,
      { payload }: { payload: ApiProductCheckoutProps },
      context: any,
      info: any
    ) => {
      isAuthenticated(context);

      return await productController.productCheckout(payload, context.user.id);
    },
  },
};

export default productResolvers;
