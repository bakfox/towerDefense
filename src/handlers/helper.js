import { CLIENT_VERSION } from "../constants.js";

import handlerMappings from "./handlerMapping.js";

export const handleEvent = (io, socket, uuId, data) => {
  const parsedData = JSON.parse(data);
  console.log(parsedData.data, parsedData);
  if (!CLIENT_VERSION.includes(parsedData.CLIENT_VERSION)) {
    //클라이언트 버전
    socket.emit("response", {
      status: "fail",
      message: "클라이언트 버전이 이상합니다!",
      data: {},
    });
    return;
  }
  const handler = handlerMappings[parsedData.handlerId];
  // 핸들러 존재 여부 체크
  if (!handler) {
    socket.emit("response", {
      status: "fail",
      message: "지정된 핸들러가 없어요!",
      data: {},
    });
    return;
  }

  const response = handler(uuId, parsedData.data);
  console.log(response.broadcast);
  if (response.broadcast) {
    console.log("유저 호출");
    io.emit("responseAll", response);
    return;
  }

  socket.emit("response", response);
};
