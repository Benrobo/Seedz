// pages/api/webhooks.js

import { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import ServerResponseError from "./helper/errorHandler";
import prisma from "./config/prisma";
import { genID } from "./helper";

const secret = process.env.CLERK_WH_SECRET as string;

export default async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const whPayload = verifyWH(req);
    if (whPayload.success) {
      const data = whPayload.data;
      const event = (data as any).type;

      console.log(data);

      if (event === "user.created") {
        // check if user with id or email doesn't exists
        const user = await prisma.users.findMany({
          where: {
            id: (data as any).data.id,
          },
        });

        if (user.length > 0) {
          // user exists already having only one id in table
          // update user data
          const whUserData = (data as any).data;
          await prisma.users.update({
            where: { id: whUserData.id },
            data: {
              id: whUserData.id,
              image: whUserData.image_url,
              username:
                whUserData.username ??
                whUserData.first_name.toLowerCase() + genID(4),
              fullname: `${whUserData.first_name} ${
                whUserData.last_name ?? ""
              }`,
              email: whUserData.email,
            },
          });
          return;
        } else {
          console.log("Webhook: unkown user attempting");
        }
      }
    }
  } else {
    res.status(200).json({ msg: "You've reached webhook endpoint." });
  }
}

function verifyWH(req: NextApiRequest) {
  try {
    const headers = {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    };

    const wh = new Webhook(secret);
    const payload = wh.verify(JSON.stringify(req.body), headers);

    return { data: payload, success: true };
  } catch (e: any) {
    console.log(`Error verifying webhook: ${e.message}`);
    return { data: null, success: false };
  }
}
