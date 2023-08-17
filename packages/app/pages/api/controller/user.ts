import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";

export default class UserController extends BaseController {
  constructor() {
    super();
  }

  async getUser(req: NextApiRequest, res: NextApiResponse) {
    const userdata = [
      {
        name: "john doe",
        email: "john@mail.com",
      },
      {
        name: "brain tracy",
        email: "brian@mail.com",
      },
    ];
    this.success(
      res,
      "--user/fake-data",
      "user data fetched successfully",
      200,
      userdata
    );
  }
}
