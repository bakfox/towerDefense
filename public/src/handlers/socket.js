import { CLIENT_VERSION } from "./Constants.js";

const socket = io("http://localhost:3017", {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
let towerData = null;

socket.on("response", (data) => {
  console.log(data);
});

socket.on("connection", (data) => {
  console.log("connection: ", data);
  userId = data.uuid;
  
  socket.emit("getTowerData");
});

socket.on("towerData", (data) => {
  towerData = data;
});

socket.on("event", (data) => {
  const action = actionMappings[data.handlerId];
  console.log(data.handlerId, action);
  if (!action) {
    console.log("Handler not found");
  }

  //action(data.userId, data.payload);
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
      // 클라이언트에서 회신받을 때 사용
      if (response.status === "fail") {
        reject(response.message);
      } else {
        resolve(response);
      }
    });
  });
};

const getTowerData = () => towerData;

export { sendEvent, towerData };
