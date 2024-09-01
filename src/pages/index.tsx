import { Heading, Center, Box, Button } from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import queryString from "query-string";

import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/Navbar";

import PeopleOnPhones from "../assets/svg/people-on-phones.svg";
import { API_ENDPOINT } from "../constants";
import { EQueueTitles, IQueue, ITrelloBoardList } from "../model";

const Index = () => {
  const { t, lang } = useTranslation("common");
  const [queuePendingUrl, setQueuePendingUrl] = useState("");

  useEffect(() => {
    getQueues();
  }, []);

  const getQueues = async () => {
    try {
      const result = await axios.get(`${API_ENDPOINT}/queues`);
      const response = result.data as AxiosResponse;
      console.log("response", response);
      response.data.forEach((queue: IQueue) => {
        if (queue.name.indexOf(EQueueTitles.PENDING) > -1) {
          setQueuePendingUrl(location.origin + `/queue`);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <NavBar />
      <Main>
        <Box>
          <Heading textStyle="heading3" textAlign="center" mb={8}>
            {t("demo-title")}
          </Heading>
          <Center>
            <PeopleOnPhones className="featured-image" />
          </Center>
          <Center mt="4rem">
            <Link href={`${queuePendingUrl}`}>
              <Button
                bgColor="primary.500"
                borderRadius="3px"
                width="100%"
                color="white"
                size="lg"
                variant="solid"
                type="submit"
              >
                {t("join-queue")}
              </Button>
            </Link>
          </Center>
        </Box>
      </Main>
      <Footer />
    </Container>
  );
};

export default Index;
