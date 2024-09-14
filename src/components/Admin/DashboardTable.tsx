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
  Spinner,
} from "@chakra-ui/react";
import { EQueueTitles, ITicket, ITrelloCard } from "../../model";
import { useState } from "react";

interface Props {
  tickets: ITicket[]; // TODO: change any
  queues: any[]; // TODO: change any
  selectedQueues: { [key: string]: string };
  handleQueueChange: (ticketId: string, newQueueId: string) => void;
  isSubmitting: boolean;
}

const DashboardTable = ({
  tickets,
  queues,
  selectedQueues,
  handleQueueChange,
  isSubmitting,
}: Props) => {
  if (!queues?.length) return;

  const findQueueNameByListId = (
    listId: string,
    queues: any[]
  ): string | undefined => {
    const queue = queues.find((queue: any) => queue.id === listId);
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
            <Th>Ticket number</Th>
            <Th>Queue name</Th>
            <Th>New queue</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isSubmitting ? (
            <Spinner />
          ) : (
            tickets.map((ticket, index) => (
              <Tr key={ticket.id}>
                <Td>{ticket.id}</Td>
                <Td>{ticket.desc?.name}</Td>
                <Td>{ticket.ticketNumber}</Td>
                <Td>{findQueueNameByListId(ticket?.queueId ?? "", queues)}</Td>
                <Td>
                  <Box position="relative">
                    <Select
                      value={selectedQueues[index]}
                      onChange={(e) =>
                        handleQueueChange(ticket.id, e.target.value)
                      }
                    >
                      <option value=""></option>
                      {queues.map((queue) => (
                        <option value={queue.id} key={queue.id}>
                          {queue.name}
                        </option>
                      ))}
                    </Select>
                    {selectedQueues[ticket.id] &&
                      selectedQueues[ticket.id] !== ticket.queueId && (
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
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
