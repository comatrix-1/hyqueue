import axios from "axios";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import {
  EQueueTitles,
  IApiResponse,
  IBoardData,
  ICard,
  IList,
  ITicket,
} from "../model";

export const getTicketsById = async (
  id: string
): Promise<IApiResponse<ITicket>> => {
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
    logger.info("getBoardInfo", getBoardInfo);
    if (getBoardInfo.status !== 200) {
      return {
        status: getBoardInfo.status,
        data: {
          message: INTERNAL_SERVER_ERROR,
          data: null,
        },
      };
    }
    const parseBoardData = (data: IBoardData) => {
      const listMap: { [key: string]: IList } = {};
      const cardMap = new Map<string, ICard>();

      data.lists.forEach((list: IList) => {
        listMap[list.id] = { ...list, cards: [] };
      });
      logger.info("populated listMap: ", listMap);

      data.cards.forEach((card: ICard) => {
        logger.info("card", card);
        const queueId = card.idList ?? "";

        // Get the name of the queue the card resides in
        const queueName = listMap[queueId].name;
        logger.info("queueName", queueName);

        let numberOfTicketsAhead = -1;
        if (
          !(
            queueName.includes(EQueueTitles.ALERTED) ||
            queueName.includes(EQueueTitles.DONE) ||
            queueName.includes(EQueueTitles.MISSED)
          )
        ) {
          // Get card position based on length of list before
          numberOfTicketsAhead = listMap[queueId].cards.length;
          logger.info("numberOfTicketsAhead", numberOfTicketsAhead);
        }

        card = { ...card, numberOfTicketsAhead, queueName };

        // Add listMap with card
        listMap[queueId] = {
          ...listMap[queueId],
          cards: [...listMap[queueId].cards, card],
        };
        // Add card to the card map for quick lookup
        cardMap.set(card.id, card);
      });

      logger.info("populated cardMap: ", cardMap);
      return { listMap, cardMap };
    };

    const { cardMap } = parseBoardData(getBoardInfo.data);
    logger.info("cardMap", cardMap);
    const card = cardMap.get(id);

    if (!card)
      return {
        status: 400,
        data: { message: INTERNAL_SERVER_ERROR, data: null },
      };

    return {
      status: 200,
      data: {
        message: `Successfully retrieved ticket of ID: ${id}`,
        data: {
          queueId: card.idList,
          queueName: card.queueName,
          ticketNumber: card.idShort,
          id: id,
          desc: card.desc ? JSON.parse(card.desc) : null,
          numberOfTicketsAhead: card.numberOfTicketsAhead,
        },
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
