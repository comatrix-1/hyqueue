import axios from "axios";
import { IApiResponse } from "../model";

export const putTicketsByIdAndNewQueueId = async (
  id: string,
  newQueueId: string
): Promise<IApiResponse<null>> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    IS_PUBLIC_BOARD,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  await axios.put(
    `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${newQueueId}&pos=bottom`
  );

  return {
    status: 201,
    data: {
      message: `Successfully updated ticket of ID: ${id}`,
      data: null,
    },
  };
};
