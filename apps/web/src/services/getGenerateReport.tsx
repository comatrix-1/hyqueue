import axios from "axios";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import _ from "lodash";
import path from "path";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { IApiResponse } from "../model";

export const getGenerateReport = async (): Promise<IApiResponse<any>> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;

  const tokenAndKeyParams = `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  try {
    // Step 1: Get lists on the board
    const listsResponse = await axios.get(
      `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?${tokenAndKeyParams}`
    );
    const listsOnBoard = listsResponse.data;

    // Step 2: Filter for DONE lists
    const doneLists = listsOnBoard.filter((list: any) =>
      list.name.includes("[DONE]")
    );

    if (doneLists.length === 0) {
      throw new Error("No [DONE] list found");
    }

    const doneListIds = doneLists.map((list: any) => list.id);
    const listBatchUrls = doneListIds
      .map((id: string) => `/lists/${id}/cards?members=true`)
      .join(",");

    // Step 3: Get cards on DONE lists
    const cardsResponse = await axios.get(
      `${TRELLO_ENDPOINT}/batch?urls=${listBatchUrls}&${tokenAndKeyParams}`
    );
    const cardsOnLists = _.flatten(
      cardsResponse.data.map((res: any) => res["200"])
    );

    if (cardsOnLists.length === 0) {
      throw new Error("[DONE] lists are empty");
    }

    const doneCardMap = new Map();
    cardsOnLists.forEach((card: any) => {
      doneCardMap.set(card.id, card);
    });

    // Step 4: Fetch card actions
    const batchUrls = _.chunk(
      cardsOnLists.map(
        (card: any) =>
          `/cards/${card.id}/actions?filter=createCard%26filter=updateCard%26filter=commentCard`
      ),
      10
    );

    const combinedData = _.flatten(
      await Promise.all(
        batchUrls.map(async (urls) => {
          const batchResponse = await axios.get(
            `${TRELLO_ENDPOINT}/batch?urls=${urls.join(",")}&${tokenAndKeyParams}`
          );
          return batchResponse.data;
        })
      )
    );

    // Step 5: Assemble CSV data
    const csvData = assembleCSVData(combinedData, doneCardMap, listsOnBoard);

    // Step 6: Generate the CSV file content
    const filename = path.resolve(
      __dirname,
      `../../temp/Queue_Report_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.csv`
    );
    const csvBuffer = await generateCSVBuffer(csvData, filename);

    // Step 7: Return the file in the response
    return {
      status: 200,
      data: {
        message: "Report generated successfully",
        data: csvBuffer,
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

const generateCSVBuffer = async (
  data: any[],
  filepath: string
): Promise<Buffer> => {
  if (data.length === 0) {
    logger.info("No data available for export");
    return Buffer.from("");
  }

  const directoryPath = path.dirname(filepath);

  // Ensure the directory exists
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const csvWriter = createObjectCsvWriter({
    path: filepath,
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });

  try {
    await csvWriter.writeRecords(data);

    const resultBuffer = fs.readFileSync(filepath);

    return resultBuffer;
  } catch (error) {
    logger.error("Error writing CSV file", error);
    throw error;
  }
};

const assembleCSVData = (
  batchCardActions: any[],
  doneCardMap: Map<string, any>,
  listsOnBoard: any[]
): any[] => {
  const extractDataFromCardActions = (cardActions: any[]): any => {
    let name, date, description, labels, members, ticketNumber;
    let comments: string[] = [];
    let columns: Record<string, any> = {};

    listsOnBoard.forEach((list: any) => {
      columns[list.name] = null;
    });

    cardActions.forEach((action) => {
      const { type, data } = action;

      if (type === "createCard") {
        const card = doneCardMap.get(data.card.id);
        name = card.name;
        description = card.desc;
        labels = card.labels.map((lbl: any) => lbl.name).join(",");
        members = card.members.map((member: any) => member.username).join(",");
        date = action.date;
      } else if (type === "updateCard" && data.listAfter) {
        if (columns[data.listAfter.name] === null) {
          columns[data.listAfter.name] = action.date;
        }
        if (data.listAfter.name.includes("[DONE]")) {
          ticketNumber = data.card.idShort;
        }
      } else if (type === "commentCard" && data.text) {
        comments.push(data.text);
      }
    });

    return {
      name,
      ticketNumber,
      date,
      description,
      labels,
      members,
      comments: comments.reverse().join("\n"),
      ...columns,
    };
  };

  return batchCardActions
    .filter((card) => card["200"])
    .map((card) => extractDataFromCardActions(card["200"]));
};
