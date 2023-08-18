import sendResponse from "../helper/sendResponse";

export default class UserController {
  constructor() {}

  async getUser(id: string, ...rest: any) {
    console.log({ rest });
    return sendResponse(
      {
        email: "welcome",
      },
      false,
      "welcome back"
    );
    throw Error("User not found");
  }

  async getUsers() {}
}
