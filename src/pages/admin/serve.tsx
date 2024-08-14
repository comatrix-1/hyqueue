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

interface Props {
  queue: any;
  currentTicketId: string;
  setCurrentTicketId: Dispatch<SetStateAction<string>>;
}

const Serve = ({
  queue: boardList,
  currentTicketId,
  setCurrentTicketId,
}: Props) => {
  const [queueAlertIds, setqueueAlertIds] = useState([]);
  const [ticketsAlerted, setTicketsAlerted] = useState([]);
  const [queueMissedIds, setQueueMissedIds] = useState([]);
  const [ticketsMissed, setTicketsMissed] = useState<any[]>([]); // TODO: change any
  const [queuePendingUrl, setQueuePendingUrl] = useState("");
  const [boardLists, setBoardLists] = useState({});
  const [tickets, setTickets] = useState<ITrelloCard[]>([]);
  const [ticket, setTicket] = useState<ITrelloCard>();
  const [queueInfo, setQueueInfo] = useState<ITrelloList>();
  const router = useRouter();

  const getQueueInfo = async (queueIdValue: string) => {
    if (!queueIdValue) return;

    const response = await axios.get(
      `${API_ENDPOINT}/queues?id=${queueIdValue}`
    );

    setQueueInfo(response?.data);
  };

  const navigateToManagementPage = () => {
    router.push("/admin/management");
  };

  const getListsWithCards = async (queueId: string) => {
    const response = await axios.get(
      `${API_ENDPOINT}/ticket?queueId=${queueId}`
    );

    console.log("tickets returned by API", response);

    setTicket(response.data[0]);
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
              <ServerControls />
              <Heading textStyle="heading2" fontSize="1rem" mb="1rem">
                {queueInfo?.name}
              </Heading>
              <Heading textStyle="heading1" fontSize="1.5rem">
                You are serving queue number:
              </Heading>

              <Flex direction="column" alignItems="center">
                <ManWithHourglass className="featured-image" />
              </Flex>

              <Heading
                mt="8px"
                textStyle="heading1"
                fontSize="3.5rem"
                letterSpacing="0.2rem"
              >
                {ticket?.idShort}
              </Heading>
              <Text
                mt="24px"
                textStyle="body2"
                fontSize="1.5rem"
                letterSpacing="0.1rem"
              >
                {ticket?.desc?.name}
              </Text>
              <Button
                bgColor="primary.500"
                borderRadius="3px"
                width="100%"
                color="white"
                size="lg"
                variant="solid"
                marginTop="2rem"
                onClick={navigateToManagementPage}
              >
                Go back to management page
              </Button>
            </Flex>
          </Center>
        </Main>
      </Container>
    </>
  );
};

export default Serve;
