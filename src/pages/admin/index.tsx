import { Center, Flex, Spinner } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { InputEditable, Navbar } from "../../components/Admin";
import EditableSettings from "../../components/Admin/EditableSettings";
import Links from "../../components/Admin/Links";
import { Container } from "../../components/Container";
import { Main } from "../../components/Main";
import { API_ENDPOINT } from "../../constants";
import { IApiConfig, ITrelloBoardSettings } from "../../model";
import { authentication } from "../../utils";

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

      setBoardData(response.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const updateBoard = async (data: ITrelloBoardSettings) => {
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

        await axios.put(`${API_ENDPOINT}/system`, settings);
        window.location.reload();
      } catch (error) {
        errorHandler(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleQueueIsDisabled = () => {
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
      await updateBoard({ desc: e });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Admin - Hyqueue</title>
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

                  <Links toggleQueueIsDisabled={toggleQueueIsDisabled} />
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
