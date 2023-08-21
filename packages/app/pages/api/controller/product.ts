import { ApiAddProductProp, FundWalletType } from "../../../@types";
import prisma from "../config/prisma";
import ServerResponseError from "../helper/errorHandler";
import { AddProductSchema, InitPaymentSchema } from "../helper/validator";
import { genID } from "../helper";
import $http from "../config/axios";

export default class ProductController {
  constructor() {}

  private isValidationError(error: any) {
    return typeof error !== "undefined";
  }

  // init paystack payment
  async initPsPayment(amount: number, email: string) {
    let result = { success: false, data: null, msg: null || "" };
    try {
      const req = await $http.post("/transaction/initialize", {
        amount,
        email,
      });
      const res = req?.data;
      if (res.status) {
        result["success"] = true;
        result["data"] = res.data;
        result["msg"] = res.message;
        return result;
      }
      result["success"] = false;
      result["data"] = null;
      result["msg"] = "Something went wrong initializing payment.";
      return result;
    } catch (e: any) {
      console.log(e.response.data.message ?? e.message);
      console.log(
        `Error initializing payment: ${e.response.data.message ?? e.message}`
      );
      result["success"] = false;
      result["data"] = null;
      result["msg"] = `Error initializing payment: ${
        e.response.data.message ?? e.message
      }`;
      return result;
    }
  }

  async fundWallet(payload: FundWalletType, userId: string) {
    const { error, value } = InitPaymentSchema.validate(payload);
    if (this.isValidationError(error)) {
      throw new ServerResponseError("INVALID_FIELDS", (error as any).message);
    }

    const { amount, currency } = payload;
    const validCurr = "NGN";

    if (currency !== validCurr) {
      throw new ServerResponseError("INVALID_CURRENCY", "currency is invalid.");
    }

    // init payment
    const user = await prisma.users.findFirst({ where: { id: userId } });
    const result = await this.initPsPayment(
      Number(amount * 100),
      user?.email as string
    );

    if (result.success === true) {
      return {
        authorization_url: (result?.data as any).authorization_url,
        access_code: (result?.data as any).access_code,
        reference: (result?.data as any).reference,
      };
    }

    throw new ServerResponseError("INIT_PAYMENT_ERROR", result.msg);
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
    } = payload;

    // upload to cloudinary
  }
}
