//import { CLIENT_VERSION } from "./Constants.js";
import actionMappings from "./actionMappings.js";

const CLIENT_VERSION = "1.0.0";

let socket = null;
let userId = null;
export function initSocket(token) {
  socket = io("http://gureunda.shop:3017", {
    query: {
      CLIENT_VERSION,
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

  // 서버 정보 전달 이벤트 처리
  socket.on("event", (data) => {
    const action = actionMappings[data.handlerId];
    if (!action) {
      console.log("Handler not found");
    }

    console.log("data" ,data.handlerId, data.data);
    if (data.status === "fail") {
      new Error();
    } else {
      action(data.data);
    }
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export const sendEvent = (handlerId, payload) => {
  const obj = {
    userId,
    CLIENT_VERSION,
    handlerId,
    payload,
  };

  return new Promise((resolve, reject) => {
    socket.emit("event", obj, (response) => {
      // 클라이언트에서 회신받을 때 사용
      if (response.status === "fail") {
        reject(response.message);
      } else {
        resolve(response.data);
      }
    });
  });
};
