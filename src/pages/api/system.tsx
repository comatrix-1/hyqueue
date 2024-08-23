import type { NextApiRequest, NextApiResponse } from "next";
import { IEditableSettings, ITrelloBoardSettings } from "../../model";
import axios from "axios";
import { getSystem } from "../../services/getSystem";
import { putSystem } from "../../services/putSystem";

/**
 * Function for Queue System
 */

const API_ENDPOINT = "/api/system";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method: httpMethod, body } = req;
    console.log(`${API_ENDPOINT} ${httpMethod}`);

    if (httpMethod === "GET") {
      const { status, data } = await getSystem();
      return res.status(status).json(data);
    } else if (httpMethod === "PUT") {
      const { status, data } = await putSystem(body);
      return res.status(status).json(data);
    } else {
      res.status(405).json(null);
    }
  } catch (err: any) {
    // TODO: change any
    console.log(err.response);
    res.status(400).json(null);
  }
}
