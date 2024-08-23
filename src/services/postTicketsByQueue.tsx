import axios from "axios";
import { IApiResponse, ITicket } from "../model";
import { INTERNAL_SERVER_ERROR } from "../constants";

export const postTicketsByQueue = async (
  queue: string,
  desc: any
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

  const prefix = desc.ticketPrefix ? desc.ticketPrefix : "";
  const name = desc.name ? `-${desc.name}` : "";
  const contact = desc.contact ? `-${desc.contact}` : "";
  const category = desc.category ? `-${desc.category}` : "";
  const queueNo = desc.queueNo ? `-${desc.queueNo}` : "";
  const descString = JSON.stringify(desc);

  if (!queue)
    return {
      status: 400,
      data: { message: INTERNAL_SERVER_ERROR, data: null },
    };

  // if contact is provided, search pending queue for duplicate number
  if (contact) {
    const getCardsOnPendingList = await axios.get(
      `${TRELLO_ENDPOINT}/lists/${queue}/cards?${tokenAndKeyParams}`
    );
    const ticketsInQueue = getCardsOnPendingList.data;

    console.log("ticketsInQueue", ticketsInQueue);

    const match = ticketsInQueue.find((ticket: any) =>
      ticket.name.includes(contact)
    );
    // If match found return that ticket info instead of creating a new one
    if (match) {
      return {
        status: 200,
        data: {
          message: "Found a ticket",
          data: { id: match.id, idShort: match.idShort },
        },
      };
    }
  }

  const createCard = await axios.post(
    `${TRELLO_ENDPOINT}/cards?${tokenAndKeyParams}&idList=${queue}&desc=${encodeURIComponent(
      descString
    )}`
  );

  const { id, idShort } = createCard.data;
  const cardName = `${prefix}${idShort}${name}${contact}${category}${queueNo}`;
  // Update newly created card with number{-name}{-contact}{-category} and desc
  const response = await axios.put(
    `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&name=${encodeURIComponent(
      cardName
    )}`
  );

  if (response.status === 400) {
    return {
      status: 400,
      data: {
        message: "Failed to create ticket",
        data: null,
      },
    };
  }

  return {
    status: 200,
    data: { message: "Successfully created ticket", data: { id, idShort } },
  };
};
