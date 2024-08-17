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
import { API_ENDPOINT, IS_TEST } from "../../constants";
import EditableSettings from "../../components/Admin/EditableSettings";
import Links from "../../components/Admin/Links";
import { FormikHelpers } from "formik";

const Index = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiConfig, setApiConfig] = useState<IApiConfig>();
  const [boardId, setBoardId] = useState<string>("");
  const [boardData, setBoardData] = useState<any>();
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
      const response = await axios.get(`${API_ENDPOINT}/system`);

      console.log("getBoard() response: ", response.data);
      setBoardData(response.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const updateBoard = async (type = "settings", data = null) => {
    if (isSubmitting) return;

    if (apiConfig && apiConfig.key && apiConfig.token) {
      try {
        setIsSubmitting(true);
        let settings: ITrelloBoardSettings = { name: "" };

        switch (type) {
          case "settings":
            const desc = JSON.stringify(editableSettings);
            //  Verify that the board desc does not exceed 16384 characters
            //  https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-put
            if (desc.length > 16384)
              throw Error(
                "Could not save due to setting JSON length exceeding 16384"
              );
            settings.desc = editableSettings;
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

        await axios.put(`${API_ENDPOINT}/system`, settings);
        getBoard();
      } catch (error) {
        errorHandler(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    const token = IS_TEST ? "testToken" : authentication.getToken();
    const key = IS_TEST ? "testKey" : authentication.getKey();

    if (token && key) {
      setApiConfig({
        token: token,
        key: key,
      });
      getBoard();
    } else {
      router.push({
        pathname: `/admin/login`,
      });
    }
  }, []);

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

                  <Links trelloUrl={boardData.shortUrl} />
                </Flex>

                <EditableSettings
                  editableSettings={boardData?.desc}
                  submit={submit}
                />
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
