import { postLogin } from "./postLogin";

describe("postLogin", () => {
  process.env.TRELLO_KEY = "test-key";
  process.env.TRELLO_TOKEN = "test-token";
  process.env.REDIRECT_URL = "http://localhost:3000";
  process.env.SCOPES = "read,write";
  process.env.APP_NAME = "TestApp";
  process.env.NEXT_PUBLIC_TRELLO_BOARD_ID = "board-id";

  it("should return Trello authorize URL", async () => {
    const result = await postLogin();
    expect(result.status).toBe(200);
    expect(result.data.data?.authorizeUrl).toContain(
      "https://trello.com/1/authorize"
    );
  });

  it("should return test callback URL if IS_TEST is true", async () => {
    process.env.IS_TEST = "true";
    const result = await postLogin();
    expect(result.status).toBe(200);
    expect(result.data.data?.authorizeUrl).toBe(
      "http://localhost:3000/admin/callback?boardId=board-id"
    );
  });
});
