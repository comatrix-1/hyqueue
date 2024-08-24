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

export interface ITrelloList {
  id: string;
  name: string;
  cards: ITrelloCard[];
}
export interface IQueue {
  // Replaces ITrelloList
  id: string;
  name: string;
  tickets?: ITicket;
}

export interface ITicket {
  // Replaces ITrelloCard
  id: string;
  queueId?: string;
  queueName?: string;
  name?: string;
  idShort?: number;
  desc?: any;
  shortLink?: string;
  queueNo?: number;
  numberOfTicketsAhead?: number;
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
  ticketPrefix: string | null;
  name: string | null;
  contact: string | null;
  category: string | null;
  queueNo: string | null;
}

export interface IApiConfig {
  token: string;
  key: string;
}

export interface IApiResponse<T> {
  status: number;
  data: {
    message: string;
    data: T | null;
  };
}

export interface IEditableSettings {
  registrationFields: any[]; // TODO: change any
  categories: any[]; // TODO: change any
  feedbackLink: string;
  privacyPolicyLink: string;
  ticketPrefix: string;
  openingHours: any[]; // TODO: change any
  waitTimePerTicket: number | null;
}

export interface ITrelloBoardSettings {
  id?: string;
  desc?: IEditableSettings;
  name?: string;
}

export interface IQueueSystem {
  // Replaces ITrelloBoardSettings
  id?: string;
  desc?: IEditableSettings;
  name?: string;
}

export interface ITrelloCard {
  id: string;
  idList?: string;
  name?: string;
  idShort?: number;
  desc?: any;
  shortLink?: string;
  queueNo?: number;
}
export interface ICard extends ITrelloCard {
  numberOfTicketsAhead?: number;
  queueName?: string;
}

export interface IList {
  id: string;
  name: string;
  cards: ITrelloCard[];
}

export interface IBoardData {
  lists: IList[];
  cards: ITrelloCard[];
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

export interface IApiResponseQueue {
  servers: any[]; // TODO: change any
  served: any[]; // TODO: change any
  pending: any[]; // TODO: change any
  removed: any[]; // TODO: change any
  done: any[]; // TODO: change any
  error: any[]; // TODO: change any
}

export interface IAuthorizeUrl {
  authorizeUrl: string;
}
