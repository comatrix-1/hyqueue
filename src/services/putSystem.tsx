import axios from "axios";
import { IApiResponse, IQueueSystem } from "../model";
import { prepareJsonString } from "../utils";

export const putSystem = async (
  body: any
): Promise<IApiResponse<IQueueSystem>> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    IS_PUBLIC_BOARD,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const update = {
    name: body.name,
    desc: JSON.stringify(body.desc),
  };

  if (!update.name) delete update.name;
  const response = await axios.put(
    `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}?${tokenAndKeyParams}`,
    update
  );

  try {
    const parsedDesc = JSON.parse(prepareJsonString(response.data.desc));
    return {
      status: response.status,
      data: {
        message: "Successfully updated queue system information",
        data: {
          id: response.data.id,
          name: response.data.name,
          desc: parsedDesc,
        },
      },
    };
  } catch {
    return {
      status: response.status,
      data: {
        message: "Error parsing desc",
        data: null,
      },
    };
  }
};
