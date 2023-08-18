import { NextApiRequest } from "next";
import ServerResponseError from "../../helper/errorHandler";

export function isAuthenticated(req: NextApiRequest) {
  const user = (req as any)["user"];

  if (user.id === null || typeof user.id === "undefined") {
    throw new ServerResponseError("UNAUTHORISED", "Login to continue");
  }
}
