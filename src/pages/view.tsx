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
import { EQueueTitles, ITrelloBoardList, ITrelloList } from "../model";

const Index = () => {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [board, setBoard] = useState();
  const [boardLists, setBoardLists] = useState({});
  const [queuePendingUrl, setQueuePendingUrl] = useState("");
  const [queueAlertIds, setqueueAlertIds] = useState([]);
  const [ticketsAlerted, setTicketsAlerted] = useState<ITrelloList[]>([]);
  const [queueMissedIds, setQueueMissedIds] = useState([]);
  const [ticketsMissed, setTicketsMissed] = useState<any[]>([]); // TODO: change any

  useEffect(() => {
    // getBoard();
    // getBoardLists();
    getTicketsGroupedByQueue();

    setAudio(new Audio("/chime.mp3"));
  }, []);

  useEffect(() => {
    getQueues();
  }, [queueAlertIds, queueMissedIds]);

  const refreshInterval = 10000; //process.env.NEXT_PUBLIC_REFRESH_INTERVAL || 5000
  useInterval(() => {
    getQueues();
  }, refreshInterval);

  const getTicketsGroupedByQueue = async () => {
    const tickets = await axios.get(`${API_ENDPOINT}/ticket`);
    console.log("returned from API", tickets.data);

    const ticketsData: ITrelloList[] = tickets.data;

    setTicketsMissed(
      ticketsData.filter(
        (list: ITrelloList) => list.name.indexOf(EQueueTitles.MISSED) > -1
      )
    );
    setTicketsAlerted(
      ticketsData.filter(
        (list: ITrelloList) => list.name.indexOf(EQueueTitles.ALERTED) > -1
      )
    );
    const pendingQueue = ticketsData.find(
      (list: ITrelloList) => list.name.indexOf(EQueueTitles.PENDING) > -1
    );
    if (pendingQueue) setQueuePendingUrl(pendingQueue.id);
  };

  /**
   * Gets Queues
   */
  const getQueues = async () => {
    if (queueAlertIds && queueMissedIds) {
      const tickets = await axios.get(
        `${API_ENDPOINT}/view?type=queues&queueAlertIds=${queueAlertIds.join(
          ","
        )}&queueMissedIds=${queueMissedIds.join(",")}`
      );

      // Set the missed tickets
      // Combined all missed queues into 1
      const combinedMissed = _.flatMap(tickets.data.missed);
      setTicketsMissed(combinedMissed);

      const chime = hasNewAlerts(ticketsAlerted, tickets.data.alerted);
      // if (audio && chime) {
      //   // audio is
      //   try {
      //     audio.play();
      //   } catch (e) {}
      // }
      //  Set the alerted tickets
      setTicketsAlerted(tickets.data.alerted);
    }
  };

  /**
   * Checks current alerts and compares it with latest. If latest has items not in current, trigger chime
   */
  const hasNewAlerts = (current: any[], latest: any[]) => {
    // TODO: change any
    const currentAlerts = _.flatMap(current).map(
      (tx) => `${tx.idList}${tx.name}`
    );
    const latestAlerts = _.flatMap(latest).map(
      (tx) => `${tx.idList}${tx.name}`
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
          <ViewHeader board={board} />
        </GridItem>
        <GridItem colSpan={5} rowSpan={14} bg="secondary.300">
          {/* <CurrentlyServingQueue
            listsOfTickets={ticketsAlerted}
            lists={boardLists}
          /> */}
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
