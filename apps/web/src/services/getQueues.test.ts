import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { IApiResponse, IQueue } from "../model";
import { getQueues } from "./getQueues";

jest.mock("../logger");

describe("getQueues", () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
    process.env = {
      TRELLO_KEY: "test_key",
      TRELLO_TOKEN: "test_token",
      IS_PUBLIC_BOARD: "false",
      TRELLO_ENDPOINT: "https://api.trello.com/1",
      NEXT_PUBLIC_TRELLO_BOARD_ID: "test_board_id",
      NODE_ENV: "test",
    };
  });

  it("should retrieve queues successfully", async () => {
    const queues: IQueue[] = [
      { id: "queue_1", name: "Queue 1" },
      { id: "queue_2", name: "Queue 2" },
    ];

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(200, queues);

    const response: IApiResponse<IQueue[]> = await getQueues();

    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Successfully retrieved queues");
    expect(response.data.data).toEqual(queues);
  });

  it("should return 400 error if board id is missing", async () => {
    process.env.NEXT_PUBLIC_TRELLO_BOARD_ID = "";

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(400, { message: "Request failed with status code 400" });

    const response: IApiResponse<IQueue[]> = await getQueues();

    expect(response.status).toBe(400);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(response.data.data).toEqual(null);
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 400"
    );
  });

  it("should return an error if the API call fails", async () => {
    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(500);

    const response: IApiResponse<IQueue[]> = await getQueues();

    expect(response.status).toBe(500);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(response.data.data).toEqual(null);
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 500"
    );
  });
});
