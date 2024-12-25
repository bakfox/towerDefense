import { CLIENT_VERSION } from "./Constants.js";
import { actionMappings } from "./actionMappings.js";

const socket = io("http://localhost:3000", {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on("response", (data) => {
  console.log(data);
});

socket.on("connection", (data) => {
  console.log("connection: ", data);
  userId = data.uuid;
});

// 서버 이벤트 처리
socket.on("event", (data) => {
  const action = actionMappings[data.handlerId];

  if (!handler) {
    console.log("Handler not found");
  }

  action(data.userId, data.payload);
});

const sendEvent = (handlerId, payload) => {
  const obj = {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  };

  return new Promise((resolve, reject) => {
    socket.emit("event", obj, (response) => {
      if (response.status === "fail") {
        reject(response.message);
      } else {
        resolve(response);
      }
    });
  });
};

export { sendEvent };
