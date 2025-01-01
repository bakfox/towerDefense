import { deleteInGame } from "../models/inGame.js";
import { moveClient, spawnNextMonster } from "../handlers/monsterHandler.js";
import { gameStageChange } from "../handlers/stageHandler.js";
import { prisma } from "../utils/index.js";
const FPS = 1;
const interval = 1000 / FPS;

//이거 호출해서 루프 시작
async function logicLoop(ingame, uuid, path, socket) {
  const start = Date.now();
  if (!ingame || !ingame.isRunning) {
    console.log(`클라이언트 ${uuid}의 로직 루프가 종료되었습니다.`);
    return;
  }
  const elapsed = Date.now() - start;
  // console.log(`클라이언트 ${uuid}의 로직 실행 시간:`, elapsed);
  // console.log(ingame);

  //타워 공격 호출
  if (ingame.tower.length !== 0) {
    ingame.tower.forEach((tower) => {
      tower.decreaseCooldown(socket, ingame); // 쿨타임 감소
    });
  }
  if (ingame.monster.length !== 0) {
    ingame.monster.forEach((monster) => {
      monster.move(socket, ingame, uuid);
      console.log(monster.x, monster.y, "변화한");
    });
    moveClient(socket, ingame); //클라에 데이터 보내기
  }

  spawnNextMonster(socket, ingame);

  if (!ingame.isSpawn) {
    const checkMonster = ingame.monster.every(
      (monster) => monster.isDead === true
    );
    //console.log(checkMonster, "아직 살음");
    if (checkMonster) {
      gameStageChange(socket, ingame, path);
      ingame.isSpawn = true;
    }
  }

  setTimeout(
    () => {
      logicLoop(ingame, uuid, path, socket).catch((err) => {
        console.error("Error in logicLoop:", err);
      });
    },
    Math.max(0, interval - elapsed)
  );
}

export const startLoop = (ingame, uuid, path, socket) => {
  logicLoop(ingame, uuid, path, socket);
};

// 실행시 루프 종료
export const endLoop = async (socket, ingame, uuid) => {
  ingame.isRunning = false;
  const gem = parseInt(ingame.score / 10);
  try {
    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.uSERS.update({
        where: {
          USER_ID: ingame.userId,
        },
        data: {
          GEM: { increment: gem },
        },
      });
      await tx.sCORES.create({
        data: {
          USER_ID: ingame.userId,
          MAX_SCORE: ingame.score,
          END_TIME: new Date(),
        },
      });
      return user;
    });
    if (!user) {
      throw new Error("정보를 제대로 저장하지 못했습니다.");
    }
    socket.emit("event", {
      handlerId: 2,
      status: "succes",
      message: "게임을 종료합니다.",
      data: {
        playerStage: inGame.stage,
        score: ingame.score,
        gem: gem,
      },
    });
    setTimeout(() => {
      deleteInGame[uuid]; // uuid에 해당하는 게임 데이터를 삭제
      console.log(`게임 데이터가 ${uuid}에 대해 삭제되었습니다.`);
    }, 5000);
  } catch (error) {
    return {
      status: "fail",
      message: error.message,
      data: {},
    };
  }
};
