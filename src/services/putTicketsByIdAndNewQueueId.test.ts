import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { putTicketsByIdAndNewQueueId } from "./putTicketsByIdAndNewQueueId";

jest.mock("../logger");

describe("putTicketsByIdAndNewQueueId", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should update the ticket to the new queue", async () => {
    mock.onPut(/\/cards\/.*$/).reply(201);

    const response = await putTicketsByIdAndNewQueueId("1", "newQueueId");

    expect(response.status).toBe(201);
    expect(response.data.message).toBe("Successfully updated ticket of ID: 1");
  });

  it("should return an error if Trello cards API fails", async () => {
    mock.onPut(/\/cards\/.*$/).reply(500);

    const response = await putTicketsByIdAndNewQueueId("1", "newQueueId");

    expect(response.status).toBe(500);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 500"
    );
  });
});
