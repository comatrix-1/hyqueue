import axios from "axios";
import * as _ from "lodash";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { useRouter } from "next/router";
import { ExportToCsv } from "export-to-csv";
import Head from "next/head";
import moment from "moment";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  Spinner,
} from "@chakra-ui/react";

import { Container } from "../../components/Container";
import { Main } from "../../components/Main";
import {
  InputCheckbox,
  InputEditable,
  InputText,
  InputTextarea,
  Navbar,
  OpeningHours,
} from "../../components/Admin";
import { authentication } from "../../utils";
import { mapSeries } from "bluebird";
import {
  IApiConfig,
  IEditableSettings,
  ITrelloBoardData,
  ITrelloBoardSettings,
} from "../../model";
import { API_ENDPOINT } from "../../constants";

const Index = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiConfig, setApiConfig] = useState<IApiConfig>();
  const [boardData, setBoardData] = useState<ITrelloBoardData>();
  const [editableSettings, setEditableSettings] = useState<IEditableSettings>({
    registrationFields: [],
    categories: [],
    feedbackLink: "",
    privacyPolicyLink: "",
    ticketPrefix: "",
    openingHours: [],
    waitTimePerTicket: null,
  });

  /**
   * TODO: move into a separate middleware service
   */
  const errorHandler = (error: any) => {
    // TODO: change any
    const searchParams = new URLSearchParams(window.location.search);
    const boardIdValue = searchParams.get("boardId") ?? "";

    if (error.response) {
      if (error.response.status === 401) {
        alert(`Your login token is expired. Please login again`);
        router.push({
          pathname: `/admin/login`,
          query: {
            boardId: boardIdValue,
          },
        });
      } else {
        alert(`Error ${error.response.status} : ${error.response.data}`);
      }
    } else {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };

  /**
   * Gets the board data from trello directly
   */
  const getBoard = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/view?type=board`
        // `https://api.trello.com/1/boards/${apiConfig.boardId}?key=${apiConfig.key}&token=${apiConfig.token}` // TODO: remove
      );

      console.log(response.data);
      setEditableSettings(JSON.parse(response.data.desc));
      setBoardData(response.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  /**
   * Updates the board settings
   *
   * Note that there is a 16384 character limit
   */
  const updateBoard = async (type = "settings", data = null) => {
    if (isSubmitting === true) return;

    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.boardId) {
      try {
        setIsSubmitting(true);
        let settings: ITrelloBoardSettings = { desc: "", name: "" };

        switch (type) {
          case "settings":
            const desc = JSON.stringify(editableSettings);
            //  Verify that the board desc does not exceed 16384 characters
            //  https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-put
            if (desc.length > 16384)
              throw Error(
                "Could not save due to setting JSON length exceeding 16384"
              );
            settings.desc = JSON.stringify(editableSettings);
            break;

          case "name":
            //  Return if the board name is not changed
            if (boardData?.name === data) return;

            //  Update the board name
            if (data) {
              settings.name = String(data);
            } else {
              throw Error(`Board name cannot be empty`);
            }
            break;

          default:
            throw Error(`Wrong type: ${type} provided in updating board`);
        }

        // await axios.put(
        //   `https://api.trello.com/1/boards/${apiConfig.boardId}?key=${apiConfig.key}&token=${apiConfig.token}`,
        //   settings
        // ); // TODO: re-implement PUT
      } catch (error) {
        errorHandler(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  /**
   * Effects
   */
  useEffect(() => {
    const token = authentication.getToken();
    const key = authentication.getKey();
    const searchParams = new URLSearchParams(window.location.search);
    const boardIdValue = searchParams.get("boardId");

    let boardId =
      boardIdValue || prompt("Please enter your queue id", "E.g. Yg9jAKfn");

    if (token && key) {
      router.push({
        pathname: `/admin`,
        query: {
          boardId,
        },
      });
      setApiConfig({
        token: authentication.getToken() ?? "",
        key: authentication.getKey() ?? "",
        boardId: boardId ?? "",
      });
    } else {
      //  redirects the user to the login page
      router.push({
        pathname: `/admin/login`,
        query: {
          boardId,
        },
      });
    }
  }, []);

  useEffect(() => {
    getBoard();
  }, [apiConfig]);

  /**
   * On Categories Change
   */
  const onCategoriesChange = (e: any) => {
    // TODO: change any
    const categories =
      e.target.value.trim() === "" ? [] : e.target.value.split(",");
    setEditableSettings({
      ...editableSettings,
      [e.target.id]: categories,
    });
  };

  /**
   * On Text Input Change
   */
  const onTextInputChange = (e: any) => {
    // TODO: change any
    setEditableSettings({
      ...editableSettings,
      [e.target.id]: e.target.value,
    });
  };

  /**
   * On Open Hours Input Change
   */
  const onOpeningHoursInputChange = (openingHours: any[]) => {
    // TODO: change any
    setEditableSettings({
      ...editableSettings,
      openingHours,
    });
  };

  /**
   * On Checkbox Input Change
   */
  const onCheckboxInputChange = (id: string, value: any) => {
    // TODO: change any
    setEditableSettings({
      ...editableSettings,
      [id]: value,
    });
  };

  /**
   * Generates a report on the Queue
   */
  const assembleCSVData = (
    batchCardActions: any[],
    doneCardMap: Map<any, any>,
    listsOnBoard: any[]
  ) => {
    // TODO: change any
    const extractDataFromCardActions = (cardActions: any[]) => {
      // TODO: change any
      let JOINED;
      let name;
      let nric = null;
      let ticketNumber;
      let cardId;
      let description;
      let labels: any; // TODO: change any
      let members;
      let date;
      let comments: any[] = []; // TODO: change any

      let columns = {};
      listsOnBoard.forEach((l) => {
        (columns as any)[l.name] = null; // TODO: change any
      });

      cardActions.forEach((action) => {
        const { type, data } = action;
        const actionDate = moment(action.date).utcOffset(8);
        const timestamp = actionDate.format("HH:mm:ss");
        if (type === "createCard") {
          date = actionDate.format("DD-MM-YYYY");
          JOINED = timestamp;
          cardId = data.card.id;
          const cardInfo = doneCardMap.get(data.card.id);
          description = cardInfo.desc;
          try {
            nric = JSON.parse(cardInfo.desc).nric ?? null;
          } catch (e) {}
          labels = cardInfo.labels.map((lbl: any) => lbl.name).join(","); // TODO: change any
          members = cardInfo.members
            .map((mbrs: any) => mbrs.username)
            .join(","); // TODO: change any
        } else if (type === "updateCard") {
          // Only process events with listAfter, this filters out other changes like editing card title
          if (data.listAfter) {
            // Only track existings lists
            if ((columns as any)[data.listAfter.name] === null) {
              (columns as any)[data.listAfter.name] = timestamp;
            }
            if (data.listAfter.name.includes("[DONE]")) {
              ticketNumber = data.card.idShort;
              name = data.card.name.replace(`${ticketNumber}-`, "");
            }
          }
        } else if (type === "commentCard") {
          if (data.text) {
            comments.push(data.text);
          }
        }
      });
      return {
        name,
        ticketNumber,
        nric,
        date,
        description,
        comments: comments.reverse().join("\n"),
        labels,
        members,
        JOINED,
        ...columns,
      };
    };

    let dataForExport: any[] = []; // TODO: change any

    batchCardActions.forEach((card) => {
      if (card["200"]) {
        const cardActions = card["200"];
        const row = extractDataFromCardActions(cardActions);

        // If multiple labels, have a row for each
        if (row.labels) {
          const labels = row.labels.split(",");
          labels.forEach((lbl: any) => {
            // TODO: change any
            dataForExport.push({ ...row, labels: lbl });
          });
        } else {
          dataForExport.push(row);
        }
      }
    });
    return dataForExport;
  };
  const exportToCSV = (data: any) => {
    // TODO: change any
    if (data.length === 0) {
      console.log("No logs found");
    } else {
      const csvExportOptions = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        showTitle: true,
        title: `Queue Report ${new Date().toString()}`,
        filename: `Queue Report ${new Date().toString()}`,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };
      const csvExporter = new ExportToCsv(csvExportOptions);
      csvExporter.generateCsv(data);
    }
  };
  const generateReport = async () => {
    try {
      setIsSubmitting(true);
      if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.boardId) {
        // Get list of board to find 'DONE' list id
        const listsOnBoard = (
          await axios.get(
            `https://api.trello.com/1/boards/${apiConfig.boardId}/lists?key=${apiConfig.key}&token=${apiConfig.token}`
          )
        ).data;

        const doneLists = listsOnBoard.filter(
          (
            list: any // TODO: change any
          ) => list.name.includes("[DONE]")
        );
        if (doneLists.length === 0) throw new Error("No [DONE] list found");
        const doneListIds = doneLists.map((l: any) => l.id); // TODO: change any

        const listBatchUrls = doneListIds
          .map((id: string) => `/lists/${id}/cards?members=true`)
          .join(",");

        // Get all the card ids on our '[DONE]' list
        const cardsOnDoneLists = (
          await axios.get(
            `https://api.trello.com/1/batch?urls=${listBatchUrls}&key=${apiConfig.key}&token=${apiConfig.token}`
          )
        ).data;

        const cardsOnList = _.flatten(
          cardsOnDoneLists.map((res: any) => res[200])
        ); // TODO: change any

        const doneCardIds = cardsOnList.map((card: any) => card.id); // TODO: change any
        if (doneCardIds.length === 0) {
          alert("There are no cards in the [DONE] list");
          throw new Error("[DONE] list is empty");
        }
        let doneCardMap = new Map();
        cardsOnList.forEach((card: any) => {
          doneCardMap.set(card.id, card); // TODO: change any
        });

        // Trello Batch api limits to 10 cards at a time. So we chunk the urls to batches of 10
        // https://developer.atlassian.com/cloud/trello/rest/api-group-batch/
        const batchUrls = _.chunk(
          doneCardIds.map(
            (id) =>
              `/cards/${id}/actions?filter=createCard%26filter=updateCard%26filter=commentCard`
          ),
          10
        );

        // Call Trello with a mapSeries to avoid swarming the rate limit, flatten the results so combinedData
        // resembles results of a single API call
        const combinedData = _.flatten(
          await mapSeries(batchUrls, async (urls) => {
            const batchAPICall = await axios.get(
              `https://api.trello.com/1/batch?urls=${urls.join(",")}&key=${
                apiConfig.key
              }&token=${apiConfig.token}`
            );
            return batchAPICall.data;
          })
        );

        const data = assembleCSVData(combinedData, doneCardMap, listsOnBoard);
        await exportToCSV(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Submits the  form
   *
   * @param {} e
   */
  const submit = async (e: any) => {
    // TODO: change any
    try {
      e.preventDefault();
      await updateBoard("settings");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Admin - QueueUp Sg</title>
      </Head>
      <Container>
        <Navbar />
        <Main justifyContent="start" minHeight="90vh" width="100%">
          <Center>
            {/* TODO: migrate to components for sanity */}
            {boardData ? (
              <Flex width="100%" maxW="1200px" flexDir="column">
                <Flex
                  width="100%"
                  flexDir="row"
                  justifyContent="space-between"
                  alignItems="center"
                  pb="10"
                >
                  <InputEditable
                    color="primary.500"
                    fontSize="xl"
                    isLoading={isSubmitting}
                    onSubmit={(boardName) => updateBoard("name", boardName)}
                    textStyle="heading1"
                    value={boardData.name}
                  />

                  <ButtonGroup>
                    <Button
                      display="flex"
                      colorScheme="blue"
                      borderRadius="3px"
                      color="white"
                      variant="solid"
                      onClick={() => router.push(`/support`)}
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
                    <Button
                      display="flex"
                      colorScheme="blue"
                      borderRadius="3px"
                      color="white"
                      variant="solid"
                      onClick={() => window.open(boardData.shortUrl)}
                    >
                      Go To Trello
                    </Button>
                  </ButtonGroup>
                </Flex>

                <Box layerStyle="card" width="100%">
                  <form onSubmit={submit}>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                      <Box w="100%">
                        {/* registration fields */}
                        <InputCheckbox
                          id="registrationFields"
                          label="Registration Fields"
                          value={editableSettings.registrationFields}
                          onChange={(value) =>
                            onCheckboxInputChange("registrationFields", value)
                          }
                          options={{
                            name: "Full Name",
                            contact: "Phone Number",
                            nric: "NRIC",
                            postalcode: "Postal Code",
                            description: "Description",
                          }}
                        />

                        {/* categories */}
                        <InputTextarea
                          id="categories"
                          label="Categories"
                          value={editableSettings.categories}
                          onChange={onCategoriesChange}
                        />

                        {/* feedback link */}
                        <InputText
                          id="feedbackLink"
                          label="Feedback Link"
                          type="url"
                          value={editableSettings.feedbackLink}
                          onChange={onTextInputChange}
                        />

                        {/* privacy link */}
                        <InputText
                          id="privacyPolicyLink"
                          label="Privacy Policy Link"
                          type="url"
                          value={editableSettings.privacyPolicyLink}
                          onChange={onTextInputChange}
                        />

                        {/* ticket prefix */}
                        <InputText
                          id="ticketPrefix"
                          label="Ticket Prefix"
                          type="text"
                          value={editableSettings.ticketPrefix}
                          onChange={onTextInputChange}
                        />

                        {/* Submit */}
                        <Button
                          isLoading={isSubmitting}
                          loadingText="Updating..."
                          colorScheme="primary"
                          borderRadius="3px"
                          color="white"
                          size="lg"
                          variant="solid"
                          marginTop="1.5rem"
                          type="submit"
                        >
                          Save Settings
                        </Button>
                      </Box>
                      <Box w="100%">
                        {/* Opening Hours */}
                        <OpeningHours
                          id="openingHours"
                          label="Opening Hours"
                          value={editableSettings.openingHours || {}}
                          onChange={onOpeningHoursInputChange}
                        />
                      </Box>
                    </Grid>
                  </form>
                </Box>
              </Flex>
            ) : (
              <Spinner />
            )}
          </Center>
        </Main>
      </Container>
    </>
  );
};

export default Index;
