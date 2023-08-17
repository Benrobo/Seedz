import { NextApiRequest, NextApiResponse } from "next";

export default function useCatchErrors(fn: Function) {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
