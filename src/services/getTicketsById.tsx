import axios from "axios";
import {
  IBoardData,
  IList,
  ICard,
  EQueueTitles,
  IApiResponse,
  ITicket,
} from "../model";
import { INTERNAL_SERVER_ERROR } from "../constants";

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

  // Get the card's position in the current queue
  const getBoardInfo = await axios.get(
    `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&${tokenAndKeyParams}`
  );
  console.log("getBoardInfo", getBoardInfo);
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
    console.log("populated listMap: ", listMap);

    data.cards.forEach((card: ICard) => {
      console.log("card", card);
      const queueId = card.idList ?? "";

      // Get the name of the queue the card resides in
      const queueName = listMap[queueId].name;
      console.log("queueName", queueName);

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
        console.log("numberOfTicketsAhead", numberOfTicketsAhead);
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

    console.log("populated cardMap: ", cardMap);
    return { listMap, cardMap };
  };

  const { cardMap } = parseBoardData(getBoardInfo.data);
  console.log("cardMap", cardMap);
  const card = cardMap.get(id);

  if (!card)
    return {
      status: 400,
      data: { message: INTERNAL_SERVER_ERROR, data: null },
    };

  return {
    status: 200,
    data: {
      message: "",
      data: {
        queueId: card.idList,
        queueName: card.queueName,
        idShort: card.idShort,
        id: id,
        desc: card.desc ? JSON.parse(card.desc) : null,
        numberOfTicketsAhead: card.numberOfTicketsAhead,
      },
    },
  };
};
