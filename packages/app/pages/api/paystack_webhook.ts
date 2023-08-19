// pages/api/webhooks.js

import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import prisma from "./config/prisma";
import { genID } from "./helper";
import $http from "./config/axios";

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
        const whData = data?.data;
        const traRef = whData?.reference;
        const traId = whData?.id;
        const creditAmount = whData?.amount / 100;
        const userData = whData?.customer;
        const userMail = userData?.email;

        // verify transaction
        const traVerification = await verifyPayment(traRef);

        if (traVerification.success === false) {
          // ! Send customer email why the transaction failed.
          console.log(traVerification.msg);
          return;
        }

        // check if transaction ref exists
        const transactionExists = await prisma.transactionRef?.findMany({
          where: {
            AND: {
              id: String(traId),
              ref: traRef,
            },
          },
        });

        if (transactionExists?.length > 0) {
          console.log(`Duplicate transaction found: user -> [${userMail}] .`);
          return;
        }

        // check if this user exists
        const user = await prisma.users.findFirst({
          where: { email: userMail },
          include: { wallet: true },
        });

        if (user === null || typeof user === "undefined") {
          console.log(
            `Failed to credit user wallet, user ${userMail} notfound`
          );
          return;
        }

        // store transaction ref
        await prisma.transactionRef.create({
          data: { id: String(traId), ref: traRef },
        });

        // credit user wallet
        const totalBalance = (user.wallet?.balance as number) + creditAmount;

        await prisma.wallet.update({
          where: { userId: user.id },
          data: {
            balance: totalBalance,
          },
        });

        //! Send customer email notification
        console.log(
          `Wallet Topped Up with ₦${creditAmount} was successful: [${userMail}]`
        );
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

async function verifyPayment(reference: string) {
  let result = { success: false, msg: null || "" };
  try {
    const req = await $http.get(`/transaction/verify/${reference}`);
    const res = req.data;
    if (res.status) {
      result["success"] = true;
      result["msg"] = res.message;
      return result;
    }
    result["success"] = false;
    result["msg"] = "Something went wrong initializing payment.";
    return result;
  } catch (e: any) {
    console.log(e?.response?.data?.message ?? e.message);
    console.log(
      `Transaction Verification Failed: ${e.response.data.message ?? e.message}`
    );
    result["success"] = false;
    result["msg"] = `Transaction Verification Failed: ${
      e.response.data.message ?? e.message
    }`;
    return result;
  }
}
