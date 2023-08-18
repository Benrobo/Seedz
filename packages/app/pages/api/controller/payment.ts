import { CreateUserType } from "../@types";
import prisma from "../config/prisma";
import ServerResponseError from "../helper/errorHandler";
import { CreateUserSchema } from "../helper/validator";
import { genID } from "../helper";

export default class PaymentController {
  constructor() {}

  private isValidationError(error: any) {
    return typeof error !== "undefined";
  }

  async topUp() {}
}
