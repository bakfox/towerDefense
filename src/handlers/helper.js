import { CLIENT_VERSION } from "../constants.js";

import handlerMappings from "./handlerMapping.js";

export const handleEvent = async (io, socket, uuId, data, callBack) => {
  console.log("data : ", typeof data, data);
  const payload = { uuId, socket, data: data.payload };
  console.log(data);
  //console.log(parsedData.data, parsedData);
  if (!CLIENT_VERSION.includes(data.CLIENT_VERSION)) {
    //클라이언트 버전
    socket.emit("response", {
      status: "fail",
      message: "클라이언트 버전이 이상합니다!",
      data: {},
    });
    return;
  }
  const handler = handlerMappings[data.handlerId];
  // 핸들러 존재 여부 체크
  if (!handler) {
    socket.emit("response", {
      status: "fail",
      message: "지정된 핸들러가 없어요!",
      data: {},
    });
    return;
  }

  const response = await handler(payload);

  console.log(response.broadcast);
  if (response.broadcast) {
    console.log("유저 호출");
    io.emit("responseAll", response);
    return;
  }

  callBack(response);

  //socket.emit("response", response);
};
