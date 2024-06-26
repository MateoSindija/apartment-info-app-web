export interface IFirebaseTimestamp {
  nanoseconds: number;
  seconds: number;
}

export interface IMessages {
  allMessages: IMessage[];
}

export interface IMessage {
  message: string;
  timestamp: IFirebaseTimestamp;
  id: string;
  type: "user" | "owner";
}
