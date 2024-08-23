import axios from "axios";
import { IApiResponse, IEditableSettings } from "../model";
import { prepareJsonString } from "../utils";

export const getSystem = async (): Promise<IApiResponse> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    IS_PUBLIC_BOARD,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const getBoard = await axios.get(
    `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}?${tokenAndKeyParams}`
  );

  console.log("GET getBoard", getBoard);

  const { id, name, desc, shortUrl } = getBoard.data;

  let parsedDesc: IEditableSettings | null = null;
  try {
    parsedDesc = JSON.parse(prepareJsonString(desc));
    console.log("parsed desc: ", parsedDesc);
  } catch (error) {
    console.log("Error parsing desc");
  }

  if (!parsedDesc) {
    return { status: 200, data: null };
  } else {
    return {
      status: 200,
      data: {
        id,
        name,
        desc: parsedDesc,
        shortUrl,
      },
    };
  }
};
