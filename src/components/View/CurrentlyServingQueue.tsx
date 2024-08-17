import { Box, Heading, Flex } from "@chakra-ui/react";
import { getQueueName, getQueueNumber } from "../../utils";
import { ITrelloList } from "../../model";

type Props = {
  missedQueues: ITrelloList[];
};

export const CurrentlyServingQueue = ({ missedQueues }: Props) => {
  console.log("CurrentlyServingQueue() missedQueues: ", missedQueues);
  return (
    <Box mx={20} my={10}>
      <Flex justifyContent="space-between">
        <Heading textStyle="display1" fontSize="5xl" mb="0.5em" flex={1}>
          Counter / Room
        </Heading>
        <Heading textStyle="display1" fontSize="5xl" mb="0.5em" flex={1}>
          Currently serving
        </Heading>
      </Flex>

      {missedQueues.length === 0 && <Heading textStyle="display2">-</Heading>}

      {missedQueues.map((missedQueue) => {
        const queueName = getQueueName(missedQueue.name);

        if (queueName.length > 0 && missedQueue.cards.length > 0) {
          return (
            <Flex
              key={missedQueue.id}
              mt="1.25em"
              mb="0.25em"
              px="0.25em"
              justifyContent="space-between"
            >
              <Heading textStyle="heading2" fontSize="5xl" flex={1}>
                {queueName}
              </Heading>
              <Heading textStyle="heading2" fontSize="5xl" flex={1}>
                #{missedQueue.cards[0].desc.queueNo}
              </Heading>
            </Flex>
          );
        }
        return null;
      })}
    </Box>
  );
};
