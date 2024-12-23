import { v4 as uuIdV4 } from "uuId";
//실질적인 실행 코드 입니다.
const registerHander = (io) => {
  // 접속후 다음 이벤트를 받기 위해 대기하는 메소드입니다!
  io.on("connection", (socket) => {
    const userUUID = uuIdV4();
    //접속
    socket.emit("handleConnect", {});

    socket.on("event", (data) => handleEvent(io, socket, userUUID, data)); //이벤트 핸들러 연결

    //접속 해제
    socket.on("disconnect", (socket) => {});
  });
};
export default registerHander;
