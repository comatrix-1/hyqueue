import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  theme,
  Flex,
  Divider,
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import { ITicket } from "../../model";
import TicketInfo from "./TicketInfo";

interface Props {
  rejoinQueue: () => void;
  ticket?: ITicket;
}

export const Skipped = ({ rejoinQueue, ticket }: Props) => {
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Center></Center>
      <Box layerStyle="card">
        <Text my={6} textStyle="body1" textAlign="center">
          {t("your-queue-number-was")}
        </Text>

        {ticket ? (
          <>
            <Divider my="2rem" />
            <TicketInfo ticket={ticket} />
          </>
        ) : null}
      </Box>

      <Button
        bgColor="primary.500"
        borderRadius="3px"
        width="100%"
        color="white"
        size="lg"
        variant="solid"
        marginTop="2rem"
        onClick={rejoinQueue}
      >
        {t("rejoin-the-queue")}
      </Button>
    </>
  );
};
