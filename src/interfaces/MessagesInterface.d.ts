export interface IMessages {
  allMessages: IMessage[];
}

export interface IMessage {
  apartmentId: string;
  isRead: boolean;
  messageBody: string;
  messageId: string;
  senderId: string;
  userId: string;
}
