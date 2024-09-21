import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "./logger";

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      logger.info({
        message: `Method: ${req.method}, route: ${req.url} :: START`,
      });

      await handler(req, res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error({
          message: err.message,
          stack: err.stack,
          name: err.name,
        });
      } else {
        logger.error({ message: "An unknown error occurred" });
      }

      res.status(500).json({ error: "An internal error occurred" });
    }
  };
}
