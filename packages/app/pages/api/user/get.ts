import { CatchErrors } from "../middlewares/error";
import UserController from "../controller/user";
import { NextApiRequest, NextApiResponse } from "next";

const userController = new UserController();

const getUsers = (req: NextApiRequest, res: NextApiResponse) =>
  userController.getUser(req, res);
export default CatchErrors(getUsers);
