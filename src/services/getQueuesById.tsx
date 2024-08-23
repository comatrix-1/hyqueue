import axios from "axios";
import { IApiResponse, IQueue } from "../model";

export const getQueuesById = async (
  id: string
): Promise<IApiResponse<IQueue>> => {
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
    `${TRELLO_ENDPOINT}/lists/${id}/board?fields=id,name,desc&${tokenAndKeyParams}`
  );

  return {
    status: response.status,
    data: {
      message: "",
      data: {
        id: response.data?.id,
        name: response.data?.name,
      },
    },
  };
};
