import monsterData from "../../gameDefaultData/monster.js";
import stageData from "../../gameDefaultData/stage.js";
import towerData from "../../gameDefaultData/tower.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { endLoop, startLoop } from "../gameLogic/serverGame.js";
import { createInGame } from "../models/inGame.js";
import { prisma } from "../utils/index.js";
import { spawnMonsters } from "./monsterHandler.js";

dotenv.config();

// 경로 만드는 함수 처음에 canvas width , height 값 받아와서 객체 형테로 사용
function monsterPathMake(canvas) {
  const path = [];

  let minWidth =0;
  let minHeight =100;
  let maxWidth = canvas.width - 100;
  let maxHeight = canvas.height - 100;

  let currentX = minWidth;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });
  while (currentX < maxWidth) {
    console.log(canvas.width, currentX);
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > maxWidth) {
      currentX = maxWidth;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < minHeight) {
      currentY = minHeight;
    }
    if (currentY > maxHeight) {
      currentY = maxHeight;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

export const gameStart = async (payload) => {
  const ingame = createInGame(payload.uuid);
  try {
    const [tokenType, token] = payload.data.cookies.split("%20");

    if (tokenType !== "Bearer") {
      throw new Error("토큰 타입이 일치하지 않습니다.");
    }

    const decodedToken = jwt.verify(token, process.env.JSONWEBTOKEN_KEY);
    const id = +decodedToken.userId;

    const newPath = monsterPathMake({
      width: payload.data.width,
      height: payload.data.height,
    });

    //유저 데이터 찾기 나중에 저거 확인해보니 안에 이미 userID가 있음
    const user = await prisma.uSERS.findFirst({
      where: { USER_ID: id },
    });

    if (!user) {
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    //인게임에 user_id 저장
    ingame.userId = user.USER_ID;

    const ownTowersData = await prisma.eQUIP_TOWERS.findMany({
      where: {
        USER_ID: +user.USER_ID,
      },
      include: {
        OWN_TOWERS: true,
      },
    });

    const towerDec = [];

    if (ownTowersData) {
      ownTowersData.forEach((Towers) => {
        towerDec.push({
          ID: Towers.OWN_TOWERS.ID,
          UPGRADE: Towers.OWN_TOWERS.UPGRADE,
        });
      });
    }
    console.log(towerDec, "왜 안됨?");
    ingame.ownTower = towerDec;

    const nowStageData = stageData.data[ingame.stage];
    const nowMonsterData = [];
    for (let index = 0; index < nowStageData.length; index++) {
      nowMonsterData.push(monsterData.data[nowStageData[index].id - 1]);
    }

    spawnMonsters(ingame, newPath, nowMonsterData, nowStageData);

    startLoop(ingame, payload.uuid, newPath, payload.socket);

    return {
      status: "succes",
      message: "게임을 시작합니다!",
      data: {
        path: newPath,
        towerDec,
        stage: ingame.stage,
        playerHp: ingame.house.hp,
        playerGold: ingame.gold,
        monster: nowMonsterData,
        tower: towerData,
      },
    };
  } catch (error) {
    return {
      status: "fail",
      message: "게임 시작에 실패했습니다 : " + error.message,
      data: {},
    };
  }
};
export const gameEnd = (socket, ingame, uuid) => {
  endLoop(socket, ingame, uuid);
};

// 여기 아래는 서버에서 핸들러가 따로 없음 객체 형태로 보내기

export const gameStageChange = (socket, ingame) => {
  ingame.stage++;
  ingame.stage =
    ingame.stage >= stageData.data.length ? stageData.data.lengt : ingame.stage;
  const nextStageData = stageData.data[ingame.stage];
  const nextMonsterData = [];
  for (let index = 0; index < nextStageData.length; index++) {
    nextMonsterData.push(monsterData.data[nextStageData[index].id]);
  }
  spawnMonsters(ingame, path, nextStageData);

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

export const gameHouseChange = (socket, ingame, damage, uuid) => {
  ingame.house.hp -= damage;

  socket.emit("event", {
    handlerId: 4,
    status: "succes",
    message: "하우스 체력 변경에 성공했습니다",
    data: {
      playerHp: ingame.house.hp,
    },
  });

  if (ingame.house.hp <= 0) {
    gameEnd(socket, ingame, uuid);
  }
};
export const gameGoldChange = (socket, ingame, gold) => {
  ingame.gold += gold;
  socket.emit("event", {
    handlerId: 5,
    status: "succes",
    message: "골드 변경에 성공했습니다",
    data: {
      playerGold: ingame.gold,
    },
  });
};
export const gameScoreChange = (socket, ingame, score) => {
  ingame.score += score;
  socket.emit("event", {
    handlerId: 6,
    status: "succes",
    message: "점수 변경에 성공했습니다",
    data: {
      score: ingame.score,
    },
  });
};
