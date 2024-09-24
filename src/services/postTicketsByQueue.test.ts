import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { EQueueTitles } from "../model";
import { postTicketsByQueue } from "./postTicketsByQueue";

jest.mock("../logger");

describe("postTicketsByQueue", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should create a new ticket", async () => {
    const trelloListsResponse = [{ name: EQueueTitles.PENDING, id: "123" }];
    mock.onGet(/\/boards\/.*\/lists/).reply(200, trelloListsResponse);

    const cardResponse = { id: "1", idShort: "101" };
    mock.onPost(/\/cards/).reply(200, cardResponse);

    const updateResponse = { status: 200 };
    mock.onPut(/\/cards/).reply(200, updateResponse);

    const response = await postTicketsByQueue({ desc: "Test", contact: "123" });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Successfully created ticket");
  });

  it("should return an error if Trello lists API fails", async () => {
    mock.onGet(/\/boards\/.*\/lists/).reply(500);

    const response = await postTicketsByQueue({ desc: "Test" });

    expect(response.status).toBe(500);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 500"
    );
  });
});
