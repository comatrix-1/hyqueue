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
} from "../../components/Admin";
import { authentication } from "../../utils";
import { mapSeries } from "bluebird";
import { IApiConfig, ITrelloBoardSettings } from "../../model";
import { API_ENDPOINT } from "../../constants";
import EditableSettings from "../../components/Admin/EditableSettings";
import Links from "../../components/Admin/Links";
import { FormikHelpers } from "formik";

const Index = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiConfig, setApiConfig] = useState<IApiConfig>();
  const [boardData, setBoardData] = useState<ITrelloBoardSettings>();

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
      setBoardData(response.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const updateBoard = async (data: ITrelloBoardSettings) => {
    console.log("updateBoard() data: ", data);
    if (isSubmitting) return;

    if (apiConfig && apiConfig.key && apiConfig.token) {
      try {
        setIsSubmitting(true);
        let settings: ITrelloBoardSettings | null = null;

        if (data.name && data.name !== boardData?.name) {
          // Is changing name
          settings = {
            name: data.name,
          };
        } else {
          // Is changing desc

          //  Verify that the board desc does not exceed 16384 characters
          //  https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-put
          if (JSON.stringify(data).length > 16384)
            throw Error(
              "Could not save due to setting JSON length exceeding 16384"
            );
          settings = {
            desc: data.desc,
          };
        }

        console.log("updating settings:", settings);
        await axios.put(`${API_ENDPOINT}/system`, settings);
        window.location.reload();
      } catch (error) {
        errorHandler(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleBoardIsDisabled = () => {
    console.log("toggleBoardIsDisabled()");
    if (isSubmitting) return;

    const newName = boardData?.name?.includes("[DISABLED]")
      ? boardData?.name.replace("[DISABLED]", "")
      : `${boardData?.name || ""} [DISABLED]`;

    updateBoard({ name: newName });
  };

  useEffect(() => {
    const token =
      process.env.NODE_ENV === "development"
        ? "testToken"
        : authentication.getToken();
    const key =
      process.env.NODE_ENV === "development"
        ? "testKey"
        : authentication.getKey();

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
      console.log("submit, e", e);
      await updateBoard({ desc: e });
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
                    onSubmit={(name) => updateBoard({ name })}
                    textStyle="heading1"
                    value={boardData.name}
                  />

                  <Links toggleBoardIsDisabled={toggleBoardIsDisabled} />
                </Flex>

                {boardData?.desc ? (
                  <EditableSettings
                    editableSettings={boardData?.desc}
                    submit={submit}
                  />
                ) : null}
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
