import {
  Heading,
  Center,
  Box,
  Text,
  Flex,
  Input,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import queryString from "query-string";

import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/Navbar";
import { UrlInput } from "../components/Support/UrlInput";

const Index = () => {
  const [rootUrl, setRootUrl] = useState("");

  useEffect(() => {
    setRootUrl(window.location.origin);
  }, []);

  return (
    <>
      <Head>
        <title>QueueUp Support</title>
      </Head>
      <Container>
        <NavBar w="100vw" px={8} />
        <Main w="100vw" px={8}>
          <Box>
            <Heading textStyle="heading3" textAlign="center" my={3}>
              Hyqueue Support
            </Heading>
            <Text textStyle="body1" textAlign="center" mb={8}>
              Generate the URLs related to your Queue Here.
            </Text>

            <Center>
              <Box w="800px" layerStyle="card">
                <Flex direction="column">
                  <Text pb="0.5rem" textStyle="subtitle1">
                    Join The Queue
                  </Text>
                  <UrlInput url={`${rootUrl}/queue`} />

                  <Text pt={4} pb="0.5rem" textStyle="subtitle1">
                    QR Code
                  </Text>
                  <UrlInput url={`${rootUrl}/qr`} />

                  <Text pt={4} pb="0.5rem" textStyle="subtitle1">
                    TV Queue View
                  </Text>
                  <UrlInput url={`${rootUrl}/view`} />
                </Flex>
              </Box>
            </Center>
          </Box>
        </Main>
        <Footer w="100vw" px={8} />
      </Container>
    </>
  );
};

export default Index;
