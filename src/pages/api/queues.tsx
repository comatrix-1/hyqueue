const axios = require("axios");
const { parse: parseUrl } = require("url");
import type { NextApiRequest, NextApiResponse } from "next";
import { ITrelloBoardList } from "../../model";

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
        const getBoardQueueBelongsTo = await axios.get(
          `${TRELLO_ENDPOINT}/lists/${queryStringParameters.id}/board?fields=id,name,desc&${tokenAndKeyParams}`
        );

        const { id, name } = getBoardQueueBelongsTo.data;

        res.status(200).json({
          id,
          name,
        });
      } else {
        const response = await axios.get(
          `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
        );

        const responseData: ITrelloBoardList[] = response.data;

        res.status(200).json(responseData);
      }
    } else {
      res.status(404).json(null);
    }
  } catch (err: any) {
    // TODO: change any
    console.log(err.response);
    res.status(400).json(null);
  }
}
