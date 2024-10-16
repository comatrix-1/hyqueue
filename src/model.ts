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
  cards?: ITrelloCard[];
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
  ticketNumber?: number;
  desc?: ITicketDescription;
  queueNo?: number;
  numberOfTicketsAhead?: number;
}

export interface ITicketDescription {
  ticketPrefix: string | null;
  name: string | null;
  contact: string | null;
  category: string | null;
  queueNo: string | null;
  nric?: string;
  postalcode?: string;
  description?: string;
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
  registrationFields: Array<keyof ITicketDescription>;
  categories: string[];
  feedbackLink: string;
  privacyPolicyLink: string;
  ticketPrefix: string;
  openingHours: IOpeningHour[];
  openingHoursTimeZone: string;
  waitTimePerTicket: number | null;
  isQueueClosed?: boolean;
}

export interface IOpeningHour {
  day: string;
  startHour?: string;
  endHour?: string;
}

export interface ITrelloBoardSettings {
  id?: string;
  desc?: IEditableSettings;
  name?: string;
}

export interface IQueueSystem {
  // Replaces ITrelloBoardSettings
  desc?: IEditableSettings;
  name?: string;
}

export interface ITrelloCard {
  id: string;
  idList?: string;
  name?: string;
  idShort?: number;
  desc?: any;
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

export interface IAuthorizeUrl {
  authorizeUrl: string;
}

export enum EQueueStatus {
  INVALID = "invalid",
  VALID = "valid",
  INACTIVE = "inactive",
  CLOSED = "closed",
}
