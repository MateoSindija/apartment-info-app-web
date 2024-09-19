import config from "@/config";
import { createContext } from "react";
import { io } from "socket.io-client";

// export const socket = io("http://127.0.0.1:4000", {
export const socket = io(config.app.serverUrl, {
  autoConnect: true,
  reconnectionDelayMax: 1000,
  forceNew: true,
  multiplex: false,
  auth: {
    token: null,
  },
});

export const SocketContext = createContext(socket);
