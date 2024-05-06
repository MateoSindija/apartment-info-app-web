import React from "react";
import { IMessage } from "../interfaces/MessagesInterface";

const Message = ({ id, message, timestamp, type }: IMessage) => {
  return (
    <div
      className={`${
        type === "owner" ? "ms-auto bg-primary text-light" : "me-auto bg-light"
      }  py-1 px-3 border rounded-pill mw-50`}
      style={{ width: "fit-content", maxWidth: "50%" }}
    >
      {message}
    </div>
  );
};

export default Message;
