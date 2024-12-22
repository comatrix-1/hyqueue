const axios = require("axios");
const { parse: parseUrl } = require("url");
import type { NextApiRequest, NextApiResponse } from "next";
import { getGenerateReport } from "../../services/getGenerateReport";
import { withErrorHandling } from "../../withErrorHandling";

/**
 * Function for Report API calls
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method: httpMethod } = req;

  if (httpMethod === "GET") {
    const { status, data } = await getGenerateReport();

    if (status === 200) {
      const { data: csvBuffer } = data; // Assuming `data` contains the buffer directly now

      // Set headers for file download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Queue_Report_${new Date().toISOString()}.csv`
      );
      res.setHeader("Content-Type", "text/csv");

      // Send the CSV buffer directly as the response
      res.end(csvBuffer);

      return; // Ensure no further response is sent
    } else {
      // Send the error response if status is not 200
      return res.status(status).json(data);
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default withErrorHandling(handler);
