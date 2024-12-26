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
    status: "succes",
    message: "게임을 시작합니다!",
    data: {
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

export const gameStageChange = (payload) => {
  const inGame = getInGame(uuid);
  inGame.stage++;
  console.log(inGame);
};
export const gameHouseChange = (payload) => {
  const inGame = getInGame(uuid);
  inGame.hp -= payload.parsedData.damage;
  console.log(inGame);
};
export const gameGoldChange = (payload) => {
  const inGame = getInGame(payload.uuid);
  inGame.gold += payload.parsedData.gold;
  console.log(inGame);
};
export const gameScoreChange = (payload) => {
  const inGame = getInGame(payload.uuid);
  inGame.score += payload.parsedData.score;
  console.log(inGame);
};
