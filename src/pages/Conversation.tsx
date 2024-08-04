import React, { FormEvent, useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IMessage } from "@/interfaces/MessagesInterface";
import Message from "@/components/Message";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useParams } from "react-router-dom";
import { formatDateString } from "@/utils/functions";

interface IProps {
  reservationId: string;
  clientName: string;
  isConversationClosed: boolean;
  endsAt: Date | undefined;
}

const Conversation = ({
  reservationId,
  clientName,
  endsAt,
  isConversationClosed,
}: IProps) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<IMessage[]>();
  const [newMessage, setNewMessage] = useState("");
  const userId = useSelector((state: RootState) => state.user.id);
  const token = useSelector((state: RootState) => state.user.token);
  const { apartmentId } = useParams();
  if (!userId || !apartmentId) return null;

  useEffect((): any => {
    // @ts-ignore -- Because TOKEN DOES exist on auth
    if (!socket.auth.token || !socket.connected) {
      // @ts-ignore -- Because TOKEN DOES exist on auth
      socket.auth.token = token;
      socket.disconnect().connect(); // Reconnect with new auth

      socket.emit("joinRoom", {
        reservationId: reservationId,
        userId: userId,
      });
    }

    return () => socket.disconnect();
  }, [socket, reservationId]);

  useEffect(() => {
    const handleMessages = (messages: IMessage[]) => {
      setMessages(messages);
    };

    socket.on("messages", handleMessages);

    return () => {
      socket.off("messages", handleMessages);
      socket.disconnect();
    };
  }, [socket, reservationId]);

  useEffect(() => {
    const handleNewMessage = (message: IMessage) => {
      setMessages((prevValue) => {
        if (prevValue) return [...prevValue, message];
      });
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!newMessage) return;
    socket.emit("message", {
      userId: userId,
      messageBody: newMessage,
      apartmentId: apartmentId,
      reservationId: reservationId,
      senderId: userId,
    });

    setNewMessage("");
  };

  return (
    <form onSubmit={sendMessage} className={"conversation"}>
      <div className={"conversation__client"}>
        <div className={"conversation__client__name"}>{clientName}</div>
        <div className={"conversation__client__date"}>
          {isConversationClosed && endsAt
            ? `Conversation ended at ${formatDateString(endsAt.toString())}`
            : `Conversation ends at ${formatDateString(endsAt?.toString() ?? "")} midnight`}
        </div>
      </div>
      <div className={"conversation__messages"}>
        {messages?.map((message) => {
          return (
            <Message
              key={message.messageId}
              type={message.senderId === userId ? "user" : "client"}
              message={message}
            />
          );
        })}
      </div>
      <div className={"conversation__input"}>
        <input
          type="text"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          disabled={isConversationClosed}
        />
        <button type="submit" disabled={isConversationClosed}>
          Send
        </button>
      </div>
    </form>
  );
};

export default Conversation;
