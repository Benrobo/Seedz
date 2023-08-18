// pages/api/webhooks.js

import { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import ServerResponseError from "./helper/errorHandler";
import prisma from "./config/prisma";
import { genID } from "./helper";
import memecache from "memory-cache";

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

      //   console.log(data);
      console.log(
        (data as any).data.unsafe_metadata,
        (data as any).data.public_metadata,
        (data as any).data.private_metadata
      );

      if (event === "user.created") {
        const ipAddr = req.headers["x-real-ip"] || req.connection.remoteAddress;
        const userRole = memecache.get(ipAddr);

        if (userRole === null) {
          console.log("Failed to save user data.");
          return;
        }

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
            fullname: `${whUserData.first_name} ${whUserData.last_name ?? ""}`,
            email: whUserData?.email_addresses[0]?.email_address,
            role: userRole,
          },
        });
        return;
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
