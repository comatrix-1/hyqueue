import { Grid, GridItem } from "@chakra-ui/react";
import axios from "axios";
import * as _ from "lodash";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CurrentlyServingQueue } from "../components/View/CurrentlyServingQueue";
import { MissedQueue } from "../components/View/MissedQueue";
import { ViewFooter } from "../components/View/ViewFooter";
import { ViewHeader } from "../components/View/ViewHeader";
import { API_ENDPOINT } from "../constants";
import { EQueueTitles, IQueue, IQueueSystem, ITicket } from "../model";
import { useInterval } from "../utils";

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

    const tmpTicketsWithQueueNames = tickets.map((ticket) => {
      return {
        ...ticket,
        queueName: queues.find((queue: IQueue) => queue.id === ticket.queueId)
          ?.name,
      };
    });

    const pendingQueueId = queues.filter(
      (queue: IQueue) => queue.name.indexOf(EQueueTitles.PENDING) > -1
    )[0].id;

    const latestTicketsAlerted = tmpTicketsWithQueueNames.filter(
      (ticket: ITicket) =>
        ticket?.queueName?.indexOf(EQueueTitles.ALERTED)
          ? ticket?.queueName?.indexOf(EQueueTitles.ALERTED) > -1
          : true
    );

    if (hasNewAlerts(ticketsAlerted, latestTicketsAlerted) && audio) {
      try {
        audio.play();
      } catch (e) {
        console.log("Audio failed to play");
      }
    }

    setTicketsWithQueueNames(tmpTicketsWithQueueNames);

    setTicketsMissed(
      tmpTicketsWithQueueNames.filter((ticket: ITicket) =>
        ticket?.queueName?.indexOf(EQueueTitles.MISSED)
          ? ticket?.queueName?.indexOf(EQueueTitles.MISSED) > -1
          : true
      )
    );
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
        <GridItem colSpan={7} rowSpan={1}>
          <ViewHeader queueSystemName={queueSystem?.name} />
        </GridItem>
        <GridItem colSpan={5} rowSpan={14} bg="secondary.300">
          <CurrentlyServingQueue tickets={ticketsAlerted} />
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
