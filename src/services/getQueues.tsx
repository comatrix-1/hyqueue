import axios from "axios";
import { IApiResponse, IQueue } from "../model";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";

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

  try {
    const response = await axios.get(
      `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
    );

    const message =
      response.status === 200
        ? "Successfully retrieved queues"
        : "Failed to retrieve queues";

    const returnData =
      response.status === 200
        ? response.data.map((data: IQueue) => ({
            id: data.id,
            name: data.name,
          }))
        : null;

    return {
      status: response.status,
      data: {
        message,
        data: returnData,
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
