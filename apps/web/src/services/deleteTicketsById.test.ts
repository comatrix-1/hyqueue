import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { deleteTicketsById } from "./deleteTicketsById";
import { ApiError } from "next/dist/server/api-utils";

describe("deleteTicketsById", () => {
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

  it("should move the ticket to [LEFT] list if it exists", async () => {
    const id = "ticket_id";
    const leftListId = "left_list_id";

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&key=test_key&token=test_token`
      )
      .reply(200, {
        lists: [{ id: leftListId, name: "Left [LEFT]" }],
      });

    mock
      .onPut(
        `${process.env.TRELLO_ENDPOINT}/cards/${id}?key=test_key&token=test_token&idList=${leftListId}&pos=bottom`
      )
      .reply(200);

    const response = await deleteTicketsById(id);

    expect(response.status).toBe(200);
    expect(response.data.message).toBe(
      `Successfully deleted ticket of ID: ${id}`
    );
  });

  it("should delete the ticket if no [LEFT] list exists", async () => {
    const id = "ticket_id";

    mock
      .onGet(
        `${process.env.TRELLO_ENDPOINT}/boards/${process.env.NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&key=test_key&token=test_token`
      )
      .reply(200, {
        lists: [],
      });

    mock
      .onDelete(
        `${process.env.TRELLO_ENDPOINT}/cards/${id}?key=test_key&token=test_token`
      )
      .reply(200);

    const response = await deleteTicketsById(id);

    expect(response.status).toBe(200);
    expect(response.data.message).toBe(
      `Successfully deleted ticket of ID: ${id}`
    );
  });

  it("should return a 400 error if id or board id is missing", async () => {
    process.env.NEXT_PUBLIC_TRELLO_BOARD_ID = "";

    const response = await deleteTicketsById("ticket_id");

    expect(response.status).toBe(400);
    expect(response.data.message).toBe("Missing ticket or board id");
  });
});
