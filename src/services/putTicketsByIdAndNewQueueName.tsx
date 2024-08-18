import axios from "axios";
import { IApiResponse, ITrelloBoardList } from "../model";

export const putTicketsByIdAndNewQueueName = async (
  id: string,
  newQueueName: string
): Promise<IApiResponse> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    IS_PUBLIC_BOARD,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const queuesResponse = await axios.get(
    `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
  );

  const queuesResponseData: ITrelloBoardList[] = queuesResponse.data;

  const newQueue = queuesResponseData.find((queue) =>
    queue.name.includes(newQueueName)
  );
  const newQueueId = newQueue ? newQueue.id : null;

  const response = await axios.put(
    `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${newQueueId}&pos=bottom`
  );

  return {
    status: 201,
    data: response.data,
  };
};
