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

  const refreshInterval = 10000; //process.env.NEXT_PUBLIC_REFRESH_INTERVAL || 5000
  useInterval(() => {
    getTicketsGroupedByQueue();
  }, refreshInterval);

  const getTicketsGroupedByQueue = async () => {
    const tickets = await axios.get(`${API_ENDPOINT}/tickets`);
    console.log("returned from API", tickets.data);

    const ticketsData: ITrelloList[] = tickets.data;

    setTicketsMissed(
      ticketsData
        .filter(
          (list: ITrelloList) => list.name.indexOf(EQueueTitles.MISSED) > -1
        )[0].cards
    );
    const latestTicketsAlerted: ITrelloList[] = ticketsData.filter(
      (list: ITrelloList) => list.name.indexOf(EQueueTitles.ALERTED) > -1
    );
    if (hasNewAlerts(ticketsAlerted[0], latestTicketsAlerted[0]) && audio) {
      try {
        audio.play();
      } catch (e) {
        console.log("Audio failed to play");
      }
    }
    setTicketsAlerted(latestTicketsAlerted);

    const pendingQueue = ticketsData.find(
      (list: ITrelloList) => list.name.indexOf(EQueueTitles.PENDING) > -1
    );
    if (pendingQueue) setQueuePendingUrl(pendingQueue.id);
  };

  const hasNewAlerts = (current: ITrelloList, latest: ITrelloList) => {
    if (!current || !latest) return false;
    const currentAlerts = _.flatMap(current.cards).map(
      (card) => `${card.idList}${card.name}`
    );
    const latestAlerts = _.flatMap(latest.cards).map(
      (card) => `${card.idList}${card.name}`
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
          <CurrentlyServingQueue
            missedQueues={ticketsAlerted}
          />
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
