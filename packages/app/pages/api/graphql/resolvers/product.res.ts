import { ApiAddProductProp, ApiProductCheckoutProps } from "../../../../@types";
import ProductController from "../../controller/product";
import { isLoggedIn } from "../middlewares/auth";
import { notBuyer } from "../middlewares/auth";

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
      await isLoggedIn(context.req);

      // notBuyer middleware
      await notBuyer(context.userId);

      return await productController.addProduct(payload, context.userId);
    },
    deleteProduct: async (
      parent: any,
      { prodId }: { prodId: string },
      context: any,
      info: any
    ) => {
      // isAuthenticated middleware
      await isLoggedIn(context.req);

      // notBuyer middleware
      await notBuyer(context.userId);

      return await productController.deleteProduct(prodId, context.userId);
    },
    productCheckout: async (
      parent: any,
      { payload }: { payload: ApiProductCheckoutProps },
      context: any,
      info: any
    ) => {
      await isLoggedIn(context.req);

      return await productController.productCheckout(payload, context.userId);
    },
  },
};

export default productResolvers;
