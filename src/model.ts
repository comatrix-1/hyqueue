export interface ITrelloBoardList {
  id: string;
  name: string;
  closed: boolean;
  color: string | null;
  idBoard: string;
  pos: number;
  subscribed: boolean;
  softLimit: null;
}

// TODO: remove if not needed
export interface ITrelloApiResponse {
  status: number;
  statusText: string;
  headers: {
    "content-encoding": string;
    "content-type": string;
    date: string;
    etag: string;
    vary: string;
  };
  config: {
    url: string;
    method: string;
    headers: {
      Accept: string;
    };
    transformRequest: null[];
    transformResponse: null[];
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
    transitional: {
      silentJSONParsing: boolean;
      forcedJSONParsing: boolean;
      clarifyTimeoutError: boolean;
    };
  };
  request: {};
}

export interface ITicketDescription {
  ticketPrefix: string;
  name: string;
  contact: string;
  category: string;
}

export interface IApiConfig {
  token: string;
  key: string;
  boardId: string;
}

export interface IEditableSettings {
  registrationFields: any[]; // TODO: change any
  categories: any[]; // TODO: change any
  feedbackLink: string;
  privacyPolicyLink: string;
  ticketPrefix: string;
  openingHours: any[]; // TODO: change any
}

export interface ITrelloBoardSettings {
  desc: string;
  name: string;
}

export interface ITrelloBoardData {
  name: string;
  shortUrl: string;
}

export interface ICard {
  id: string;
  idList: string;
  name: string;
  idShort: number;
  desc: string;
  numberOfTicketsAhead?: number;
  queueName?: string;
}

export interface IList {
  id: string;
  name: string;
  cards: ICard[];
}

export interface IBoardData {
  lists: IList[];
  cards: ICard[];
}

export enum EQueueTitles {
  PENDING = "[PENDING]",
  ALERTED = "[ALERT]",
  DONE = "[DONE]",
  MISSED = "[MISSED]",
}

export enum ETicketStatus {
  PENDING = "pending",
  REMOVED = "removed",
  ALERTED = "alerted",
  SERVED = "served",
  MISSED = "missed",
  ERROR = "error",
}