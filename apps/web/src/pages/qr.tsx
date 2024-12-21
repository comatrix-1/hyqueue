import { Box, Center, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";

import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { NavBar } from "../components/Navbar";
import { API_ENDPOINT } from "../constants";
const Index = () => {
  const [url, setUrl] = useState("");
  const [queueName, setQueueName] = useState("");

  useEffect(() => {
    setUrl(`${location.origin}/queue`);
    getQueue();
  }, []);

  const getQueue = async () => {
    try {
      // Get the board queue belongs to this
      // 1. Verifies that queue actually exists
      // 2. Gets info stored as JSON in board description
      const response = await axios.get(`${API_ENDPOINT}/system`);
      const { name } = response.data.data;
      setQueueName(name);
    } catch (err) {
      alert("Failed to get queue");
    }
  };

  return (
    <>
      <Head>
        <title>QR Code - {queueName}</title>
      </Head>
      <Container>
        <NavBar width="100%" maxWidth="600px" />
        <Main justifyContent="start" minHeight="auto" zIndex="1">
          <Box marginBottom="32px">
            <Heading
              textAlign="center"
              textStyle="display3"
              color="primary.500"
            >
              {queueName}
            </Heading>
            <Heading mt="24px" textAlign="center" textStyle="display2">
              Scan QR Code to join the queue
            </Heading>
          </Box>
          <Box layerStyle="card" textAlign="center" py={10}>
            <Center>{url !== "" && <QRCode value={url} size={220} />}</Center>

            <Text textStyle="subtitle1" color="primary.500" mt={6}>
              {url}
            </Text>
          </Box>
        </Main>
      </Container>
    </>
  );
};

export default Index;
