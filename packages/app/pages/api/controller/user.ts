import { CreateUserType } from "../../../@types";
import prisma from "../config/prisma";
import ServerResponseError from "../helper/errorHandler";
import { CreateUserSchema } from "../helper/validator";
import { genID } from "../helper";

export default class UserController {
  constructor() {}

  private isValidationError(error: any) {
    return typeof error !== "undefined";
  }

  async getUser(id: string) {
    const userById = await prisma.users.findFirst({
      where: { id: id },
      include: {
        wallet: true,
        transactions: true,
        deliveryAddress: true,
        ratings: true,
      },
    });
    if (userById === null) {
      throw new ServerResponseError("NO_USER_FOUND", "user not found");
    }

    return userById;
  }

  async getUsers() {
    const allUsers = await prisma.users.findMany({
      include: {
        wallet: true,
        transactions: true,
        deliveryAddress: true,
        ratings: true,
      },
    });
    return allUsers;
  }

  async createUser(payload: CreateUserType) {
    const { error, value } = CreateUserSchema.validate(payload);
    if (this.isValidationError(error)) {
      throw new ServerResponseError("INVALID_FIELDS", (error as any).message);
    }

    const { role, id } = payload;

    // check if role is valid or not
    const validRole = ["MERCHANT", "SUPPLIER", "BUYER"];
    if (!validRole.includes(role)) {
      throw new ServerResponseError(
        "INVALID_FIELDS",
        `Invalid role given: ${role}`
      );
    }

    // check if user with id already exists
    const userExists = await prisma.users.findMany({ where: { id } });

    if (userExists.length > 0) {
      throw new ServerResponseError(
        "USER_EXISTS",
        `User with this records already exists.`
      );
    }

    // create user
    const defaultCurrency = "NGN";
    await prisma.users.create({
      data: {
        id,
        username: "",
        fullname: "",
        email: "",
        role,
        image: "",
        wallet: {
          create: {
            id: genID(20),
            currency: defaultCurrency,
            balance: 0,
          },
        },
      },
    });

    return { success: true };
  }
}
