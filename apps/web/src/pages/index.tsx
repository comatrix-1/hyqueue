import { Box, Button, Center, Heading, Input, Text } from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Main } from "../components/Main";
import { NavBar } from "../components/Navbar";

import { API_ENDPOINT } from "../constants";
import { EQueueTitles, IQueue } from "../model";

const Index = () => {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  const navigateToQueue = async () => {
    try {
      const result = await axios.get(`${API_ENDPOINT}/queues`);
      const response = result.data as AxiosResponse;
      response.data.forEach((queue: IQueue) => {
        if (queue.name.indexOf(EQueueTitles.PENDING) > -1) {
          router.push(location.origin + `/queue`);
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
          <Center mt="4rem">
            <Button
              bgColor="primary.500"
              borderRadius="3px"
              width="100%"
              color="white"
              size="lg"
              variant="solid"
              type="submit"
              onClick={navigateToQueue}
            >
              {t("join-queue")}
            </Button>
          </Center>
        </Box>
      </Main>
      <Footer />
    </Container>
  );
};

export default Index;
