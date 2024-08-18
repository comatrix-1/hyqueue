import { Button, Center, Container, Flex } from "@chakra-ui/react";
import DashboardTable from "../../components/Admin/DashboardTable";

import { Navbar } from "../../components/Admin";
import { Main } from "../../components/Main";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../constants";
import DashboardActions from "../../components/Admin/DashboardActions";
import router from "next/router";

const Dashboard = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  useEffect(() => {
    getTickets();
  }, []);
  const [selectedQueues, setSelectedQueues] = useState<{
    [key: string]: string;
  }>({});

  const getTickets = async () => {
    const response = await axios.get(`${API_ENDPOINT}/ticket`);

    console.log("getTickets() response: ", response);
    setTickets(response.data.tickets);
    setQueues(response.data.queues);
  };

  const navigateToAdminPage = () => {
    router.push("/admin");
  };

  const handleQueueChange = (ticketId: string, newQueueId: string) => {
    console.log("handleQueueChange() ticketId: ", ticketId);
    console.log("handleQueueChange() newQueueId: ", newQueueId);
    setSelectedQueues((prev) => {
      const updatedQueues = { ...prev };

      if (
        tickets.find((ticket) => ticket.id === ticketId)?.idList === newQueueId
      ) {
        delete updatedQueues[ticketId]; // Remove from selectedQueues if it matches the original queue
      } else {
        updatedQueues[ticketId] = newQueueId; // Update if it's different
      }

      return updatedQueues;
    });
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
              <DashboardActions
                queues={queues}
                selectedQueues={selectedQueues}
              />
              <DashboardTable
                tickets={tickets}
                queues={queues}
                selectedQueues={selectedQueues}
                handleQueueChange={handleQueueChange}
              />
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

export default Dashboard;
