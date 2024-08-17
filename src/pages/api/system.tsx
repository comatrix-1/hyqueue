import type { NextApiRequest, NextApiResponse } from "next";
import { IEditableSettings, ITrelloBoardSettings } from "../../model";
import axios from "axios";

/**
 * Function for Queue System
 */

const API_ENDPOINT = "/api/system";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ITrelloBoardSettings | null>
) {
  try {
    const { method: httpMethod, body } = req;
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
      console.log(`${API_ENDPOINT} GET`);
      const getBoard = await axios.get(
        `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}?${tokenAndKeyParams}`
      );

      console.log("GET getBoard", getBoard);

      const { id, name, desc, shortUrl } = getBoard.data;

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
        shortUrl,
      });
    } else if (httpMethod === "PUT") {
      console.log(`${API_ENDPOINT} PUT`);
      console.log(`${API_ENDPOINT} PUT body:`, body);
      const update = {
        name: body.name,
        desc: JSON.stringify(body.desc),
      };
      if (!update.name) delete update.name;
      const response = await axios.put(
        `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}?${tokenAndKeyParams}`,
        update
      );

      return res.status(200).json(response.data);
    } else {
      res.status(405).json(null);
    }
  } catch (err: any) {
    // TODO: change any
    console.log(err.response);
    res.status(400).json(null);
  }
}
