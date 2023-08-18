import ServerResponseError from "../helper/errorHandler";
import { CreateUserSchema } from "../helper/validator";

interface CreateUserProps {
  fullname: string;
  id: string;
  email: string;
  role: "MERCHANT" | "SUPPLIER" | "BUYER";
}

export default class UserController {
  constructor() {}

  private isValidationError(error: any) {
    return typeof error !== "undefined";
  }

  async getUser(id: string) {
    throw Error("User not found");
  }

  async getUsers() {
    throw Error("User not found");
  }

  async createUser(payload: CreateUserProps) {
    const { error, value } = CreateUserSchema.validate(payload);
    if (this.isValidationError(error)) {
      throw new ServerResponseError("CODE", "message");
    }
  }
}
