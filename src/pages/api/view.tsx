const axios = require("axios");
const { parse: parseUrl } = require("url");
import type { NextApiRequest, NextApiResponse } from "next";
import { ITicketDescription, ITrelloBoardList, ITrelloCard } from "../../model";

/**
 * Function for Board Trello API calls
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method: httpMethod, url } = req;
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
     * GET /view
     * - Retrieves info about a ticket and its position in queue
     * @param  {string} type The type of board data to retrieve
     * There are 3 types of api calls:
     */
    if (httpMethod === "GET") {
      let result = {};
      const { type } = queryStringParameters;
      console.log("GET()");
      console.log("type", type);
      console.log("queryStringParameters.board", queryStringParameters.board);
      /**
       * 1. board - Retrieves data about the board
       * *  @param  {string} board The board id
       */
      if (type === "boardlists") {
        /**
         * 2. boardlists - Retrieves all the lists that a board contains
         * *  @param  {string} board The board id
         */
        const boardLists = await axios.get(
          `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
        );
        result = boardLists.data;
      } else if (
        /**
         * 3. queues - Retrieve specifically the cards in Alert and Missed queues
         * *  @param  {string} queueAlertIds Comma delimited set of ids of the Alert queues
         * *  @param  {string} queueMissedIds Comma delimited set of ids of the Missed queues
         */
        type === "queues" &&
        queryStringParameters.queueAlertIds &&
        queryStringParameters.queueMissedIds
      ) {
        console.log("hit type === queues")
        const queueAlertIds = queryStringParameters.queueAlertIds.split(",");
        const queueMissedIds = queryStringParameters.queueMissedIds.split(",");
        const setOfBatchUrls: string[] = [];

        queueMissedIds.forEach((queueMissedId: string) => {
          setOfBatchUrls.push(`/lists/${queueMissedId}/cards`);
        });

        queueAlertIds.forEach((queueAlertId: string) => {
          setOfBatchUrls.push(`/lists/${queueAlertId}/cards`);
        });

        const batchUrls = setOfBatchUrls.join(",");
        const batchAPICall = await axios.get(
          `${TRELLO_ENDPOINT}/batch?urls=${batchUrls}&${tokenAndKeyParams}`
        );

        //Check that all Batch apis returned 200
        const allQueues = batchAPICall.data.filter(
          (queue: any) => Object.keys(queue)[0] === "200"
        ); // TODO: change any
        if (allQueues.length !== queueAlertIds.length + queueMissedIds.length) {
          res.status(400).json("Batch error");
          return;
        }

        const missedQueues = allQueues.slice(0, queueMissedIds.length);
        const allAlertQueues = allQueues.slice(queueMissedIds.length);

        //  Map the missed and alerted queues to the right keys
        result = {};
        // TODO: change any
        missedQueues.forEach(
          (queue: any, index: string | number) =>
            ((result as any)["missed"] = {
              ...(result as any)["missed"],
              [queueMissedIds[index]]: queue["200"],
            })
        );
        allAlertQueues.forEach(
          (queue: any, index: string | number) =>
            ((result as any)["alerted"] = {
              ...(result as any)["alerted"],
              [queueAlertIds[index]]: queue["200"],
            })
        );
      } else if (type === "queuesWithCards") {
        console.log('type === "queuesWithCards');
        // Get all lists on the board
        const listsResponse = await axios.get(
          `https://api.trello.com/1/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
        );

        const lists = listsResponse.data;
        console.log("lists", lists[0]);

        const listsWithCardsPromises = lists.map(
          async (list: ITrelloBoardList) => {
            const cardsResponse = await axios.get(
              `https://api.trello.com/1/lists/${list.id}/cards?${tokenAndKeyParams}`
            );

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
                desc: {
                  category: parsedDesc.category,
                  contact: parsedDesc.contact,
                  name: parsedDesc.name,
                  ticketPrefix: parsedDesc.ticketPrefix,
                },
              };
            });

            return {
              listId: list.id,
              listName: list.name,
              cards: cards,
            };
          }
        );

        const listsWithCards = await Promise.all(listsWithCardsPromises);

        result = listsWithCards;
      }
      res.json(result);
    } else {
      res.status(404).json(null);
    }
  } catch (err: any) {
    // TODO: change any
    console.error("error", err.response || err);
    res.status(400).json(null);
  }
}
