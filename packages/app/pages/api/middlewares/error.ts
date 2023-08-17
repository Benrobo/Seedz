import { NextApiRequest, NextApiResponse } from "next";

export const CatchErrors = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (err) {
      res.status(500).json({
        errorStatus: true,
        statusCode: 500,
        code: "--api/server-error",
        message: "Something went wrong",
        details: {
          stacks: process.env.NODE_ENV !== "production" && err,
        },
      });
    }
  };
};
