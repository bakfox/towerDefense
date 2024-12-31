import { v4 as uuIdV4 } from "uuid";
import { gameStart } from "./stageHandler.js";
import { handleEvent } from "./helper.js";

//실질적인 실행 코드 입니다.
const registerHander = (io) => {
  // 접속후 다음 이벤트를 받기 위해 대기하는 메소드입니다!
  io.on("connection", (socket) => {
    //uuid를 이용해서 토큰을 설정하도록 하자.
    const userUUID = uuIdV4();
    console.log(userUUID + "님 접속했습니다.");

    //접속
    socket.emit("handleConnect", {});

    socket.on("event", (data, callBack) => handleEvent(io, socket, userUUID, data, callBack)); //이벤트 핸들러 연결

    //접속 해제
    socket.on("disconnect", (socket) => {});

    //gameStart({ uuid: userUUID, socket });
  });
};
export default registerHander;
