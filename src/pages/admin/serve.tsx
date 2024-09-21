import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";

import axios, { AxiosResponse } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Admin";
import ServerControls from "../../components/Admin/ServerControls";
import { Main } from "../../components/Main";
import withProtectedRoute from "../../components/withProtectedRoute";
import { API_ENDPOINT } from "../../constants";
import { EQueueTitles, ITicket, ITrelloList } from "../../model";

const Serve = () => {
  const [ticket, setTicket] = useState<ITicket>();
  const [queueSystemInfo, setQueueSystemInfo] = useState<ITrelloList>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getQueueInfo = async (queueIdValue: string) => {
    if (!queueIdValue) return;

    const response = await axios.get(`${API_ENDPOINT}/system`);

    setQueueSystemInfo(response?.data);
  };

  const navigateToAdminPage = () => {
    router.push("/admin");
  };

  const getListsWithCards = async (queueId: string) => {
    const result = await axios.get(
      `${API_ENDPOINT}/tickets?queueId=${queueId}`
    );
    const response = result.data as AxiosResponse;

    setTicket(response.data[0]);
  };

  const onComplete = async () => {
    setIsSubmitting(true);
    try {
      await axios.put(
        `${API_ENDPOINT}/tickets?id=${ticket?.id}&newQueueName=${EQueueTitles.DONE}`
      );

      const searchParams = new URLSearchParams(window.location.search);
      const queueIdValue = searchParams.get("queueId") ?? "";
      await getListsWithCards(queueIdValue);
    } catch {
      alert("Error updating ticket as complete");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onMissed = async () => {
    setIsSubmitting(true);
    try {
      await axios.put(
        `${API_ENDPOINT}/tickets?id=${ticket?.id}&newQueueName=${EQueueTitles.MISSED}`
      );

      const searchParams = new URLSearchParams(window.location.search);
      const queueIdValue = searchParams.get("queueId") ?? "";
      await getListsWithCards(queueIdValue);
    } catch {
      alert("Error updating ticket as missed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTakeFromPending = async () => {
    if (ticket?.id) {
      await onComplete();
    }
    const searchParams = new URLSearchParams(window.location.search);
    const queueIdValue = searchParams.get("queueId") ?? "";
    setIsSubmitting(true);
    try {
      const result = await axios.put(
        `${API_ENDPOINT}/tickets?newQueueId=${queueIdValue}`
      );
      if (result.status !== 201) {
        throw new Error(result.data.message);
      }

      await getListsWithCards(queueIdValue);
    } catch (err: any) {
      alert(err.message ?? "Error occurred");
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
                    {ticket?.ticketNumber ?? "-"}
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

export default withProtectedRoute(Serve);
