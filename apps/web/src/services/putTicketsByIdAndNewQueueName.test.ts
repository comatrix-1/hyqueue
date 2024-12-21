import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { IApiResponse } from "../model";
import { putTicketsByIdAndNewQueueName } from "./putTicketsByIdAndNewQueueName";

const mock = new MockAdapter(axios);
jest.mock("../logger");

describe("putTicketsByIdAndNewQueueName", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should update ticket with correct queue name", async () => {
    const id = "ticket123";
    const newQueueName = "To Do";
    const newQueueId = "queue456";

    mock.onGet(/lists/).reply(200, [{ id: newQueueId, name: newQueueName }]);

    mock.onPut(/cards/).reply(200);

    const response: IApiResponse<null> = await putTicketsByIdAndNewQueueName(
      id,
      newQueueName
    );

    expect(response.status).toBe(200);
    expect(response.data.message).toBe(
      `Successfully updated ticket of ID: ${id}`
    );
  });

  it("should handle queue not found", async () => {
    const id = "ticket123";
    const newQueueName = "Nonexistent Queue";

    mock.onGet(/lists/).reply(200, []);

    mock.onPut(/cards/).reply(201);

    const response: IApiResponse<null> = await putTicketsByIdAndNewQueueName(
      id,
      newQueueName
    );

    expect(response.status).toBe(201);
    expect(response.data.message).toBe(`Failed to update ticket of ID: ${id}`);
  });

  it("should return an error if Trello lists API fails", async () => {
    mock.onGet(/lists/).reply(500);

    const response = await putTicketsByIdAndNewQueueName("1", "newQueueName");

    expect(response.status).toBe(500);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 500"
    );
  });
});
