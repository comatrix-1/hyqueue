import { IApiResponse, IAuthorizeUrl } from "../model";

export const postLogin = async (): Promise<IApiResponse<IAuthorizeUrl>> => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    REDIRECT_URL,
    SCOPES,
    APP_NAME,
    EXPIRATION_DURATION,
    IS_PUBLIC_BOARD,
    IS_TEST,
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const scopes = SCOPES || "read,write";
  const appName = APP_NAME || "Hyqueue%20SG";
  const expiration = EXPIRATION_DURATION || "1hour";

  const redirectUrl = encodeURIComponent(
    `${
      REDIRECT_URL || "http://localhost:3000/admin/callback"
    }?boardId=${NEXT_PUBLIC_TRELLO_BOARD_ID}&key=${TRELLO_KEY}`
  );

  const authorizeUrl =
    IS_TEST === "true"
      ? `http://localhost:3000/admin/callback?boardId=${NEXT_PUBLIC_TRELLO_BOARD_ID}`
      : `https://trello.com/1/authorize?expiration=${expiration}&name=${appName}&scope=${scopes}&response_type=token&key=${TRELLO_KEY}&return_url=${redirectUrl}`;

  return {
    status: 200,
    data: {
      message: "",
      data: {
        authorizeUrl,
      },
    },
  };
};
