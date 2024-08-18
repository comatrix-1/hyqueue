const axios = require("axios");
const { parse: parseUrl } = require("url");
import type { NextApiRequest, NextApiResponse } from "next";
import { ITrelloBoardList } from "../../model";
import { getQueuesById } from "../../services/getQueuesById";
import { getQueues } from "../../services/getQueues";

/**
 * Function for Queue / List Trello API calls
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method: httpMethod, url } = req;
    const { query: queryStringParameters } = parseUrl(url, true);
    const {
      TRELLO_KEY,
      TRELLO_TOKEN,
      IS_PUBLIC_BOARD,
      TRELLO_ENDPOINT = "https://api.trello.com/1",
      NEXT_PUBLIC_TRELLO_BOARD_ID,
    } = process.env;
    const tokenAndKeyParams =
      IS_PUBLIC_BOARD === "true"
        ? ""
        : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

    if (httpMethod === "GET") {
      if (queryStringParameters.id) {
        const { status, data } = await getQueuesById(queryStringParameters.id);
        res.status(status).json(data);
      } else {
        const { status, data } = await getQueues();
        res.status(status).json(data);
      }
    } else {
      res.status(405).json(null);
    }
  } catch (err: any) {
    // TODO: change any
    console.log(err.response);
    res.status(400).json(null);
  }
}
