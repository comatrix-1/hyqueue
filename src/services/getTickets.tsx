import axios from "axios";
import { IApiResponse } from "../model";

export const getTickets = async (): Promise<IApiResponse> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    IS_PUBLIC_BOARD,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const getBoardInfo = await axios.get(
    `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&${tokenAndKeyParams}
`
  );
  console.log("getBoardInfo TEST", getBoardInfo.data);
  if (getBoardInfo.status !== 200) {
    return {
      status: getBoardInfo.status,
      data: {
        message: "getBoardInfo error",
      },
    };
  }

  const parseCardsData = (cards: any[]) => {
    return cards.map((card) => {
      // Parse the desc field into an object
      const parsedDesc = JSON.parse(card.desc);

      // Return a new object with the parsed desc field
      return {
        ...card,
        desc: parsedDesc,
      };
    });
  };

  const parsedCardsData = parseCardsData(getBoardInfo.data.cards);

  return {
    status: 200,
    data: { tickets: parsedCardsData, queues: getBoardInfo.data.lists },
  };
};
