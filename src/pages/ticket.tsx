import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Main } from "../components/Main";
import { NavBar } from "../components/Navbar";
import { Alerted } from "../components/Ticket/Alerted";
import { InQueue } from "../components/Ticket/InQueue";
import { LeaveModal } from "../components/Ticket/LeaveModal";
import { NextInQueue } from "../components/Ticket/NextInQueue";
import { NotFound } from "../components/Ticket/NotFound";
import { Served } from "../components/Ticket/Served";
import { Skipped } from "../components/Ticket/Skipped";
import { API_ENDPOINT, COOKIE_MAX_AGE } from "../constants";
import {
  EQueueTitles,
  ETicketStatus,
  IEditableSettings,
  ITicket,
} from "../model";
import { useInterval } from "../utils";

const Index = () => {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const [refreshEnabled, setRefreshEnabled] = useState(true);
  const [ticketState, setTicketState] = useState<ETicketStatus>();
  const [ticketId, setTicketId] = useState<string>();
  const [ticketNumber, setTicketNumber] = useState<string>();
  const [ticket, setTicket] = useState<ITicket>();
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [editableSettings, setEditableSettings] = useState<IEditableSettings>({
    registrationFields: [],
    categories: [],
    feedbackLink: "",
    privacyPolicyLink: "",
    ticketPrefix: "",
    openingHours: [],
    waitTimePerTicket: null,
    openingHoursTimeZone: "Asia/Singapore",
  });

  const [cookies, setCookie, removeCookie] = useCookies(["ticket"]);

  // Leave queue modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ticketIdValue = searchParams.get("id");

    if (ticketIdValue) {
      setTicketId(ticketIdValue);
      getTicketStatus(ticketIdValue);

      // Save ticket info to cookie
      setCookie(
        "ticket",
        {
          id: ticketIdValue,
        },
        { maxAge: COOKIE_MAX_AGE }
      );
    }

    getQueueSystem();
  }, []);

  const refreshInterval =
    Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL) || 5000;
  useInterval(() => {
    if (refreshEnabled && ticketId) getTicketStatus(ticketId);
  }, refreshInterval);

  const getTicketStatus = async (ticketId: string) => {
    if (!ticketId) return;
    try {
      const getTicket = await axios.get(
        `${API_ENDPOINT}/tickets?id=${ticketId}`
      );
      const getTicketData = getTicket.data;
      if (!getTicketData.data) return;

      const retrievedTicket = getTicketData.data;

      setTicket(retrievedTicket);
      setTicketNumber(ticketNumber);

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
      if (retrievedTicket?.queueName.includes(EQueueTitles.ALERTED)) {
        setTicketState(ETicketStatus.ALERTED);
      } else if (retrievedTicket?.queueName.includes(EQueueTitles.DONE)) {
        setTicketState(ETicketStatus.SERVED);
        setRefreshEnabled(false);
        removeCookie("ticket"); // Remove cookie so they can join the queue again
      } else if (retrievedTicket?.queueName.includes(EQueueTitles.MISSED)) {
        setTicketState(ETicketStatus.MISSED);
      } else if (retrievedTicket?.numberOfTicketsAhead === -1) {
        throw new Error("Ticket not found");
      } else {
        setTicketState(ETicketStatus.PENDING);
      }
    } catch (err: any) {
      // TODO: change any
      // Check if err is status 429 i.e. Trello rate limit
      // if so do nothing, will retry on the next interval
      if (err.response && err.response.status === 429) {
        return;
      }
      setTicketState(ETicketStatus.ERROR);
      setRefreshEnabled(false);
      removeCookie("ticket"); // Remove cookie so they can join the queue again
    }
  };

  const getQueueSystem = async () => {
    try {
      const result = await axios.get(`${API_ENDPOINT}/system`);
      const response = result.data as AxiosResponse;
      const queueSystemSettings = response.data;
      const editableSettingsDesc = queueSystemSettings?.desc;

      if (!editableSettingsDesc) throw new Error("");

      setEditableSettings(editableSettingsDesc);
    } catch (err) {}
  };

  const leaveQueue = async () => {
    try {
      axios.delete(`${API_ENDPOINT}/tickets?id=${ticketId}`);
      removeCookie("ticket");
      router.push({
        pathname: "/queue",
      });
    } catch (error) {
      alert("Failed to leave queue");
    }
  };

  const rejoinQueue = async () => {
    await axios.put(
      `${API_ENDPOINT}/tickets?id=${ticketId}&newQueueName=${EQueueTitles.PENDING}`
    );
    await getTicketStatus(ticketId ?? "");
  };

  const renderTicket = () => {
    // There are 4 possible ticket states
    // 1. Alerted - Ticket is called by admin
    if (ticketState === ETicketStatus.ALERTED) {
      return (
        <Alerted
          waitingTime={editableSettings?.waitTimePerTicket}
          openLeaveModal={onOpen}
          ticketId={ticketId}
          ticket={ticket}
        />
      );
    }
    // 2. Served - Ticket is complete
    else if (ticketState === ETicketStatus.SERVED) {
      return <Served feedbackLink={editableSettings?.feedbackLink} />;
    }
    // 3. Missed - Ticket is in [MISSED] / not in the queue / queue doesnt exist
    else if (ticketState === ETicketStatus.MISSED) {
      return <Skipped rejoinQueue={rejoinQueue} ticket={ticket} />;
    } else if (
      ticketState === ETicketStatus.ERROR ||
      ticket?.numberOfTicketsAhead === -1
    ) {
      return <NotFound />;
    }
    // 4. Next - Ticket 1st in line
    else if (ticket?.numberOfTicketsAhead === 0) {
      return (
        <NextInQueue
          waitingTime={editableSettings?.waitTimePerTicket}
          openLeaveModal={onOpen}
          ticketId={ticketId}
          numberOfTicketsAhead={ticket?.numberOfTicketsAhead}
          ticket={ticket}
        />
      );
    }
    // 5. Line - Ticket is behind at least 1 person
    else if (ticket?.numberOfTicketsAhead && ticket?.numberOfTicketsAhead > 0) {
      return (
        <InQueue
          waitingTime={editableSettings?.waitTimePerTicket}
          openLeaveModal={onOpen}
          ticketId={ticketId}
          numberOfTicketsAhead={ticket?.numberOfTicketsAhead}
          ticket={ticket}
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
              <Heading
                textStyle="heading1"
                fontSize="1.5rem"
                color="primary.500"
              >
                Queue Number
              </Heading>
              <Heading
                mt="8px"
                textStyle="heading1"
                fontSize="3.5rem"
                letterSpacing="0.2rem"
                color="primary.500"
              >
                {ticketNumber}
              </Heading>
            </Flex>
          )}

          <Flex direction="column" alignItems="center">
            <Flex direction="column" alignItems="center" w="360px" maxW="100%">
              {renderTicket()}
            </Flex>
            <Flex direction="column" py={4} w="360px" maxW="100%">
              <Text textAlign="center" textStyle="body2" color="gray.600">
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
