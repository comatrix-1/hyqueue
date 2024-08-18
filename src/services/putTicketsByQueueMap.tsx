import axios from "axios";
import { IApiResponse } from "../model";

export const putTicketsByQueueMap = async (queueMap: {
  [key: string]: string;
}): Promise<IApiResponse> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    IS_PUBLIC_BOARD,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const requests = Object.entries(queueMap).map(([ticketId, newQueueId]) =>
    axios.put(
      `${TRELLO_ENDPOINT}/cards/${ticketId}?${tokenAndKeyParams}&idList=${newQueueId}&pos=bottom`
    )
  );

  try {
    await Promise.all(requests);
    return {
      status: 201,
      data: {
        message: "Successfully updated tickets",
      },
    };
  } catch (error) {
    console.error("Error updating cards:", error);
    return {
      status: 400,
      data: null,
    };
  }
};
