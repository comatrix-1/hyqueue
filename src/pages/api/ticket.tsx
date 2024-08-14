const axios = require("axios");
const { parse: parseUrl } = require("url");
import type { NextApiRequest, NextApiResponse } from "next";
import {
  EQueueTitles,
  IBoardData,
  ITrelloCard,
  IList,
  ICard,
  ITicketDescription,
} from "../../model";

/**
 * Function for Ticket / Card Trello API calls
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method: httpMethod, url, body } = req;
    const { query: queryStringParameters } = parseUrl(url, true);
    const {
      TRELLO_KEY,
      TRELLO_TOKEN,
      IS_PUBLIC_BOARD,
      TRELLO_ENDPOINT = "https://api.trello.com/1",
      NEXT_PUBLIC_TRELLO_BOARD_ID,
    } = process.env;
    const tokenAndKeyParams =
      IS_PUBLIC_BOARD === "true"
        ? ""
        : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

    /**
     * GET /ticket
     * - Retrieves info about a ticket and its position in queue
     *   Experimental GET flow to fetch status in a single API call.
     *   Lays the groundwork for adding a caching layer that can store this call
     * @param  {string} id The id of the ticket
     * @param  {string} board The board id
     * @return {queueId: string, queueName: string, ticketId: string, ticketDesc: string, numberOfTicketsAhead: Number}
     *  Returns the name and description of the Trello board that queue belongs to.
     */
    if (httpMethod === "GET") {
      const { id, queueId } = queryStringParameters;

      if (queueId) {
        const cardsResponse = await axios.get(
          `${TRELLO_ENDPOINT}/lists/${queueId}/cards?${tokenAndKeyParams}`
        );

        console.log('cardsResponse', cardsResponse.data)

        const cards = cardsResponse.data.map((card: ITrelloCard) => {
          let parsedDesc: ITicketDescription = {
            category: null,
            contact: null,
            name: null,
            ticketPrefix: null,
          };
          try {
            parsedDesc = JSON.parse(card.desc as string);
          } catch (error) {
            console.log("Error parsing desc");
          }

          return {
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
            },
          };
        });

        return res.json(cards);
      }

      // Get the card's position in the current queue
      const getBoardInfo = await axios.get(
        `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&${tokenAndKeyParams}`
      );
      console.log("getBoardInfo", getBoardInfo);
      if (getBoardInfo.status !== 200) {
        return {
          statusCode: getBoardInfo.status,
          message: "getBoardInfo error",
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

      if (!card) return res.status(400).json(null);

      res.json({
        queueId: card.idList,
        queueName: card.queueName,
        ticketNumber: card.idShort,
        ticketId: id,
        ticketDesc: card.desc ? JSON.parse(card.desc) : null,
        numberOfTicketsAhead: card.numberOfTicketsAhead,
      });
    } else if (httpMethod === "POST") {
      /**
       * POST /ticket
       * - Creates a new ticket/card in queue with provided description
       * @param  {string} desc JSON string of user submitted info
       * @return {ticketId: string, ticketNumber: string}
       *  Returns the id and number of the created ticket
       */
      const { desc } = body;

      const prefix = desc.ticketPrefix ? desc.ticketPrefix : "";
      const name = desc.name ? `-${desc.name}` : "";
      const contact = desc.contact ? `-${desc.contact}` : "";
      const category = desc.category ? `-${desc.category}` : "";
      const descString = JSON.stringify(desc);

      const queue = queryStringParameters.queue;
      if (queue) {
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
            res.json({ ticketId: match.id, ticketNumber: match.idShort });
            return;
          }
        }

        const createCard = await axios.post(
          `${TRELLO_ENDPOINT}/cards?${tokenAndKeyParams}&idList=${queue}&desc=${encodeURIComponent(
            descString
          )}`
        );

        const { id, idShort } = createCard.data;
        const cardName = `${prefix}${idShort}${name}${contact}${category}`;
        // Update newly created card with number{-name}{-contact}{-category} and desc
        await axios.put(
          `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&name=${encodeURIComponent(
            cardName
          )}`
        );

        res.json({ ticketId: id, ticketNumber: idShort });
      }
    } else if (httpMethod === "PUT") {
      /**
       * PUT /ticket
       * - Moves ticket to the bottom of the queue. Used for rejoining the queue
       * @param  {string} id The id of the ticket
       * @param  {string} queue The id of the queue
       * @return {statusCode: Number } Returns 200 if successful
       */
      const { id, queue } = queryStringParameters;
      if (id && queue) {
        await axios.put(
          `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${queue}&pos=bottom`
        );
      }
      res.json(null);
    } else if (httpMethod === "DELETE") {
      /**
       * DELETE /ticket
       * - Moves ticket to the bottom of the queue. Used for rejoining the queue
       * @param  {string} id The id of the ticket
       * @return {statusCode: Number } Returns 200 if successful
       */
      const { id } = queryStringParameters;

      if (id && NEXT_PUBLIC_TRELLO_BOARD_ID) {
        const getBoardInfo = await axios.get(
          `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&${tokenAndKeyParams}`
        );

        const { lists } = getBoardInfo.data;
        const leftList = lists.find((l: any) => l.name.includes("[LEFT]")); // TODO: change any

        // A [LEFT] list exists move the users ticket to the bottom of it
        if (leftList && leftList.id) {
          await axios.put(
            `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${leftList.id}&pos=bottom`
          );
        }
        // Otherwise delete it completely
        else {
          await axios.delete(
            `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}`
          );
        }
        res.json(null);
      } else {
        res.status(400).json({
          message: "Missing ticket or board id",
        });
      }
    } else {
      res.status(404).json(null);
    }
  } catch (err: any) {
    // TODO: change any
    console.log(err);
    res.status(400).json(null);
  }
}
