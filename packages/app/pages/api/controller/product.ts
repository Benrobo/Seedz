import {
  ApiAddProductProp,
  ApiProductCheckoutProps,
  FundWalletType,
} from "../../../@types";
import prisma from "../config/prisma";
import ServerResponseError from "../helper/errorHandler";
import {
  AddProductSchema,
  InitPaymentSchema,
  ProductCheckoutSchema,
} from "../helper/validator";
import { genID } from "../helper";
import $http from "../config/axios";

type productQtyArray = { prodId: string; qty: number; name: string }[];
export default class ProductController {
  constructor() {}

  private isValidationError(error: any) {
    return typeof error !== "undefined";
  }

  private async validateProductQuantities(productQtyArray: productQtyArray) {
    const products = await this.checkAvailableQuantities(productQtyArray);

    const validationResults = productQtyArray.map((item) => {
      const requestedQty = item.qty;
      const product = products.find((p) => p.id === item.prodId);
      if (!product) {
        return {
          prodId: item.prodId,
          isValid: false,
          reason: "Product not found",
        };
      }
      const availableQty = product.quantity;
      const isValid = requestedQty <= availableQty;
      return {
        prodId: item.prodId,
        isValid,
        reason: isValid ? "Available" : "Insufficient quantity",
      };
    });

    return validationResults;
  }

  private async checkAvailableQuantities(productQtyArray: productQtyArray) {
    const productIds = productQtyArray.map((item) => item.prodId);
    const products = await prisma.products.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const foundProductIds = products.map((product) => product.id);
    const missingProductIds = productIds.filter(
      (id) => !foundProductIds.includes(id)
    );

    if (missingProductIds.length > 0) {
      const missingProductNames = missingProductIds.map((id) => {
        const productQty = productQtyArray.find((item) => item.prodId === id);
        return productQty ? productQty?.name : "Unknown Product";
      });

      throw new ServerResponseError(
        "PRODUCT_NOT_FOUND",
        `The following products are not available: ${missingProductNames.join(
          ", "
        )}`
      );
    }

    return products;
  }

  async addProduct(payload: ApiAddProductProp, userId: string) {
    const { error, value } = AddProductSchema.validate(payload);
    if (this.isValidationError(error)) {
      throw new ServerResponseError("INVALID_FIELDS", (error as any).message);
    }

    const {
      availableForRent,
      image,
      category,
      description,
      name,
      price,
      rentingPrice,
      quantity,
    } = payload;

    await prisma.products.create({
      data: {
        id: genID(20),
        name,
        type: category,
        price,
        availableForRent,
        rentingPrice,
        image: {
          create: {
            hash: image.hash,
            url: image.url,
          },
        },
        description,
        currency: "NGN",
        userId,
        quantity,
      },
    });

    return { success: true, msg: "Product created successfully." };
  }

  async getProducts() {
    return await prisma.products.findMany({
      include: { image: true, ratings: true, user: true },
    });
  }

  async productCheckout(payload: ApiProductCheckoutProps, userId: string) {
    const { error, value } = ProductCheckoutSchema.validate(payload);
    if (this.isValidationError(error)) {
      throw new ServerResponseError("INVALID_FIELDS", (error as any).message);
    }

    const { totalAmount, productQty } = payload;

    const hasSufficientQty = await this.validateProductQuantities(productQty);

    console.log(hasSufficientQty);
  }
}
