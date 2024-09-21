const axios = require("axios");
const { parse: parseUrl } = require("url");
import type { NextApiRequest, NextApiResponse } from "next";
import { postLogin } from "../../services/postLogin";
import { withErrorHandling } from "../../withErrorHandling";

/**
 * Function for Board Trello API calls
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method: httpMethod } = req;

  if (httpMethod === "POST") {
    const { status, data } = await postLogin();
    res.status(status).json(data);
  } else {
    res.status(405).json(null);
  }
}

export default withErrorHandling(handler);
