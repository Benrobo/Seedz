export default class UserController {
  constructor() {}

  async getUser(id: string) {
    throw Error("User not found");
  }

  async getUsers() {
    throw Error("User not found");
  }
}
