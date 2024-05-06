import React, { useEffect, useState } from "react";
import Navbar from "../components/Layout.tsx";
import Layout from "../components/Layout.tsx";
import { Button, Container, Form } from "react-bootstrap";
import { IReview } from "../interfaces/NewItemInterface.ts";
import { IMessage, IMessages } from "../interfaces/MessagesInterface.ts";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase.ts";
import Message from "../components/Message.tsx";

const MessagesPage = () => {
  const [messages, setMessages] = useState<IMessages>({ allMessages: [] });
  const [newMessage, setNewMessage] = useState("");

  const collectionRefOwner = collection(
    db,
    "Messages",
    "OwnerMessages",
    "Messages"
  );
  const collectionRefUser = collection(
    db,
    "Messages",
    "UserMessages",
    "Messages"
  );
  const getData = async () => {
    const queryOwner = query(collectionRefOwner, orderBy("timestamp", "desc"));
    const querySnapshotOwner = await getDocs(queryOwner);

    const queryUser = query(collectionRefUser, orderBy("timestamp", "desc"));
    const querySnapshotUser = await getDocs(queryUser);

    const newUserMessages: IMessage[] = [];
    const newOwnerMessages: IMessage[] = [];

    querySnapshotUser.docs.forEach((doc) => {
      const data = doc.data() as IMessage;
      newUserMessages.push({ ...data, id: doc.id, type: "user" });
    });

    querySnapshotOwner.docs.forEach((doc) => {
      const data = doc.data() as IMessage;
      newOwnerMessages.push({ ...data, id: doc.id, type: "owner" });
    });

    const mergedMessages = [...newUserMessages, ...newOwnerMessages];

    mergedMessages.sort(
      (a: IMessage, b: IMessage) => a.timestamp - b.timestamp
    );

    setMessages({ allMessages: mergedMessages });
  };
  useEffect(() => {
    getData();
  }, []);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newMessage.length === 0) return;
    await addDoc(collectionRefOwner, {
      message: newMessage,
      timestamp: new Date(),
    });
    setNewMessage("");
    await getData();
  };

  return (
    <Layout>
      <div className="mb-2">Messages</div>
      <div
        className="w-100 mb-3 p-2"
        style={{ maxHeight: "70vh", overflowY: "scroll" }}
      >
        {messages.allMessages.map((message) => {
          return <Message key={message.id} {...message} />;
        })}
      </div>
      <Form className="flex" onSubmit={sendMessage}>
        <Form.Control
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </Form>
    </Layout>
  );
};

export default MessagesPage;
