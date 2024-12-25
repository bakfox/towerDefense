import { CLIENT_VERSION } from "./Constants.js";

let socket = null;
let userId = null;

export function initSocket(token) {
  socket = io("http://localhost:3017", {
    query: {
      clientVersion: CLIENT_VERSION,
      auth: { token },
    },
  });

  socket.on("response", (data) => {
    console.log(data);
  });

  socket.on("connection", (data) => {
    console.log("connection: ", data);
    userId = data.uuid;
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export const sendEvent = (handlerId, payload) => {
  socket.emit("event", {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};
