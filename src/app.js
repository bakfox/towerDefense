import express from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";
import { loadDefaultData } from "./init/defaultData.js";

const app = express();
const server = createServer(app);

const PORT = 3017;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server); // 소켓 추가

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // 이 곳에서 파일 읽으면 됨
});
