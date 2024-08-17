import { Center, Container, Flex } from "@chakra-ui/react";
import DashboardTable from "../../components/Admin/DashboardTable";

import { Navbar } from "../../components/Admin";
import { Main } from "../../components/Main";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../constants";

const Dashboard = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  useEffect(() => {
    getTickets();
  }, []);

  const getTickets = async () => {
    const response = await axios.get(`${API_ENDPOINT}/ticket`);

    console.log("getTickets() response: ", response);
    setTickets(response.data.tickets);
    setQueues(response.data.queues);
  };
  return (
    <>
      <Head>
        <title>Dashboard - QueueUp Sg</title>
      </Head>
      <Container>
        <Navbar />
        <Main minHeight="90vh" width="100%">
          <Center>
            <Flex direction="column" alignItems="center">
              <DashboardTable tickets={tickets} queues={queues} />
            </Flex>
          </Center>
        </Main>
      </Container>
    </>
  );
};

export default Dashboard;
