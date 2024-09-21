import { Button, Center, Container, Flex } from "@chakra-ui/react";
import DashboardTable from "../../components/Admin/DashboardTable";

import axios from "axios";
import Head from "next/head";
import router from "next/router";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Admin";
import DashboardActions from "../../components/Admin/DashboardActions";
import { Main } from "../../components/Main";
import withProtectedRoute from "../../components/withProtectedRoute";
import { API_ENDPOINT } from "../../constants";

const Dashboard = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  useEffect(() => {
    getTickets();
  }, []);
  const [selectedQueues, setSelectedQueues] = useState<{
    [key: string]: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTickets = async () => {
    const ticketsResponse = await axios.get(`${API_ENDPOINT}/tickets`);
    const queuesResponse = await axios.get(`${API_ENDPOINT}/queues`);

    setTickets(ticketsResponse.data.data);
    setQueues(queuesResponse.data.data);
  };

  const navigateToAdminPage = () => {
    router.push("/admin");
  };

  const resetSelectedQueues = () => {
    setSelectedQueues({});
  };

  const handleQueueChange = (ticketId: string, newQueueId: string) => {
    setSelectedQueues((prev) => {
      const updatedQueues = { ...prev };

      if (
        tickets.find((ticket) => ticket.id === ticketId)?.queueId === newQueueId
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
        <title>Dashboard - Hyqueue</title>
      </Head>
      <Container>
        <Navbar />
        <Main minHeight="90vh" width="100%">
          <Center>
            <Flex direction="column" alignItems="center">
              <DashboardActions
                queues={queues}
                selectedQueues={selectedQueues}
                getTickets={getTickets}
                resetSelectedQueues={resetSelectedQueues}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
              <DashboardTable
                tickets={tickets}
                queues={queues}
                selectedQueues={selectedQueues}
                handleQueueChange={handleQueueChange}
                isSubmitting={isSubmitting}
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
                mb="2rem"
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

export default withProtectedRoute(Dashboard);
