import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";

import Head from "next/head";
import { Navbar } from "../../components/Admin";
import { Main } from "../../components/Main";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../constants";
import * as _ from "lodash";
import {
  ITrelloBoardList,
  EQueueTitles,
  ITrelloCard,
  ITrelloList,
} from "../../model";
import ServerControls from "../../components/Admin/ServerControls";
import { Alerted } from "../../components/Ticket/Alerted";
import { useRouter } from "next/router";
import ManWithHourglass from "../../../src/assets/svg/man-with-hourglass.svg";

const Serve = () => {
  const [tickets, setTickets] = useState<ITrelloCard[]>([]);
  const [ticket, setTicket] = useState<ITrelloCard>();
  const [queueSystemInfo, setQueueSystemInfo] = useState<ITrelloList>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getQueueInfo = async (queueIdValue: string) => {
    if (!queueIdValue) return;

    const response = await axios.get(
      `${API_ENDPOINT}/queues?id=${queueIdValue}`
    );

    console.log("response", response);

    setQueueSystemInfo(response?.data);
  };

  const navigateToAdminPage = () => {
    router.push("/admin");
  };

  const getListsWithCards = async (queueId: string) => {
    const response = await axios.get(
      `${API_ENDPOINT}/tickets?queueId=${queueId}`
    );

    console.log("tickets returned by API", response);

    setTicket(response.data[0]);
  };

  const onComplete = async () => {
    console.log("onComplete ticket: ", ticket);
    setIsSubmitting(true);
    try {
      await axios.put(
        `${API_ENDPOINT}/tickets?id=${ticket?.id}&newQueueName=${EQueueTitles.DONE}`
      );

      const searchParams = new URLSearchParams(window.location.search);
      const queueIdValue = searchParams.get("queueId") ?? "";
      await getListsWithCards(queueIdValue);
    } catch {
      console.log("Error completing ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onMissed = async () => {
    console.log("onMissed ticket: ", ticket);
    setIsSubmitting(true);
    try {
      await axios.put(
        `${API_ENDPOINT}/tickets?id=${ticket?.id}&newQueueName=${EQueueTitles.MISSED}`
      );

      const searchParams = new URLSearchParams(window.location.search);
      const queueIdValue = searchParams.get("queueId") ?? "";
      await getListsWithCards(queueIdValue);
    } catch {
      console.log("Error completing ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTakeFromPending = async () => {
    if (ticket?.id) {
      await onComplete();
    }
    console.log("onTakeFromPending()");
    const searchParams = new URLSearchParams(window.location.search);
    const queueIdValue = searchParams.get("queueId") ?? "";
    setIsSubmitting(true);
    try {
      await axios.put(`${API_ENDPOINT}/tickets?newQueueId=${queueIdValue}`);

      await getListsWithCards(queueIdValue);
    } catch {
      console.log("Error completing ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queueIdValue = searchParams.get("queueId") ?? "";

    getQueueInfo(queueIdValue);
    getListsWithCards(queueIdValue);
  }, []);

  if (!tickets) return;

  return (
    <>
      <Head>
        <title>Queue Management - QueueUp Sg</title>
      </Head>
      <Container>
        <Navbar />
        <Main minHeight="90vh" width="100%">
          <Center>
            <Flex direction="column" alignItems="center">
              <ServerControls
                onComplete={onComplete}
                onMissed={onMissed}
                onTakeFromPending={onTakeFromPending}
                isSubmitting={isSubmitting}
              />
              <Heading textStyle="heading2" fontSize="1rem" mb="1rem">
                {queueSystemInfo?.name}
              </Heading>
              <Heading textStyle="heading1" fontSize="1.5rem">
                You are serving queue number:
              </Heading>
              <Flex direction="column" alignItems="center">
                <ManWithHourglass className="featured-image" />
              </Flex>
              {isSubmitting ? (
                <Spinner />
              ) : (
                <>
                  <Heading
                    mt="8px"
                    textStyle="heading1"
                    fontSize="3.5rem"
                    letterSpacing="0.2rem"
                  >
                    {ticket?.idShort ?? "-"}
                  </Heading>
                  <Text
                    mt="24px"
                    textStyle="body2"
                    fontSize="1.5rem"
                    letterSpacing="0.1rem"
                  >
                    {ticket?.desc?.name}
                  </Text>
                </>
              )}
              <Button
                bgColor="primary.500"
                borderRadius="3px"
                width="100%"
                color="white"
                size="lg"
                variant="solid"
                marginTop="2rem"
                onClick={navigateToAdminPage}
              >
                Go back to admin page
              </Button>
            </Flex>
          </Center>
        </Main>
      </Container>
    </>
  );
};

export default Serve;
