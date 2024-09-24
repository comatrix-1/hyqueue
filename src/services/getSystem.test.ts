import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { getSystem } from "./getSystem";

jest.mock("../logger");

describe("getSystem", () => {
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

  it("should retrieve queue system information successfully", async () => {
    const boardData = {
      name: "Test Board",
      desc: '{"openingHours": [], "waitTimePerTicket": 5}',
    };

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(200, boardData);

    const response = await getSystem();

    expect(response.status).toBe(200);
    expect(response.data.message).toBe(
      "Successfully retrieved queue system information"
    );
    expect(response.data.data?.name).toBe("Test Board");
    expect(response.data.data?.desc?.waitTimePerTicket).toBe(5);
  });

  it("should handle error when parsing description", async () => {
    const invalidBoardData = { name: "Test Board", desc: "invalid-json" };

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(200, invalidBoardData);

    const response = await getSystem();

    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Error parsing desc");
    expect(response.data.data).toBeNull();
    expect(logger.info).toHaveBeenCalledWith("Error parsing desc");
  });

  it("should return error for API failure", async () => {
    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(500);

    const response = await getSystem();

    expect(response.status).toBe(500);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(response.data.data).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 500"
    );
  });
});
