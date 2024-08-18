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
  ITrelloBoardList,
  IEditableSettings,
} from "../../model";

const API_ENDPOINT = "/api/tickets";

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
     * GET /tickets
     * - Retrieves info about a ticket and its position in queue
     *   Experimental GET flow to fetch status in a single API call.
     *   Lays the groundwork for adding a caching layer that can store this call
     * @param  {string} id The id of the ticket
     * @param  {string} board The board id
     * @return {queueId: string, queueName: string, ticketId: string, ticketDesc: string, numberOfTicketsAhead: Number}
     *  Returns the name and description of the Trello board that queue belongs to.
     */
    if (httpMethod === "GET") {
      console.log(`${API_ENDPOINT} GET`);
      const { id, queueId, type } = queryStringParameters;
      if (queueId) {
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
          };
        });

        return res.json(cards);
      } else {
        // const getBoardInfo = await axios.get(
        //   `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/cards?fields=id,idList,name,idShort,desc,shortLink,shortUrl,queueNo&lists=open&list_fields=id,name&${tokenAndKeyParams}`
        // );
        const getBoardInfo = await axios.get(
          `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&${tokenAndKeyParams}
`
        );
        console.log("getBoardInfo TEST", getBoardInfo.data);
        if (getBoardInfo.status !== 200) {
          return {
            statusCode: getBoardInfo.status,
            message: "getBoardInfo error",
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

        res.json({ tickets: parsedCardsData, queues: getBoardInfo.data.lists });
      }
      // else {
      //   const listsResponse = await axios.get(
      //     `https://api.trello.com/1/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
      //   );

      //   const lists = listsResponse.data;
      //   console.log("lists", lists[0]);

      //   const listsWithCardsPromises = lists.map(
      //     async (list: ITrelloBoardList) => {
      //       const cardsResponse = await axios.get(
      //         `https://api.trello.com/1/lists/${list.id}/cards?${tokenAndKeyParams}`
      //       );

      //       const cards = cardsResponse.data.map((card: ITrelloCard) => {
      //         let parsedDesc: ITicketDescription = {
      //           category: null,
      //           contact: null,
      //           name: null,
      //           ticketPrefix: null,
      //           queueNo: null,
      //         };
      //         try {
      //           parsedDesc = JSON.parse(card.desc as string);
      //         } catch (error) {
      //           console.log("Error parsing desc");
      //         }

      //         return {
      //           id: card.id,
      //           name: card.name,
      //           shortLink: card.shortLink,
      //           shortUrl: card.shortUrl,
      //           desc: {
      //             category: parsedDesc.category,
      //             contact: parsedDesc.contact,
      //             name: parsedDesc.name,
      //             ticketPrefix: parsedDesc.ticketPrefix,
      //             queueNo: parsedDesc.queueNo,
      //           },
      //         };
      //       });

      //       return {
      //         id: list.id,
      //         name: list.name,
      //         cards: cards,
      //       };
      //     }
      //   );

      //   const listsWithCards = await Promise.all(listsWithCardsPromises);

      //   res.json(listsWithCards);
      // }

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
       * POST /tickets
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
      const queueNo = desc.queueNo ? `-${desc.queueNo}` : "";
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
        const cardName = `${prefix}${idShort}${name}${contact}${category}${queueNo}`;
        // Update newly created card with number{-name}{-contact}{-category} and desc
        await axios.put(
          `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&name=${encodeURIComponent(
            cardName
          )}`
        );

        res.json({ ticketId: id, ticketNumber: idShort });
      }
    } else if (httpMethod === "PUT") {
      const {
        id,
        newQueueId,
        newQueueName,
        position = "bottom",
      } = queryStringParameters;
      const { queueMap } = body;
      if (id && newQueueId) {
        await axios.put(
          `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${newQueueId}&pos=${position}`
        );
      } else if (id && newQueueName) {
        const queuesResponse = await axios.get(
          `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
        );

        const queuesResponseData: ITrelloBoardList[] = queuesResponse.data;

        const newQueue = queuesResponseData.find((queue) =>
          queue.name.includes(newQueueName)
        );
        const newQueueId = newQueue ? newQueue.id : null;

        const response = await axios.put(
          `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${newQueueId}&pos=${position}`
        );

        return res.status(201).json(response.data);
      } else if (newQueueId) {
        // Take from pending queue and put into queue Id
        const queuesResponse = await axios.get(
          `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
        );

        const queuesResponseData: ITrelloBoardList[] = queuesResponse.data;

        const pendingQueue = queuesResponseData.find((queue) =>
          queue.name.includes(EQueueTitles.PENDING)
        );
        const pendingQueueId = pendingQueue ? pendingQueue.id : null;

        const ticketsResponse = await axios.get(
          `${TRELLO_ENDPOINT}/lists/${pendingQueueId}/cards?${tokenAndKeyParams}`
        );

        const ticketsResponseData: ITrelloCard[] = ticketsResponse.data;
        const ticketIdOfFirstInPendingQueue = ticketsResponseData[0].id;
        console.log(
          "ticketIdOfFirstInPendingQueue",
          ticketIdOfFirstInPendingQueue
        );

        const response = await axios.put(
          `${TRELLO_ENDPOINT}/cards/${ticketIdOfFirstInPendingQueue}?${tokenAndKeyParams}&idList=${newQueueId}&pos=${position}`
        );

        return res.status(201).json(response.data);
      } else if (queueMap) {
        const requests = Object.entries(queueMap).map(
          ([ticketId, newQueueId]) =>
            axios.put(
              `${TRELLO_ENDPOINT}/cards/${ticketId}?${tokenAndKeyParams}&idList=${newQueueId}&pos=bottom`
            )
        );

        try {
          await Promise.all(requests);
          return res
            .status(201)
            .json({ message: "Successfully updated tickets" });
        } catch (error) {
          console.error("Error updating cards:", error);
          return res.status(400);
        }
      }
      res.json(null);
    } else if (httpMethod === "DELETE") {
      /**
       * DELETE /tickets
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
