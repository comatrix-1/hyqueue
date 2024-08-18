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

        let result;
        if (id) {
          result = await getTicketsById(id as string);
        } else if (queueId) {
          result = await getTicketsByQueueId(queueId as string);
        } else {
          result = await getTickets();
        }

        return res.status(result.status).json(result.data);
      }

      case "POST": {
        const { desc } = body;
        const { queue } = queryStringParameters;
        const { status, data } = await postTicketsByQueue(
          queue as string,
          desc
        );
        return res.status(status).json(data);
      }

      case "PUT": {
        const { id, newQueueId, newQueueName } = queryStringParameters;
        const { queueMap } = body;

        let result;
        if (id && newQueueId) {
          result = await putTicketsByIdAndNewQueueId(
            id as string,
            newQueueId as string
          );
        } else if (id && newQueueName) {
          result = await putTicketsByIdAndNewQueueName(
            id as string,
            newQueueName as string
          );
        } else if (newQueueId) {
          result = await putTicketsByNewQueueId(newQueueId as string);
        } else if (queueMap) {
          result = await putTicketsByQueueMap(queueMap);
        }

        return result
          ? res.status(result.status).json(result.data)
          : res.json(null);
      }

      case "DELETE": {
        const { id } = queryStringParameters;
        const { status, data } = await deleteTicketsById(id as string);
        return res.status(status).json(data);
      }

      default: {
        return res.status(405).json({ message: "Method Not Allowed" });
      }
    }
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}
