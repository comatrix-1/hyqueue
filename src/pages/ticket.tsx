import { useEffect, useState } from "react";
import { Text, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import queryString from "query-string";
import axios from "axios";
import { useCookies } from "react-cookie";

import { useInterval } from "../utils";
import { COOKIE_MAX_AGE, API_ENDPOINT } from "../constants";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/Navbar";
import { InQueue } from "../components/Ticket/InQueue";
import { NextInQueue } from "../components/Ticket/NextInQueue";
import { Alerted } from "../components/Ticket/Alerted";
import { Skipped } from "../components/Ticket/Skipped";
import { Served } from "../components/Ticket/Served";
import { NotFound } from "../components/Ticket/NotFound";
import { LeaveModal } from "../components/Ticket/LeaveModal";
import { EQueueTitles, ETicketStatus } from "../model";

const Index = () => {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const [refreshEnabled, setRefreshEnabled] = useState(true);

  const [waitTimePerTicket, setWaitTimePerTicket] = useState(3);
  const [numberOfTicketsAhead, setNumberOfTicketsAhead] = useState<number>();

  const [boardId, setBoardId] = useState<string>();
  const [ticketState, setTicketState] = useState<ETicketStatus>();
  const [ticketId, setTicketId] = useState<string>();
  const [queueId, setQueueId] = useState<string>();
  const [queueName, setQueueName] = useState<string>();
  const [ticketNumber, setTicketNumber] = useState<string>();
  const [displayTicketInfo, setDisplayTicketInfo] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [feedbackLink, setFeedbackLink] = useState<string>();

  const [cookies, setCookie, removeCookie] = useCookies(["ticket"]);

  // Leave queue modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ticketValue = searchParams.get("ticket");
    const queueValue = searchParams.get("queue");
    const boardValue = searchParams.get("board");
    const feedbackValue = searchParams.get("feedback");
    const waitTimePerTicketValue = searchParams.get("waitTimePerTicket");

    if (ticketValue && queueValue && boardValue) {
      setTicketId(ticketValue);
      setBoardId(boardValue);
      getTicketStatus(ticketValue, boardValue);

      // Save ticket info to cookie
      setCookie(
        "ticket",
        {
          queue: queueValue,
          ticket: ticketValue,
          board: boardValue,
        },
        { maxAge: COOKIE_MAX_AGE }
      );
      //Save feedback link
      if (feedbackValue) setFeedbackLink(feedbackValue);

      //Save wait time per ticket
      if (waitTimePerTicketValue && !isNaN(Number(waitTimePerTicketValue)))
        setWaitTimePerTicket(Number(waitTimePerTicketValue));
    }
  }, []);

  const refreshInterval =
    Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL) || 5000;
  useInterval(() => {
    if (refreshEnabled && ticketId && boardId)
      getTicketStatus(ticketId, boardId);
  }, refreshInterval);

  const getTicketStatus = async (ticket: string, board: string) => {
    try {
      const getTicket = await axios.get(`${API_ENDPOINT}/tickets?id=${ticket}`);
      console.log("getTicket", getTicket);
      const {
        queueId,
        queueName,
        desc: ticketDesc,
        numberOfTicketsAhead,
        idShort: ticketNumber,
      } = getTicket.data;

      //Update queueId in case ticket has been shifted
      setQueueId(queueId);

      setTicketNumber(ticketNumber);

      if (ticketDesc !== "") {
        setDisplayTicketInfo(
          `${ticketDesc.name ? ticketDesc.name : ""} ${
            ticketDesc.contact ? ticketDesc.contact : ""
          }`
        );
      }
      setNumberOfTicketsAhead(numberOfTicketsAhead);
      // // Update timestamp
      const timestamp = new Date().toLocaleString("en-UK", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setLastUpdated(timestamp);

      // Hack: Check whether to alert the user based on if the
      // queue name contains the word 'alert'
      // USING THE CONSTANT BREAKS I18N? IDK HOW
      if (queueName.includes(EQueueTitles.ALERTED)) {
        setQueueName(queueName.replace(EQueueTitles.ALERTED, "").trim());
        setTicketState(ETicketStatus.ALERTED);
      } else if (queueName.includes(EQueueTitles.DONE)) {
        setTicketState(ETicketStatus.SERVED);
        setRefreshEnabled(false);
        removeCookie("ticket"); // Remove cookie so they can join the queue again
      } else if (queueName.includes(EQueueTitles.MISSED)) {
        setTicketState(ETicketStatus.MISSED);
      } else if (numberOfTicketsAhead === -1) {
        throw new Error("Ticket not found");
      } else {
        setTicketState(ETicketStatus.PENDING);
      }
    } catch (err: any) {
      // TODO: change any
      // Check if err is status 429 i.e. Trello rate limit
      // if so do nothing, will retry on the next interval
      if (err.response && err.response.status === 429) {
        console.log("429 detected");
        return;
      }
      setTicketState(ETicketStatus.ERROR);
      setRefreshEnabled(false);
      removeCookie("ticket"); // Remove cookie so they can join the queue again
    }
  };

  const leaveQueue = async () => {
    try {
      axios.delete(`${API_ENDPOINT}/tickets?id=${ticketId}&boardId=${boardId}`);
      removeCookie("ticket");
      router.push({
        pathname: "/queue",
        query: { id: queueId },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const rejoinQueue = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const ticketValue = searchParams.get("ticket");
    const queueValue = searchParams.get("queue");
    const boardIdValue = searchParams.get("boardId");

    if (queueValue && ticketValue && boardIdValue) {
      // NOTE: Using query string queue as that is the initial queue not the current queue
      await axios.put(
        `${API_ENDPOINT}/tickets?id=${ticketId}&newQueueId=${queueValue}`
      );
      await getTicketStatus(ticketValue, boardIdValue);
    }
  };

  const renderTicket = () => {
    // There are 4 possible ticket states
    // 1. Alerted - Ticket is called by admin
    if (ticketState === ETicketStatus.ALERTED) {
      return (
        <Alerted
          waitingTime={waitTimePerTicket}
          openLeaveModal={onOpen}
          queueId={queueId}
          queueName={queueName}
          ticketId={ticketId}
        />
      );
    }
    // 2. Served - Ticket is complete
    else if (ticketState === ETicketStatus.SERVED) {
      return <Served feedbackLink={feedbackLink} />;
    }
    // 3. Missed - Ticket is in [MISSED] / not in the queue / queue doesnt exist
    else if (ticketState === ETicketStatus.MISSED) {
      return <Skipped rejoinQueue={rejoinQueue} />;
    } else if (
      ticketState === ETicketStatus.ERROR ||
      numberOfTicketsAhead === -1
    ) {
      return <NotFound />;
    }
    // 4. Next - Ticket 1st in line
    else if (numberOfTicketsAhead === 0) {
      return (
        <NextInQueue
          waitingTime={waitTimePerTicket}
          openLeaveModal={onOpen}
          queueId={queueId}
          ticketId={ticketId}
          numberOfTicketsAhead={numberOfTicketsAhead}
        />
      );
    }
    // 5. Line - Ticket is behind at least 1 person
    else if (numberOfTicketsAhead && numberOfTicketsAhead > 0) {
      return (
        <InQueue
          waitingTime={waitTimePerTicket}
          openLeaveModal={onOpen}
          queueId={queueId}
          ticketId={ticketId}
          numberOfTicketsAhead={numberOfTicketsAhead}
        />
      );
    }
    // This is blank as the loading state
    else {
      return <></>;
    }
  };

  return (
    <>
      <Head>
        <title>QueueUp SG</title>
      </Head>
      <Container>
        <LeaveModal
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          leaveQueue={leaveQueue}
        />
        <NavBar />
        <Main>
          {ticketState != ETicketStatus.ERROR && (
            <Flex direction="column" alignItems="center">
              <Heading textStyle="heading1" fontSize="1.5rem">
                Queue Number
              </Heading>
              <Heading
                mt="8px"
                textStyle="heading1"
                fontSize="3.5rem"
                letterSpacing="0.2rem"
              >
                {ticketNumber}
              </Heading>
              <Text
                mt="24px"
                textStyle="body2"
                fontSize="1.5rem"
                letterSpacing="0.1rem"
              >
                {displayTicketInfo}
              </Text>
            </Flex>
          )}

          <Flex direction="column" alignItems="center">
            <Flex direction="column" alignItems="center" w="360px" maxW="100%">
              {renderTicket()}
            </Flex>
            <Flex direction="column" py={4} w="360px" maxW="100%">
              <Text textAlign="center" textStyle="body2" color="gray.500">
                {t("last-updated-automatically-at")} {lastUpdated}
              </Text>
            </Flex>
          </Flex>
        </Main>
        <Footer />
      </Container>
    </>
  );
};

export default Index;
