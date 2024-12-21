import axios from "axios";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { IApiResponse, ITrelloBoardList } from "../model";

export const putTicketsByIdAndNewQueueName = async (
  id: string,
  newQueueName: string
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

  try {
    const queuesResponse = await axios.get(
      `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
    );

    const queuesResponseData: ITrelloBoardList[] = queuesResponse.data;

    const newQueue = queuesResponseData.find((queue) =>
      queue.name.includes(newQueueName)
    );
    const newQueueId = newQueue ? newQueue.id : null;

    const updateResponse = await axios.put(
      `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${newQueueId}&pos=bottom`
    );

    const message =
      updateResponse.status === 200
        ? `Successfully updated ticket of ID: ${id}`
        : `Failed to update ticket of ID: ${id}`;

    return {
      status: updateResponse.status,
      data: {
        message,
        data: null,
      },
    };
  } catch (error: any) {
    logger.error(error.message);
    return {
      status: error.response?.status || 500,
      data: { message: INTERNAL_SERVER_ERROR, data: null },
    };
  }
};
