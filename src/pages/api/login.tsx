const axios = require("axios");
const { parse: parseUrl } = require("url");
import type { NextApiRequest, NextApiResponse } from "next";
import { postLogin } from "../../services/postLogin";
import { API_ENDPOINT } from "../../constants";

/**
 * Function for Board Trello API calls
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method: httpMethod } = req;
    console.log(`${API_ENDPOINT} ${httpMethod}`);

    if (httpMethod === "POST") {
      const { status, data } = await postLogin();
      res.status(status).json(data);
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
