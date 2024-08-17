const axios = require("axios");
const { parse: parseUrl } = require("url");
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Function for Board Trello API calls
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method: httpMethod, body: request } = req;
    const {
      TRELLO_KEY,
      REDIRECT_URL,
      SCOPES,
      APP_NAME,
      EXPIRATION_DURATION,
      IS_TEST,
      NEXT_PUBLIC_TRELLO_BOARD_ID,
    } = process.env;

    if (httpMethod === "POST") {
      const scopes = SCOPES || "read,write";
      const appName = APP_NAME || "QueueUp%20SG";
      const expiration = EXPIRATION_DURATION || "1hour";

      const redirectUrl = encodeURIComponent(
        `${REDIRECT_URL || "http://localhost:3000/admin/callback"}?boardId=${
          request.boardId
        }&key=${TRELLO_KEY}`
      );

      if (IS_TEST === "true") {
        return res.json({
          authorizeUrl: `http://localhost:3000/admin/callback?boardId=${NEXT_PUBLIC_TRELLO_BOARD_ID}`,
        });
      }

      res.json({
        authorizeUrl: `https://trello.com/1/authorize?expiration=${expiration}&name=${appName}&scope=${scopes}&response_type=token&key=${TRELLO_KEY}&return_url=${redirectUrl}`,
      });
    } else {
      res.status(405).json(null);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(400).json({ error: err.message });
    } else {
      console.error("An unknown error occurred");
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
}
