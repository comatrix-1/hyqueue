import axios from "axios";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { IApiResponse, IEditableSettings, IQueueSystem } from "../model";
import { isQueueClosed, prepareJsonString } from "../utils";

export const getSystem = async (): Promise<IApiResponse<IQueueSystem>> => {
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
    const getBoard = await axios.get(
      `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}?${tokenAndKeyParams}`
    );

    const { name, desc } = getBoard.data;

    let parsedDesc: IEditableSettings | null = null;
    try {
      parsedDesc = JSON.parse(prepareJsonString(desc));
      if (!parsedDesc?.openingHours) throw new Error();
      parsedDesc.isQueueClosed =
        name?.includes("[DISABLED]") ||
        isQueueClosed(
          new Date(),
          parsedDesc?.openingHours,
          parsedDesc?.openingHoursTimeZone
        );
      logger.info("Successfully parsed desc: ", parsedDesc);
    } catch (error) {
      logger.info("Error parsing desc");
    }

    if (!parsedDesc) {
      return {
        status: 200,
        data: { message: "Error parsing desc", data: null },
      };
    } else {
      return {
        status: 200,
        data: {
          message: "Successfully retrieved queue system information",
          data: {
            name,
            desc: parsedDesc,
          },
        },
      };
    }
  } catch (error: any) {
    logger.error(error.message);
    return {
      status: error.response?.status || 500,
      data: { message: INTERNAL_SERVER_ERROR, data: null },
    };
  }
};
