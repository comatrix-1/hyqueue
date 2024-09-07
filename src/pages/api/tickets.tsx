import axios from "axios";
import { parse as parseUrl } from "url";
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteTicketsById } from "../../services/deleteTicketsById";
import { getTickets } from "../../services/getTickets";
import { getTicketsById } from "../../services/getTicketsById";
import { getTicketsByQueueId } from "../../services/getTicketsByQueueId";
import { postTicketsByQueue } from "../../services/postTicketsByQueue";
import { putTicketsByIdAndNewQueueId } from "../../services/putTicketsByIdAndNewQueueId";
import { putTicketsByIdAndNewQueueName } from "../../services/putTicketsByIdAndNewQueueName";
import { putTicketsByNewQueueId } from "../../services/putTicketsByNewQueueId";
import { putTicketsByQueueMap } from "../../services/putTicketsByQueueMap";
import { IApiResponse, ITicket } from "../../model";

const API_ENDPOINT = "/api/tickets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method: httpMethod, url, body } = req;
    const { query: queryStringParameters } = parseUrl(url || "", true);
    console.log(`${API_ENDPOINT} ${httpMethod}`);

    switch (httpMethod) {
      case "GET": {
        const { id, queueId } = queryStringParameters;

        if (id) {
          const result = await getTicketsById(id as string);
          return res.status(result.status).json(result.data);
        } else if (queueId) {
          const result = await getTicketsByQueueId(queueId as string);
          return res.status(result.status).json(result.data);
        } else {
          const result = await getTickets();
          return res.status(result.status).json(result.data);
        }
      }

      case "POST": {
        const { desc } = body;
        const { status, data }: IApiResponse<ITicket> =
          await postTicketsByQueue(desc);
        return res.status(status).json(data);
      }

      case "PUT": {
        const { id, newQueueId, newQueueName } = queryStringParameters;
        const { queueMap } = body;

        if (id && newQueueId) {
          const result = await putTicketsByIdAndNewQueueId(
            id as string,
            newQueueId as string
          );
          return res.status(result.status).json(result.data);
        } else if (id && newQueueName) {
          const result = await putTicketsByIdAndNewQueueName(
            id as string,
            newQueueName as string
          );
          return res.status(result.status).json(result.data);
        } else if (newQueueId) {
          const result = await putTicketsByNewQueueId(newQueueId as string);
          return res.status(result.status).json(result.data);
        } else if (queueMap) {
          const result = await putTicketsByQueueMap(queueMap);
          return res.status(result.status).json(result.data);
        }
      }

      case "DELETE": {
        const { id } = queryStringParameters;
        const { status, data }: IApiResponse<null> = await deleteTicketsById(
          id as string
        );
        return res.status(status).json(data);
      }

      default: {
        return res.status(405).json(null);
      }
    }
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}
