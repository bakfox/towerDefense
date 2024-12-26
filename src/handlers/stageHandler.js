import { endLoop, startLoop } from "../gameLogic/serverGame.js";
import { createInGame, getInGame } from "../models/inGame.js";

export const gameStart = (payload) => {
  const inGame = createInGame(payload.uuid);
  startLoop(inGame, payload.uuid, payload.socket);
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
