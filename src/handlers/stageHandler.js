import { endLoop, startLoop } from "../gameLogic/serverGame.js";
import { createInGame, getInGame } from "../models/inGame.js";

export const gameStart = (uuid, payload) => {
  const inGame = createInGame(uuid);
  startLoop(inGame, uuid);
};

export const gameEnd = (uuid, payload) => {
  const inGame = createInGame(uuid);
  endLoop(inGame, uuid);
};

// 여기 아래는 서버에서 핸들러가 따로 없음

export const gameStageChange = (uuid, payload) => {
  const inGame = getInGame(uuid);
  inGame.stage++;
  console.log(inGame);
};
export const gameHouseChange = (uuid, payload) => {
  const inGame = getInGame(uuid);
  inGame.hp -= payload.damage;
  console.log(inGame);
};
export const gameGoldChange = (uuid, payload) => {
  const inGame = getInGame(uuid);
  inGame.gold += payload.gold;
  console.log(inGame);
};
export const gameScoreChange = (uuid, payload) => {
  const inGame = getInGame(uuid);
  inGame.score += payload.score;
  console.log(inGame);
};
