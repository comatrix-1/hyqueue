import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { getTicketsById } from "./getTicketsById";

const mock = new MockAdapter(axios);
const boardId = "test-board-id";
process.env.TRELLO_KEY = "test-key";
process.env.TRELLO_TOKEN = "test-token";
process.env.NEXT_PUBLIC_TRELLO_BOARD_ID = boardId;

jest.mock("../logger");

describe("getTicketsById", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should return ticket info if card exists", async () => {
    const ticketId = "test-ticket-id";
    const mockResponse = {
      cards: [
        {
          id: ticketId,
          idList: "list-id",
          name: "Test Card",
          idShort: 123,
          desc: '{"name": "John"}',
        },
      ],
      lists: [{ id: "list-id", name: "In Progress" }],
    };

    mock
      .onGet(
        `https://api.trello.com/1/boards/${boardId}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&key=test-key&token=test-token`
      )
      .reply(200, mockResponse);

    const result = await getTicketsById(ticketId);

    expect(result.status).toBe(200);
    expect(result.data.data?.id).toBe(ticketId);
    expect(result.data.data?.desc?.name).toBe("John");
  });

  it("should return 400 if card does not exist", async () => {
    const ticketId = "non-existent-id";
    const mockResponse = {
      cards: [],
      lists: [],
    };

    mock
      .onGet(
        `https://api.trello.com/1/boards/${boardId}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&key=test-key&token=test-token`
      )
      .reply(200, mockResponse);

    const result = await getTicketsById(ticketId);

    expect(result.status).toBe(400);
    expect(result.data.message).toBe(INTERNAL_SERVER_ERROR);
  });

  it("should return error if Trello API fails", async () => {
    const ticketId = "test-ticket-id";
    mock
      .onGet(
        `https://api.trello.com/1/boards/${boardId}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&key=test-key&token=test-token`
      )
      .reply(400);

    const result = await getTicketsById(ticketId);

    expect(result.status).toBe(400);
    expect(result.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(logger.error).toHaveBeenCalledWith(
      "Request failed with status code 400"
    );
  });
});
