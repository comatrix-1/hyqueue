const axios = require("axios");
import type { NextApiRequest, NextApiResponse } from "next";
import {
  IEditableSettings,
  ITrelloBoardSettings,
} from "../../model";

/**
 * Function for Queue System
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ITrelloBoardSettings | null>
) {
  try {
    const { method: httpMethod } = req;
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
      const getBoard = await axios.get(
        `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}?${tokenAndKeyParams}`
      );

      const { id, name, desc } = getBoard.data;

      let parsedDesc: IEditableSettings | null = null;
      try {
        parsedDesc = JSON.parse(desc as string);
        console.log("parsed desc: ", parsedDesc);
      } catch (error) {
        console.log("Error parsing desc");
      }

      if (!parsedDesc) return res.status(200).json(null);

      return res.status(200).json({
        id,
        name,
        desc: parsedDesc,
      });
    } else {
      res.status(404).json(null);
    }
  } catch (err: any) {
    // TODO: change any
    console.log(err.response);
    res.status(400).json(null);
  }
}
