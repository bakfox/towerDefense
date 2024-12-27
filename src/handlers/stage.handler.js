import monsterData from "../../gameDefaultData/monster.js";
import stageData from "../../gameDefaultData/stage.js";
import towerData from "../../gameDefaultData/tower.js";
import { endLoop, startLoop } from "../gameLogic/serverGame.js";
import { createInGame, getInGame } from "../models/inGame.js";

export const gameStart = (payload) => {
  const inGame = createInGame(payload.uuid);
  startLoop(inGame, payload.uuid, payload.socket);
  const nowStageData = stageData.data[inGame.stage];
  const nowMonsterData = [];
  for (let index = 0; index < nowStageData.length; index++) {
    nowMonsterData.push(monsterData.data[nowStageData[index].id]);
  }
  console.log(nowMonsterData, nowStageData);
  return {
    handlerId: 1,
    status: "succes",
    message: "게임을 시작합니다!",
    data: {
      inGameData: inGame,
      nowStageData,
      nowMonsterData,
      towerData,
    },
  };
};
export const gameEnd = (payload) => {
  const inGame = createInGame(payload.uuid);
  endLoop(inGame, payload.uuid);
};

// 여기 아래는 서버에서 핸들러가 따로 없음 객체 형태로 보내기

export const gameStageChange = (socket) => {
  const inGame = getInGame(uuid);
  inGame.stage++;
  const nextStageData = stageData.data[inGame.stage];
  const nextMonsterData = [];
  for (let index = 0; index < nowStageData.length; index++) {
    nextMonsterData.push(monsterData.data[nowStageData[index].id]);
  }
  console.log(inGame);
  socket.emit("event", {
    handlerId: 3,
    status: "succes",
    message: "스테이지 변경에 성공했습니다",
    data: {
      stage: inGame.stage,
      nextStageData,
      nextMonsterData,
    },
  });
};
export const gameHouseChange = (socket, damage) => {
  const inGame = getInGame(uuid);
  inGame.hp -= damage;
  console.log(inGame);
  socket.emit("event", {
    handlerId: 4,
    status: "succes",
    message: "스테이지 변경에 성공했습니다",
    data: {
      stage: inGame.stage,
    },
  });
};
export const gameGoldChange = (socket, gold) => {
  const inGame = getInGame(payload.uuid);
  inGame.gold += gold;
  console.log(inGame);
  socket.emit("event", {
    handlerId: 5,
    status: "succes",
    message: "스테이지 변경에 성공했습니다",
    data: {
      stage: inGame.stage,
      nextStageData,
      nextMonsterData,
    },
  });
};
export const gameScoreChange = (socket, score) => {
  const inGame = getInGame(payload.uuid);
  inGame.score += score;
  console.log(inGame);
  socket.emit("event", {
    handlerId: 6,
    status: "succes",
    message: "스테이지 변경에 성공했습니다",
    data: {
      stage: inGame.stage,
      nextStageData,
      nextMonsterData,
    },
  });
};
