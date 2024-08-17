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
} from "@chakra-ui/react";
import { ITrelloCard } from "../../model";

interface Props {
  tickets: ITrelloCard[]; // TODO: change any
  queues: any[]; // TODO: change any
}

const DashboardTable = ({ tickets, queues }: Props) => {
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
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tickets.map((ticket) => (
            <Tr>
              <Td>{ticket.id}</Td>
              <Td>{ticket.desc?.name}</Td>
              <Td>{ticket.desc?.queueNo}</Td>
              <Td>{findQueueNameByCard(ticket?.idList ?? "", queues)}</Td>
              <Td></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
