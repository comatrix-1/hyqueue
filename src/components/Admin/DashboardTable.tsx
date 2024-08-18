import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Select,
  Box,
} from "@chakra-ui/react";
import { EQueueTitles, ITrelloCard } from "../../model";
import { useState } from "react";

interface Props {
  tickets: ITrelloCard[]; // TODO: change any
  queues: any[]; // TODO: change any
  selectedQueues: { [key: string]: string };
  handleQueueChange: (ticketId: string, newQueueId: string) => void;
}

const DashboardTable = ({
  tickets,
  queues,
  selectedQueues,
  handleQueueChange,
}: Props) => {
  const findQueueNameByCard = (
    cardId: string,
    queues: any[]
  ): string | undefined => {
    const queue = queues.find((queue: any) => queue.id === cardId);
    if (!queue) {
      return undefined;
    }

    return queue ? queue.name : undefined;
  };

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="primary">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Queue No.</Th>
            <Th>Queue name</Th>
            <Th>New queue</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tickets.map((ticket, index) => (
            <Tr key={ticket.id}>
              <Td>{index + 1}</Td>
              <Td>{ticket.desc?.name}</Td>
              <Td>{ticket.desc?.queueNo}</Td>
              <Td>{ticket.idList}</Td>
              <Td>
                <Box position="relative">
                  <Select
                    value={selectedQueues[index]}
                    onChange={(e) =>
                      handleQueueChange(ticket.id, e.target.value)
                    }
                  >
                    {queues.map((queue) => (
                      <option value={queue.id} key={queue.id}>
                        {queue.name}
                      </option>
                    ))}
                  </Select>
                  {selectedQueues[ticket.id] &&
                    selectedQueues[ticket.id] !== ticket.idList && (
                      <Box
                        position="absolute"
                        top="50%"
                        right="-3"
                        transform="translate(50%, -50%)"
                        width="8px"
                        height="8px"
                        borderRadius="50%"
                        backgroundColor="red"
                      />
                    )}
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
