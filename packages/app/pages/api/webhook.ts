// pages/api/webhooks.js

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("🚀 webhook call");

    res.status(200).send("Webhook received and processed.");
  } else {
    res.status(200).json({ msg: "You've reached webhook endpoint." });
  }
}
