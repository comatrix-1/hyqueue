import axios from "axios";
import {
  ITrelloBoardList,
  EQueueTitles,
  ITrelloCard,
  IApiResponse,
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

  // Take from pending queue and put into queue Id
  const queuesResponse = await axios.get(
    `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
  );

  const queuesResponseData: ITrelloBoardList[] = queuesResponse.data;

  const pendingQueue = queuesResponseData.find((queue) =>
    queue.name.includes(EQueueTitles.PENDING)
  );
  const pendingQueueId = pendingQueue ? pendingQueue.id : null;

  const ticketsResponse = await axios.get(
    `${TRELLO_ENDPOINT}/lists/${pendingQueueId}/cards?${tokenAndKeyParams}`
  );

  const ticketsResponseData: ITrelloCard[] = ticketsResponse.data;
  if (ticketsResponseData.length <= 0) {
    return {
      status: 200,
      data: {
        message: "No tickets found in pending queue",
        data: null,
      },
    };
  }
  const ticketIdOfFirstInPendingQueue = ticketsResponseData[0].id;
  console.log("ticketIdOfFirstInPendingQueue", ticketIdOfFirstInPendingQueue);

  const response = await axios.put(
    `${TRELLO_ENDPOINT}/cards/${ticketIdOfFirstInPendingQueue}?${tokenAndKeyParams}&idList=${newQueueId}&pos=bottom`
  );

  // TODO: check response status

  return {
    status: 201,
    data: {
      message: `Successfully put ticket of ID ${ticketIdOfFirstInPendingQueue} to queue of ID ${newQueueId}`,
      data: null,
    },
  };
};
