import { createInGame, deleteInGame, getInGame } from "../models/inGame.js";

const FPS = 1;
const interval = 1000 / FPS;

//이거 호출해서 루프 시작
async function logicLoop(ingame, uuid, socket) {
  const start = Date.now();
  if (!ingame || !ingame.isRunning) {
    console.log(`클라이언트 ${uuid}의 로직 루프가 종료되었습니다.`);
    return;
  }
  const elapsed = Date.now() - start;
  console.log(`클라이언트 ${uuid}의 로직 실행 시간:`, elapsed);
  console.log(ingame);

  setTimeout(
    () => {
      logicLoop(ingame, uuid, socket).catch((err) => {
        console.error("Error in logicLoop:", err);
      });
    },
    Math.max(0, interval - elapsed)
  );
}

export const startLoop = (ingame, uuid, socket) => {
  logicLoop(ingame, uuid, socket);
};

// 실행시 루프 종료
export const endLoop = (ingame, uuid) => {
  ingame.isRunning = false;
  setTimeout(() => {
    deleteInGame[uuid]; // uuid에 해당하는 게임 데이터를 삭제
    console.log(`게임 데이터가 ${uuid}에 대해 삭제되었습니다.`);
  }, 1000);
};
