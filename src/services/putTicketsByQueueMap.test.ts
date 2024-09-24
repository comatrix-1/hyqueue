import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { IApiResponse } from "../model";
import { putTicketsByQueueMap } from "./putTicketsByQueueMap";

const mock = new MockAdapter(axios);
jest.mock("../logger");

describe("putTicketsByQueueMap", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should update multiple tickets with the correct queues", async () => {
    const queueMap = {
      ticket1: "queue1",
      ticket2: "queue2",
    };

    mock.onPut(/cards/).reply(201);

    const response: IApiResponse<null> = await putTicketsByQueueMap(queueMap);

    expect(response.status).toBe(201);
    expect(response.data.message).toBe("Successfully updated tickets");
  });

  it("should return error when any ticket fails to update", async () => {
    const queueMap = {
      ticket1: "queue1",
      ticket2: "queue2",
    };

    mock.onPut(/cards\/ticket1/).reply(201);
    mock.onPut(/cards\/ticket2/).reply(400);

    const response: IApiResponse<null> = await putTicketsByQueueMap(queueMap);

    expect(response.status).toBe(400);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 400"
    );
  });

  it("should return an error if Trello cards API fails", async () => {
    const queueMap = {
      ticket1: "queue1",
      ticket2: "queue2",
    };
    mock.onPut(/cards/).reply(500);

    const response = await putTicketsByQueueMap(queueMap);

    expect(response.status).toBe(500);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 500"
    );
  });
});
