import { ButtonGroup, Button } from "@chakra-ui/react";
import axios from "axios";
import { mapSeries } from "bluebird";
import _ from "lodash";
import router from "next/router";
import { useState } from "react";

const Links = ({ trelloUrl }: { trelloUrl: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const generateReportFeatureFlag = false;

  const generateReport = () => {
    // TODO: write function
  };
  // const generateReport = async () => {
  //     try {
  //       setIsSubmitting(true);
  //       if (apiConfig && apiConfig.key && apiConfig.token) {
  //         // Get list of board to find 'DONE' list id
  //         const listsOnBoard = (
  //           await axios.get(
  //             `https://api.trello.com/1/boards/${boardId}/lists?key=${apiConfig.key}&token=${apiConfig.token}`
  //           )
  //         ).data;

  //         const doneLists = listsOnBoard.filter(
  //           (
  //             list: any // TODO: change any
  //           ) => list.name.includes("[DONE]")
  //         );
  //         if (doneLists.length === 0) throw new Error("No [DONE] list found");
  //         const doneListIds = doneLists.map((l: any) => l.id); // TODO: change any

  //         const listBatchUrls = doneListIds
  //           .map((id: string) => `/lists/${id}/cards?members=true`)
  //           .join(",");

  //         // Get all the card ids on our '[DONE]' list
  //         const cardsOnDoneLists = (
  //           await axios.get(
  //             `https://api.trello.com/1/batch?urls=${listBatchUrls}&key=${apiConfig.key}&token=${apiConfig.token}`
  //           )
  //         ).data;

  //         const cardsOnList = _.flatten(
  //           cardsOnDoneLists.map((res: any) => res[200])
  //         ); // TODO: change any

  //         const doneCardIds = cardsOnList.map((card: any) => card.id); // TODO: change any
  //         if (doneCardIds.length === 0) {
  //           alert("There are no cards in the [DONE] list");
  //           throw new Error("[DONE] list is empty");
  //         }
  //         let doneCardMap = new Map();
  //         cardsOnList.forEach((card: any) => {
  //           doneCardMap.set(card.id, card); // TODO: change any
  //         });

  //         // Trello Batch api limits to 10 cards at a time. So we chunk the urls to batches of 10
  //         // https://developer.atlassian.com/cloud/trello/rest/api-group-batch/
  //         const batchUrls = _.chunk(
  //           doneCardIds.map(
  //             (id) =>
  //               `/cards/${id}/actions?filter=createCard%26filter=updateCard%26filter=commentCard`
  //           ),
  //           10
  //         );

  //         // Call Trello with a mapSeries to avoid swarming the rate limit, flatten the results so combinedData
  //         // resembles results of a single API call
  //         const combinedData = _.flatten(
  //           await mapSeries(batchUrls, async (urls) => {
  //             const batchAPICall = await axios.get(
  //               `https://api.trello.com/1/batch?urls=${urls.join(",")}&key=${
  //                 apiConfig.key
  //               }&token=${apiConfig.token}`
  //             );
  //             return batchAPICall.data;
  //           })
  //         );

  //         const data = assembleCSVData(combinedData, doneCardMap, listsOnBoard);
  //         await exportToCSV(data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  //   const assembleCSVData = (
  //     batchCardActions: any[],
  //     doneCardMap: Map<any, any>,
  //     listsOnBoard: any[]
  //   ) => {
  //     // TODO: change any
  //     const extractDataFromCardActions = (cardActions: any[]) => {
  //       // TODO: change any
  //       let JOINED;
  //       let name;
  //       let nric = null;
  //       let ticketNumber;
  //       let cardId;
  //       let description;
  //       let labels: any; // TODO: change any
  //       let members;
  //       let date;
  //       let comments: any[] = []; // TODO: change any

  //       let columns = {};
  //       listsOnBoard.forEach((l) => {
  //         (columns as any)[l.name] = null; // TODO: change any
  //       });

  //       cardActions.forEach((action) => {
  //         const { type, data } = action;
  //         const actionDate = moment(action.date).utcOffset(8);
  //         const timestamp = actionDate.format("HH:mm:ss");
  //         if (type === "createCard") {
  //           date = actionDate.format("DD-MM-YYYY");
  //           JOINED = timestamp;
  //           cardId = data.card.id;
  //           const cardInfo = doneCardMap.get(data.card.id);
  //           description = cardInfo.desc;
  //           try {
  //             nric = JSON.parse(cardInfo.desc).nric ?? null;
  //           } catch (e) {}
  //           labels = cardInfo.labels.map((lbl: any) => lbl.name).join(","); // TODO: change any
  //           members = cardInfo.members
  //             .map((mbrs: any) => mbrs.username)
  //             .join(","); // TODO: change any
  //         } else if (type === "updateCard") {
  //           // Only process events with listAfter, this filters out other changes like editing card title
  //           if (data.listAfter) {
  //             // Only track existings lists
  //             if ((columns as any)[data.listAfter.name] === null) {
  //               (columns as any)[data.listAfter.name] = timestamp;
  //             }
  //             if (data.listAfter.name.includes("[DONE]")) {
  //               ticketNumber = data.card.idShort;
  //               name = data.card.name.replace(`${ticketNumber}-`, "");
  //             }
  //           }
  //         } else if (type === "commentCard") {
  //           if (data.text) {
  //             comments.push(data.text);
  //           }
  //         }
  //       });
  //       return {
  //         name,
  //         ticketNumber,
  //         nric,
  //         date,
  //         description,
  //         comments: comments.reverse().join("\n"),
  //         labels,
  //         members,
  //         JOINED,
  //         ...columns,
  //       };
  //     };

  //     let dataForExport: any[] = []; // TODO: change any

  //     batchCardActions.forEach((card) => {
  //       if (card["200"]) {
  //         const cardActions = card["200"];
  //         const row = extractDataFromCardActions(cardActions);

  //         // If multiple labels, have a row for each
  //         if (row.labels) {
  //           const labels = row.labels.split(",");
  //           labels.forEach((lbl: any) => {
  //             // TODO: change any
  //             dataForExport.push({ ...row, labels: lbl });
  //           });
  //         } else {
  //           dataForExport.push(row);
  //         }
  //       }
  //     });
  //     return dataForExport;
  //   };
  //   const exportToCSV = (data: any) => {
  //     // TODO: change any
  //     if (data.length === 0) {
  //       console.log("No logs found");
  //     } else {
  //       const csvExportOptions = {
  //         fieldSeparator: ",",
  //         quoteStrings: '"',
  //         decimalSeparator: ".",
  //         showLabels: true,
  //         showTitle: true,
  //         title: `Queue Report ${new Date().toString()}`,
  //         filename: `Queue Report ${new Date().toString()}`,
  //         useTextFile: false,
  //         useBom: true,
  //         useKeysAsHeaders: true,
  //       };
  //       const csvExporter = new ExportToCsv(csvExportOptions);
  //       csvExporter.generateCsv(data);
  //     }
  //   };

  return (
    <ButtonGroup>
      <Button
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        onClick={() => router.push(`/admin/management`)}
      >
        Queue management
      </Button>
      <Button
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        onClick={() => router.push(`/support`)}
      >
        Get Links
      </Button>
      {generateReportFeatureFlag ? (
        <Button
          isLoading={isSubmitting}
          display="flex"
          colorScheme="blue"
          borderRadius="3px"
          color="white"
          variant="solid"
          onClick={generateReport}
        >
          Generate Report
        </Button>
      ) : null}
      <Button
        display="flex"
        colorScheme="blue"
        borderRadius="3px"
        color="white"
        variant="solid"
        onClick={() => window.open(trelloUrl)}
      >
        Go To Trello
      </Button>
    </ButtonGroup>
  );
};

export default Links;
