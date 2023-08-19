// pages/api/webhooks.js

import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import prisma from "./config/prisma";
import { genID } from "./helper";

const secret = process.env.CLERK_WH_SECRET as string;
const paystack_secret = process.env.PS_TEST_SEC as string;

// webhook handler for paystack
export default async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const whPayload = verifyWH(req);
    if (whPayload.success) {
      const data = whPayload.data;
      const event = (data as any).event;

      console.log(data);

      if (event === "charge.success") {
        console.log("successful payment");
        return;
      }
    }
  } else {
    res.status(200).json({ msg: "You've reached webhook endpoint." });
  }
}

function verifyWH(req: NextApiRequest) {
  try {
    const hash = crypto
      .createHmac("sha512", paystack_secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    const validHash = hash == req.headers["x-paystack-signature"];
    return { data: req.body, success: validHash };
  } catch (e: any) {
    console.log(`Error verifying webhook: ${e.message}`);
    return { data: null, success: false };
  }
}
