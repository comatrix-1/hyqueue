import axios from "axios";
import { IApiResponse, IEditableSettings, IQueueSystem } from "../model";
import { isQueueClosed, prepareJsonString } from "../utils";
import { logger } from "../logger";

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

  const getBoard = await axios.get(
    `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}?${tokenAndKeyParams}`
  );

  logger.info("GET getBoard", getBoard);

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
    logger.info("parsed desc: ", parsedDesc);
  } catch (error) {
    logger.info("Error parsing desc");
  }

  if (!parsedDesc) {
    return { status: 200, data: { message: "Error parsing desc", data: null } };
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
};
