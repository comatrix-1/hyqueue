import axios from "axios";
import { ITrelloCard, ITicketDescription, IApiResponse } from "../model";

export const getTicketsByQueueId = async (queueId: string): Promise<IApiResponse> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    IS_PUBLIC_BOARD,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const cardsResponse = await axios.get(
    `${TRELLO_ENDPOINT}/lists/${queueId}/cards?${tokenAndKeyParams}`
  );

  console.log("cardsResponse", cardsResponse.data);

  const cards = cardsResponse.data.map((card: ITrelloCard) => {
    let parsedDesc: ITicketDescription = {
      category: null,
      contact: null,
      name: null,
      ticketPrefix: null,
      queueNo: null,
    };
    try {
      parsedDesc = JSON.parse(card.desc as string);
    } catch (error) {
      console.log("Error parsing desc");
    }

    return {
      status: 200,
      data: {
        id: card.id,
        name: card.name,
        shortLink: card.shortLink,
        shortUrl: card.shortUrl,
        idShort: card.idShort,
        desc: {
          category: parsedDesc.category,
          contact: parsedDesc.contact,
          name: parsedDesc.name,
          ticketPrefix: parsedDesc.ticketPrefix,
          queueNo: parsedDesc.queueNo,
        },
      },
    };
  });

  return cards;
};
