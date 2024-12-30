import monsterData from "../../gameDefaultData/monster.js";
import stageData from "../../gameDefaultData/stage.js";
import towerData from "../../gameDefaultData/tower.js";
import { endLoop, startLoop } from "../gameLogic/serverGame.js";
import { createInGame, getInGame } from "../models/inGame.js";
import { prisma } from "../utils/index.js";

// 경로 만드는 함수 처음에 canvas width , height 값 받아와서 객체 형테로 사용
function monsterPathMake(canvas) {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });
  while (currentX < canvas.width) {
    console.log(canvas.width, currentX);
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width) {
      currentX = canvas.width;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentY > canvas.height) {
      currentY = canvas.height;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

export const gameStart = async (payload) => {
  const inGame = createInGame(payload.uuid);
  const newPath = monsterPathMake({
    width: payload.data.width,
    height: payload.data.height,
  });
  const ownTowersData = await prisma.uSERS.findUnique({
    where: {
      USER_ID: +payload.USER_ID,
    },
    include: {
      EQUIP_TOWERS: {
        include: {
          OWN_TOWERS: true,
        },
      },
    },
  });
  const towerDec = [];
  if (ownTowersData) {
    ownTowersData.EQUIP_TOWERS.forEach((Towers) => {
      towerDec.push({ ID: Towers.ID, UPGRADE: Towers.UPGRADE });
    });
  }
  inGame.ownTower = towerDec;
  startLoop(inGame, payload.uuid, newPath, payload.socket);
  const nowStageData = stageData.data[inGame.stage];
  const nowMonsterData = [];
  for (let index = 0; index < nowStageData.length; index++) {
    nowMonsterData.push(monsterData.data[nowStageData[index].id]);
  }
  console.log(nowMonsterData, nowStageData);
  return {
    status: "succes",
    message: "게임을 시작합니다!",
    data: {
      towerDec,
      stage: inGame.stage,
      playerHp: inGame.house.hp,
      playerGold: inGame.gold,
      monster: nowMonsterData,
      tower: towerData,
    },
    // towerDec,
    // monsterPath,
    // playerHp: houseHp,
    // playerGold: GameManager.userGold,
    // stage: GameManager.stage,
  };
};
export const gameEnd = (payload) => {
  const inGame = createInGame(payload.uuid);
  endLoop(inGame, payload.uuid);
};

// 여기 아래는 서버에서 핸들러가 따로 없음 객체 형태로 보내기

export const gameStageChange = (socket, inGame) => {
  inGame.stage++;
  const nextStageData = stageData.data[inGame.stage];
  const nextMonsterData = [];
  for (let index = 0; index < nextStageData.length; index++) {
    nextMonsterData.push(monsterData.data[nextStageData[index].id]);
  }
  console.log(inGame);
  socket.emit("event", {
    handlerId: 3,
    status: "succes",
    message: "스테이지 변경에 성공했습니다",
    data: {
      playerStage: inGame.stage,
      monster: nextMonsterData,
    },
  });
};

export const gameHouseChange = (socket, inGame, damage) => {
  inGame.hp -= damage;
  console.log(inGame);
  socket.emit("event", {
    handlerId: 4,
    status: "succes",
    message: "하우스 체력 변경에 성공했습니다",
    data: {
      playerHp: inGame.house.hp,
    },
  });
};
export const gameGoldChange = (socket, inGame, gold) => {
  inGame.gold += gold;
  console.log(inGame);
  socket.emit("event", {
    handlerId: 5,
    status: "succes",
    message: "골드 변경에 성공했습니다",
    data: {
      playerGold: inGame.gold,
    },
  });
};
export const gameScoreChange = (socket, inGame, score) => {
  inGame.score += score;
  console.log(inGame);
  socket.emit("event", {
    handlerId: 6,
    status: "succes",
    message: "점수 변경에 성공했습니다",
    data: {
      score: inGame.score,
    },
  });
};
