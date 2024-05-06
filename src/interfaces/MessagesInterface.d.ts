export interface IMessages {
  allMessages: IMessage[];
}

export interface IMessage {
  message: string;
  timestamp: Date;
  id: string;
  type: "user" | "owner";
}
