import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

import Head from "next/head";
import { Navbar } from "../../components/Admin";
import { Main } from "../../components/Main";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../constants";
import * as _ from "lodash";
import { ITrelloBoardList, EQueueTitles } from "../../model";
import ServerControls from "../../components/Admin/ServerControls";
import { useRouter } from "next/router";

const Management = () => {
  const [queues, setQueues] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getQueues();
  }, []);

  const getQueues = async () => {
    const response = await axios.get(`${API_ENDPOINT}/queues`);

    if (!response?.data) {
      console.log("getQueues() :: Failed to get queues");
    }

    setQueues(response.data);
  };

  const onSelectQueue = (queueId: string) => {
    console.log("onSelectQueue()", queueId);
    router.push(`/admin/serve?queueId=${queueId}`);
  };

  return (
    <>
      <Head>
        <title>Queue Management - QueueUp Sg</title>
      </Head>
      <Container>
        <Navbar />
        <Main justifyContent="start" minHeight="90vh" width="100%">
          <Center>
            <Flex direction="column" alignItems="center">
              <Text>Select queue</Text>
              {queues.map((queue: ITrelloBoardList) => (
                <Button
                  key={queue.id}
                  display="flex"
                  colorScheme="blue"
                  borderRadius="3px"
                  color="white"
                  variant="solid"
                  my={1}
                  onClick={() => onSelectQueue(queue.id)}
                >
                  {queue.name}
                </Button>
              ))}
            </Flex>
          </Center>
        </Main>
      </Container>
    </>
  );
};

export default Management;
