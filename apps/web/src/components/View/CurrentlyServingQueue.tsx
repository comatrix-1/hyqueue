import { Box, Flex, Heading } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import { ITicket } from "../../model";
import { getQueueName } from "../../utils";

type Props = {
  tickets: ITicket[];
};

export const CurrentlyServingQueue = ({ tickets }: Props) => {
  const { t, lang } = useTranslation("common");
  return (
    <Box mx={20} my={10}>
      <Flex justifyContent="space-between">
        <Heading textStyle="display1" fontSize="5xl" mb="0.5em" flex={1}>
          {t("server")}
        </Heading>
        <Heading textStyle="display1" fontSize="5xl" mb="0.5em" flex={1}>
          {t("serving")}
        </Heading>
      </Flex>

      {tickets.length === 0 && <Heading textStyle="display2">-</Heading>}

      {tickets.map((ticket) => {
        return (
          <Flex
            key={ticket.id}
            mt="1.25em"
            mb="0.25em"
            px="0.25em"
            justifyContent="space-between"
          >
            <Heading textStyle="heading2" fontSize="5xl" flex={1}>
              {getQueueName(ticket?.queueName ?? "")}
            </Heading>
            <Heading textStyle="heading2" fontSize="5xl" flex={1}>
              {ticket.ticketNumber}
            </Heading>
          </Flex>
        );
      })}
    </Box>
  );
};
