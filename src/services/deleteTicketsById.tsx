import axios from "axios";

export const deleteTicketsById = async (id: string) => {
  const {
    TRELLO_KEY,
    TRELLO_TOKEN,
    IS_PUBLIC_BOARD,
    TRELLO_ENDPOINT = "https://api.trello.com/1",
    NEXT_PUBLIC_TRELLO_BOARD_ID,
  } = process.env;
  const tokenAndKeyParams =
    IS_PUBLIC_BOARD === "true" ? "" : `key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  if (id && NEXT_PUBLIC_TRELLO_BOARD_ID) {
    const getBoardInfo = await axios.get(
      `${TRELLO_ENDPOINT}/boards/${NEXT_PUBLIC_TRELLO_BOARD_ID}/?fields=id,name,desc&cards=visible&card_fields=id,idList,name,idShort,desc&lists=open&list_fields=id,name&${tokenAndKeyParams}`
    );

    const { lists } = getBoardInfo.data;
    const leftList = lists.find((l: any) => l.name.includes("[LEFT]")); // TODO: change any

    // A [LEFT] list exists move the users ticket to the bottom of it
    if (leftList && leftList.id) {
      await axios.put(
        `${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}&idList=${leftList.id}&pos=bottom`
      );
    }
    // Otherwise delete it completely
    else {
      await axios.delete(`${TRELLO_ENDPOINT}/cards/${id}?${tokenAndKeyParams}`);
    }
    return {
      status: 200,
      data: null,
    };
  } else {
    return {
      status: 400,
      data: {
        message: "Missing ticket or board id",
      },
    };
  }
};
