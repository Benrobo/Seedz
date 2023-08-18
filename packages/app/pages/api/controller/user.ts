import { CreateUserType } from "../@types";
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
    throw Error("User not found");
  }

  async getUsers() {
    const allUsers = await prisma.users.findMany();
    return allUsers;
  }

  async createUser(payload: CreateUserType) {
    const { error, value } = CreateUserSchema.validate(payload);
    if (this.isValidationError(error)) {
      throw new ServerResponseError("INVALID_FIELDS", (error as any).message);
    }

    const { email, fullname, profileImage, username, role, id } = payload;

    // check if role is valid or not
    const validRole = ["MERCHANT", "SUPPLIER", "BUYER"];
    if (!validRole.includes(role)) {
      throw new ServerResponseError(
        "INVALID_FIELDS",
        `Invalid role given: ${role}`
      );
    }

    // check if user with emaiL already exists
    const userExists = await prisma.users.findMany({ where: { email, role } });

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
        username,
        fullname,
        email,
        role,
        image: profileImage,
        wallet: {
          create: {
            id: genID(20),
            currency: defaultCurrency,
            balance: 0,
            paystackId: null,
          },
        },
      },
    });

    return { success: true };
  }
}
