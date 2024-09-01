import { Grid, GridItem } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import queryString from "query-string";
import axios from "axios";
import { API_ENDPOINT } from "../constants";
import { useInterval } from "../utils";
import { CurrentlyServingQueue } from "../components/View/CurrentlyServingQueue";
import { MissedQueue } from "../components/View/MissedQueue";
import { ViewHeader } from "../components/View/ViewHeader";
import { ViewFooter } from "../components/View/ViewFooter";
import * as _ from "lodash";
import {
  EQueueTitles,
  IQueue,
  IQueueSystem,
  ITicket,
  ITrelloBoardList,
  ITrelloList,
} from "../model";

const Index = () => {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [queueSystem, setQueueSystem] = useState<IQueueSystem>();
  const [queuePendingUrl, setQueuePendingUrl] = useState("");
  const [ticketsAlerted, setTicketsAlerted] = useState<ITicket[]>([]);
  const [ticketsMissed, setTicketsMissed] = useState<ITicket[]>([]);
  const [ticketsWithQueueNames, setTicketsWithQueueNames] = useState<ITicket[]>(
    []
  );

  useEffect(() => {
    getTicketsGroupedByQueue();
    getQueueSystem();
    setAudio(new Audio("/chime.mp3"));
  }, []);

  const refreshInterval = 10000; //process.env.NEXT_PUBLIC_REFRESH_INTERVAL || 5000
  useInterval(() => {
    getTicketsGroupedByQueue();
  }, refreshInterval);

  const getQueueSystem = async () => {
    const systemResult = await axios.get(`${API_ENDPOINT}/system`);

    setQueueSystem(systemResult.data.data);
  };

  const getTicketsGroupedByQueue = async () => {
    const ticketsResult = await axios.get(`${API_ENDPOINT}/tickets`);
    const queuesResult = await axios.get(`${API_ENDPOINT}/queues`);

    const tickets: ITicket[] = ticketsResult.data.data;
    const queues: IQueue[] = queuesResult.data.data;
    const missedQueueId = queues.filter(
      (queue: IQueue) => queue.name.indexOf(EQueueTitles.MISSED) > -1
    )[0].id;
    const alertQueueId = queues.filter(
      (queue: IQueue) => queue.name.indexOf(EQueueTitles.ALERTED) > -1
    )[0].id;
    const pendingQueueId = queues.filter(
      (queue: IQueue) => queue.name.indexOf(EQueueTitles.PENDING) > -1
    )[0].id;

    setTicketsWithQueueNames(
      tickets.map((ticket) => {
        return {
          ...ticket,
          queueName: queues.find((queue: IQueue) => queue.id === ticket.queueId)
            ?.name,
        };
      })
    );

    setTicketsMissed(
      tickets.filter((ticket: ITicket) => ticket.queueId === missedQueueId)
    );
    const latestTicketsAlerted = tickets.filter(
      (ticket: ITicket) => ticket.queueId === alertQueueId
    );

    if (hasNewAlerts(ticketsAlerted, latestTicketsAlerted) && audio) {
      try {
        audio.play();
      } catch (e) {
        console.log("Audio failed to play");
      }
    }

    setTicketsAlerted(latestTicketsAlerted);
    setQueuePendingUrl(pendingQueueId);
  };

  const hasNewAlerts = (current: ITicket[], latest: ITicket[]) => {
    if (!current || !latest) return false;
    const currentAlerts = _.flatMap(current).map(
      (ticket) => `${ticket.queueId}${ticket.name}`
    );
    const latestAlerts = _.flatMap(latest).map(
      (ticket) => `${ticket.queueId}${ticket.name}`
    );
    return (
      _.intersection(currentAlerts, latestAlerts).length < latestAlerts.length
    );
  };

  return (
    <>
      <Head>
        <title>Queue Status</title>
      </Head>
      <Grid
        h="100vh"
        templateColumns="repeat(7, 1fr)"
        templateRows="repeat(16, 1fr)"
      >
        <GridItem
          colSpan={7}
          rowSpan={1}
          bg="secondary.300"
          // height="120px"
        >
          <ViewHeader queueSystemName={queueSystem?.name} />
        </GridItem>
        <GridItem colSpan={5} rowSpan={14} bg="secondary.300">
          <CurrentlyServingQueue tickets={ticketsWithQueueNames} />
        </GridItem>
        <GridItem colSpan={2} rowSpan={14} bg="error.300">
          <MissedQueue
            tickets={ticketsMissed}
            queuePendingUrl={queuePendingUrl}
          />
        </GridItem>
        <GridItem colSpan={7} rowSpan={1} bg="base">
          <ViewFooter />
        </GridItem>
      </Grid>
    </>
  );
};

export default Index;
