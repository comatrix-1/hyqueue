import axios from "axios";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { IApiResponse, ITicket, ITrelloCard } from "../model";
import { prepareJsonString } from "../utils";

export const getTickets = async (): Promise<IApiResponse<ITicket[]>> => {
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
    const getBoardInfo = await axios.get(
      `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&${tokenAndKeyParams}`
    );

    logger.info("getBoardInfo TEST", getBoardInfo.data);

    if (getBoardInfo.status !== 200) {
      return {
        status: getBoardInfo.status,
        data: {
          message: "getBoardInfo error",
          data: null,
        },
      };
    }

    const parseCardsData = (cards: ITrelloCard[]): ITicket[] => {
      return cards.map((card) => {
        return {
          id: card.id,
          queueId: card.idList,
          name: card.name,
          ticketNumber: card.idShort,
          desc: JSON.parse(prepareJsonString(card.desc)),
        };
      });
    };

    let parsedCardsData: ITicket[] = [];
    try {
      parsedCardsData = parseCardsData(getBoardInfo.data.cards);
    } catch (error) {
      logger.info(error);
    }

    if (!parsedCardsData.length) {
      return {
        status: 200,
        data: {
          message: INTERNAL_SERVER_ERROR,
          data: [],
        },
      };
    }

    return {
      status: 200,
      data: {
        message: "Successfully retrieved tickets",
        data: parsedCardsData,
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
