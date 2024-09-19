import React from "react";
import { IMessage } from "@/interfaces/MessagesInterface";

interface IProps {
  message: IMessage;
  type: "user" | "client";
}
const Message = ({ message: { messageBody }, type }: IProps) => {
  return (
    <div className={`message ${type === "user" ? "user" : "client"}`}>
      {messageBody}
    </div>
  );
};

export default Message;
