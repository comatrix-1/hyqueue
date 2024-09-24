import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { INTERNAL_SERVER_ERROR } from "../constants";
import { logger } from "../logger";
import { getTickets } from "./getTickets";

jest.mock("../logger");

describe("getTickets", () => {
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

  it("should retrieve tickets successfully", async () => {
    const boardData = {
      cards: [
        {
          id: "card1",
          idList: "list1",
          name: "Ticket 1",
          idShort: 101,
          desc: '{"category": "General"}',
        },
        {
          id: "card2",
          idList: "list2",
          name: "Ticket 2",
          idShort: 102,
          desc: '{"category": "Urgent"}',
        },
      ],
    };

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(200, boardData);

    const response = await getTickets();

    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Successfully retrieved tickets");
    expect(response.data.data).toHaveLength(2);
    expect(response.data?.data ? response.data?.data[0].name : "").toBe(
      "Ticket 1"
    );
    expect(
      response.data?.data && response.data?.data[1].desc
        ? response.data?.data[1].desc.category
        : ""
    ).toBe("Urgent");
    expect(logger.info).toHaveBeenCalledWith("getBoardInfo TEST", boardData);
  });

  it("should handle parsing error for ticket description", async () => {
    const invalidBoardData = {
      cards: [
        {
          id: "card1",
          idList: "list1",
          name: "Ticket 1",
          idShort: 101,
          desc: "invalid-json",
        },
      ],
    };

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(200, invalidBoardData);

    const response = await getTickets();

    expect(response.status).toBe(200);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(response.data.data).toEqual([]);
  });

  it("should return error for API failure", async () => {
    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
      )
      .reply(500);

    const response = await getTickets();

    expect(response.status).toBe(500);
    expect(response.data.message).toBe(INTERNAL_SERVER_ERROR);
    expect(response.data.data).toEqual(null);
  });
});
