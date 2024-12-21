import axios from "axios";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import {
  IApiResponse,
  ITicket,
  ITicketDescription,
  ITrelloCard,
} from "../model";
import { prepareJsonString } from "../utils";

export const getTicketsByQueueId = async (
  queueId: string
): Promise<IApiResponse<ITicket[]>> => {
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
    const cardsResponse = await axios.get(
      `${TRELLO_ENDPOINT}/lists/${queueId}/cards?${tokenAndKeyParams}`
    );

    logger.info("cardsResponse", cardsResponse.data);

    const cards = cardsResponse.data.map((card: ITrelloCard) => {
      let parsedDesc: ITicketDescription = {
        category: null,
        contact: null,
        name: null,
        ticketPrefix: null,
        queueNo: null,
      };
      try {
        parsedDesc = JSON.parse(prepareJsonString(card.desc));
      } catch (error) {
        logger.info("Error parsing desc");
      }

      return {
        id: card.id,
        name: card.name,
        ticketNumber: card.idShort,
        desc: {
          category: parsedDesc.category,
          contact: parsedDesc.contact,
          name: parsedDesc.name,
          ticketPrefix: parsedDesc.ticketPrefix,
          queueNo: parsedDesc.queueNo,
        },
      };
    });

    return {
      status: 200,
      data: {
        message: `Successfully retrieved tickets by queue ID: ${queueId}`,
        data: cards,
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
