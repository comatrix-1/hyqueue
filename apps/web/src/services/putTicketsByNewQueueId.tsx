import axios from "axios";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import {
  EQueueTitles,
  IApiResponse,
  ITrelloBoardList,
  ITrelloCard,
} from "../model";

export const putTicketsByNewQueueId = async (
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

  try {
    const queuesResponse = await axios.get(
      `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
    );
    const queuesResponseData: ITrelloBoardList[] = queuesResponse.data;

    const pendingQueue = queuesResponseData.find((queue) =>
      queue.name.includes(EQueueTitles.PENDING)
    );
    const pendingQueueId = pendingQueue ? pendingQueue.id : null;

    if (!pendingQueueId) {
      return {
        status: 404,
        data: {
          message: "Pending queue not found",
          data: null,
        },
      };
    }

    const ticketsResponse = await axios.get(
      `${TRELLO_ENDPOINT}/lists/${pendingQueueId}/cards?${tokenAndKeyParams}`
    );
    const ticketsResponseData: ITrelloCard[] = ticketsResponse.data;

    if (ticketsResponseData.length === 0) {
      return {
        status: 200,
        data: {
          message: "No tickets found in pending queue",
          data: null,
        },
      };
    }

    const ticketIdOfFirstInPendingQueue = ticketsResponseData[0].id;
    logger.info("ticketIdOfFirstInPendingQueue", ticketIdOfFirstInPendingQueue);

    const response = await axios.put(
      `${TRELLO_ENDPOINT}/cards/${ticketIdOfFirstInPendingQueue}?${tokenAndKeyParams}&idList=${newQueueId}&pos=bottom`
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        `Failed to move ticket. Trello responded with status ${response.status}`
      );
    }

    return {
      status: response.status,
      data: {
        message: `Successfully put ticket of ID ${ticketIdOfFirstInPendingQueue}`,
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
