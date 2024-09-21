const axios = require("axios");
const { parse: parseUrl } = require("url");
import type { NextApiRequest, NextApiResponse } from "next";
import { getQueues } from "../../services/getQueues";
import { withErrorHandling } from "../../withErrorHandling";

/**
 * Function for Queue / List Trello API calls
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method: httpMethod } = req;

  if (httpMethod === "GET") {
    const { status, data } = await getQueues();
    return res.status(status).json(data);
  } else {
    return res.status(405).json(null);
  }
}

export default withErrorHandling(handler);
