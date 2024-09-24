import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { IApiResponse } from "../model";
import { putTicketsByNewQueueId } from "./putTicketsByNewQueueId";

const mock = new MockAdapter(axios);
jest.mock("../logger");

describe("putTicketsByNewQueueId", () => {
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

  it("should move first ticket from pending queue to new queue", async () => {
    const newQueueId = "queue789";
    const pendingQueueId = "queue123";
    const ticketId = "ticket123";

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(200, [{ id: pendingQueueId, name: "Pending [PENDING]" }]);

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/lists/${pendingQueueId}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(200, [{ id: ticketId, name: "Test Ticket" }]);

    mock.onPut(/cards/).reply(201);

    const response: IApiResponse<null> =
      await putTicketsByNewQueueId(newQueueId);

    expect(response.status).toBe(201);
    expect(response.data.message).toContain(
      `Successfully put ticket of ID ${ticketId}`
    );
  });

  it("should return a message when no tickets are found in pending queue", async () => {
    const newQueueId = "queue789";
    const pendingQueueId = "queue123";

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(200, [{ id: pendingQueueId, name: "Pending [PENDING]" }]);

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/lists/${pendingQueueId}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(200, []);

    const response: IApiResponse<null> =
      await putTicketsByNewQueueId(newQueueId);

    expect(response.status).toBe(200);
    expect(response.data.message).toBe("No tickets found in pending queue");
  });

  it("should return an error if Trello lists API fails", async () => {
    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(500);

    const response = await putTicketsByNewQueueId("newQueueId");

    expect(response.status).toBe(500);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 500"
    );
  });
});
