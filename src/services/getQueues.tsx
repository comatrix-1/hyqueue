import axios from "axios";
import { IApiResponse, IQueue, ITrelloBoardList } from "../model";

export const getQueues = async (): Promise<IApiResponse<IQueue[]>> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    IS_PUBLIC_BOARD,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const response = await axios.get(
    `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
  );

  return {
    status: response.status,
    data: {
      message: "Successfully retrieved queues",
      data: response.data.map((data: IQueue) => ({
        id: data.id,
        name: data.name,
      })),
    },
  };
};
