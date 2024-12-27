import { createInGame, deleteInGame } from "../models/inGame.js";
import { spawnNextMonster } from "../handlers/monsterHandler.js";

const FPS = 1;
const interval = 1000 / FPS;
const monsterCoolTime =10;

//이거 호출해서 루프 시작
async function logicLoop(ingame, uuid, skt) {
  const start = Date.now();
  //const socket = skt;
  if (!ingame || !ingame.isRunning) {
    console.log(`클라이언트 ${uuid}의 로직 루프가 종료되었습니다.`);
    return;
  }
  const elapsed = Date.now() - start;
  console.log(`클라이언트 ${uuid}의 로직 실행 시간:`, elapsed);
  console.log(ingame);

  //함수 들어갈 자리
  //핸들러로 옮기기
  if(ingame.isSpawn === true){
    if(monsterCoolTime ===0){
      spawnNextMonster(ingame, skt);
      monsterCoolTime = 10;
    }else monsterCoolTime--;
  }
 



  //

  setTimeout(
    () => {
      logicLoop(ingame, uuid, skt).catch((err) => {
        console.error("Error in logicLoop:", err);
      });
    },
    Math.max(0, interval - elapsed)
  );
}

export const startLoop = (ingame, uuid) => {
  logicLoop(ingame, uuid);
};

// 실행시 루프 종료
export const endLoop = (ingame, uuid) => {
  ingame.isRunning = false;
  setTimeout(() => {
    deleteInGame[uuid]; // uuid에 해당하는 게임 데이터를 삭제
    console.log(`게임 데이터가 ${uuid}에 대해 삭제되었습니다.`);
  }, 5000);
};
