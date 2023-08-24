import ENV from "../../config/env";
import Passage from "@passageidentity/passage-node";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";

import { isEmpty } from "../../../../utils";
import ServerResponseError from "../../helper/errorHandler";
import prisma from "../../config/prisma";

let passage = new Passage({
  appID: process.env.PASSAGE_APP_ID as string,
  apiKey: process.env.PASSAGE_API_KEY as string,
  authStrategy: "HEADER",
});

export async function isLoggedIn(req: NextApiRequest) {
  try {
    const token =
      req.headers["psg_auth_token"] ?? req.cookies["psg_auth_token"];

    if (isEmpty(token)) {
      throw new ServerResponseError(
        "AUTH_TOKEN_NOTFOUND",
        "Auth token missing, login to continue."
      );
    }

    let { userId } = await getAuth(req);
    if (userId === null) {
      throw new ServerResponseError("UNAUTHORISED", "Unauthorised user");
    }
  } catch (e: any) {
    console.log(e);
    console.error(`invalid seedz token: ${e?.message}`);
    throw new ServerResponseError(
      "INVALID_TOKEN",
      "Authorization token is invalid"
    );
  }
}

export const apolloAuthMiddleware = async ({
  req,
}: {
  req: NextApiRequest;
}) => {
  const token =
    (req as any).headers["psg_auth_token"] || req.cookies["psg_auth_token"];

  if (!token) {
    throw new ServerResponseError(
      "UNAUTHORIZED",
      "Authorization header expected a token but got none."
    );
  }

  const passageReq = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const userID = await passage.authenticateRequest(passageReq as any);

  if (!userID) {
    throw new ServerResponseError("UNAUTHORIZED", "Unauthorized user");
  }

  return { userId: userID };
};

export async function getAuth(req: NextApiRequest) {
  try {
    const token =
      (req as any).headers["psg_auth_token"] || req.cookies["psg_auth_token"];

    const passageReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const userId = await passage.authenticateRequest(passageReq as any);

    return { userId };
  } catch (e: any) {
    console.log(`Error authenticateRequest with passage: ${e.message}`);
    return { userId: null };
  }
}

// middleware should be used only for MERCHANT & SUPPLIER
export async function notBuyer(userId: string) {
  const userInfo = await prisma.users.findFirst({ where: { id: userId } });
  const role = userInfo?.role;

  if (role === "BUYER") {
    throw new ServerResponseError(
      "FORBIDDEN",
      "You don't have permission to access this resources."
    );
  }
}
