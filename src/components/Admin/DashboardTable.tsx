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
}

const DashboardTable = ({ tickets, queues }: Props) => {
  const [selectedQueues, setSelectedQueues] = useState<{
    [key: string]: string;
  }>({});

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

  const handleQueueChange = (ticketId: string, newQueueId: string) => {
    setSelectedQueues((prev) => ({
      ...prev,
      [ticketId]: newQueueId,
    }));
  };

  const renderActionByQueueName = (queueName: string) => {
    if (!queueName) return;

    if (queueName.includes(EQueueTitles.ALERTED)) return <p>ALERTED</p>;

    if (queueName.includes(EQueueTitles.DONE)) return <p>DONE</p>;
    if (queueName.includes(EQueueTitles.MISSED)) return <p>MISSED</p>;
    if (queueName.includes(EQueueTitles.PENDING)) return <p>PENDING</p>;
  };

  const isQueueChanged = (ticketId: string, currentQueueId: string) => {
    return (
      selectedQueues[ticketId] && selectedQueues[ticketId] !== currentQueueId
    );
  };

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="primary">
        <Thead>
          <Tr>
            <Th>S/N</Th>
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
              <Td>{findQueueNameByCard(ticket?.idList ?? "", queues)}</Td>
              <Td>
                <Box position="relative">
                  <Select
                    onChange={(e) =>
                      handleQueueChange(ticket.id, e.target.value)
                    }
                    defaultValue={ticket.idList}
                  >
                    {queues.map((queue) => (
                      <option value={queue.id} key={queue.id}>
                        {queue.name}
                      </option>
                    ))}
                  </Select>
                  {isQueueChanged(ticket.id, ticket.idList ?? "") && (
                    <Box
                      position="absolute"
                      top="50%"
                      right="-20px"
                      transform="translateY(-50%)"
                      width="8px"
                      height="8px"
                      backgroundColor="red"
                      borderRadius="50%"
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
