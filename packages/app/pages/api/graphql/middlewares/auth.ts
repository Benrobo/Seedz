import { NextApiRequest } from "next";
import ServerResponseError from "../../helper/errorHandler";
import prisma from "../../config/prisma";

export function isAuthenticated(req: NextApiRequest) {
  const user = (req as any)["user"];

  if (user.id === null || typeof user.id === "undefined") {
    throw new ServerResponseError("UNAUTHORISED", "Login to continue");
  }
}

// middleware should be used only for MERCHANT & SUPPLIER
export async function notBuyer(req: NextApiRequest) {
  const user = (req as any)["user"];
  const userInfo = await prisma.users.findFirst({ where: { id: user?.id } });
  const role = userInfo?.role;

  if (role === "BUYER") {
    throw new ServerResponseError(
      "FORBIDDEN",
      "You don't have permission to access this resources."
    );
  }
}
