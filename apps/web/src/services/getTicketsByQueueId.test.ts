import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getTicketsByQueueId } from "./getTicketsByQueueId";
import { logger } from "../logger";

const mock = new MockAdapter(axios);
const queueId = "test-queue-id";
process.env.TRELLO_KEY = "test-key";
process.env.TRELLO_TOKEN = "test-token";

jest.mock("../logger");

describe("getTicketsByQueueId", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should return tickets if API call is successful", async () => {
    const mockResponse = [
      {
        id: "card-1",
        name: "Ticket 1",
        idShort: 1,
        desc: '{"category": "test"}',
      },
    ];

    mock
      .onGet(
        `https://api.trello.com/1/lists/${queueId}/cards?key=test-key&token=test-token`
      )
      .reply(200, mockResponse);

    const result = await getTicketsByQueueId(queueId);

    expect(result.status).toBe(200);
    expect(result.data.data ? result.data.data[0].id : "").toBe("card-1");
    expect(
      result.data.data && result.data.data[0].desc
        ? result.data.data[0].desc.category
        : ""
    ).toBe("test");
  });

  it("should return empty data if no tickets exist", async () => {
    mock
      .onGet(
        `https://api.trello.com/1/lists/${queueId}/cards?key=test-key&token=test-token`
      )
      .reply(200, []);

    const result = await getTicketsByQueueId(queueId);

    expect(result.status).toBe(200);
    expect(result.data.data).toHaveLength(0);
  });

  it("should return error if API call fails", async () => {
    mock
      .onGet(
        `https://api.trello.com/1/lists/${queueId}/cards?key=test-key&token=test-token`
      )
      .reply(500);

    const result = await getTicketsByQueueId(queueId);

    expect(result.status).toBe(500);
    expect(result.data.data).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 500"
    );
  });
});
