import type { NextApiRequest, NextApiResponse } from "next";
import { getSystem } from "../../services/getSystem";
import { putSystem } from "../../services/putSystem";
import { withErrorHandling } from "../../withErrorHandling";

/**
 * Function for Queue System
 */

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method: httpMethod, body } = req;

  if (httpMethod === "GET") {
    const { status, data } = await getSystem();
    return res.status(status).json(data);
  } else if (httpMethod === "PUT") {
    const { status, data } = await putSystem(body);
    return res.status(status).json(data);
  } else {
    res.status(405).json(null);
  }
}

export default withErrorHandling(handler);
