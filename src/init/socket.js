import { Server as SocketIO } from "socket.io";
import registerHander from "../handlers/regiser.handler.js";
// 소캣io를 만들고 거기에 현재 만든 서버를 연결함!
const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server);

  registerHander(io);
};

export default initSocket;
