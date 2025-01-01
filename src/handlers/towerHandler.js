import { getInGame } from "../models/inGame.js";
import { createTowerFromData } from "../models/tower.model.js"; // 타워 생성 함수
import towerData from "../../gameDefaultData/tower.js"; // 타워 기본 데이터
import { gameGoldChange } from "./stageHandler.js";

// 타워가 인게임 데이터에 존재하는지 확인하는 함수
const existTowerHandler = (towerId, inGame) => {
  const tower = inGame.tower.find((t) => t.towerId === towerId);
  if (!tower) {
    throw new Error(`타워 ${towerId}는 존재하지 않습니다.`);
  }
  return tower;
};

// 골드가 충분한지 확인하는 함수
const haveGold = (inGame, cost) => {
  if (inGame.gold < cost) {
    throw new Error("골드가 부족합니다.");
  }
  return true;
};

// 타워를 게임에 설치하는 함수
export const installTowerHandler = (payload) => {
  const { uuid, socket } = payload;
  const { towerType, location } = payload.data;
  const inGame = getInGame(uuid);

  try {
    // 타워 객체 생성
    const newTower = createTowerFromData(towerType, location);

    // 타워 설치 비용 확인 (타워의 price 사용)
    const installCost = newTower.price;

    // 골드가 충분한지 확인
    haveGold(inGame, installCost);

    // 골드 차감
    gameGoldChange(socket, inGame, -installCost);

    // 타워를 게임에 설치
    inGame.tower.push(newTower); // 타워 객체 자체를 저장
    return {
      status: "success",
      message: "타워가 설치되었습니다.",
      data: {
        tower: newTower, // 고유 ID 포함된 타워 정보 반환
      },
    };
  } catch (error) {
    return {
      status: "fail",
      message: error.message,
      data: {},
    };
  }
};

// 타워 판매 핸들러
export const refundTowerHandler = (payload) => {
  const { uuid, socket } = payload;
  const { towerId } = payload.data;
  const inGame = getInGame(uuid);

  try {
    // 타워가 인게임 데이터에 존재하는지 확인
    const tower = existTowerHandler(towerId, inGame);

    // 환불 금액 계산 (기본 가격 + 업그레이드 값에 비례하는 금액)
    const refundValue = tower.price + (tower.upgradeValue * tower.price) / 2;

    // 골드 환불불
    gameGoldChange(socket, inGame, refundValue);

    // 타워 삭제
    inGame.towers = inGame.tower.filter((t) => t.towerId !== towerId);

    return {
      status: "success",
      message: `타워가 환불되었습니다. 환불 금액: ${refundValue} 골드`,
      data: {
        towerId,
        refundedGold: refundValue,
      },
    };
  } catch (error) {
    return {
      status: "fail",
      message: error.message,
      data: {},
    };
  }
};

// 타워 이동 핸들러
export const moveTowerHandler = (payload) => {
  const { uuid, towerId, moveLocation } = payload;
  const inGame = getInGame(uuid);

  try {
    // 타워가 인게임 데이터에 존재하는지 확인
    const tower = existTowerHandler(towerId, inGame);

    // 타워 이동
    tower.moveTower(moveLocation);
    return {
      status: "success",
      message: "타워가 이동되었습니다.",
      data: {
        tower: tower, // 이동된 타워 정보 반환
      },
    };
  } catch (error) {
    return {
      status: "fail",
      message: error.message,
      data: {},
    };
  }
};

// 타워 업그레이드를 처리하는 함수
export const upgradeTowerHandler = (payload) => {
  const { uuid, socket } = payload;
  const { towerId } = payload.data;
  const inGame = getInGame(uuid);

  try {
    // 타워가 인게임 데이터에 존재하는지 확인
    const tower = existTowerHandler(towerId, inGame);

    // 업그레이드 비용 계산 (타워의 price * upgradeValue 사용)
    const upgradeCost = tower.upgradeValue * tower.price;

    // 골드가 충분한지 확인
    haveGold(inGame, upgradeCost);

    // 골드 차감
    gameGoldChange(socket, inGame, -upgradeCost);

    // 타워 업그레이드
    tower.upgradeTower();
    return {
      status: "success",
      message: "타워가 업그레이드되었습니다.",
      data: {
        tower: tower, // 업그레이드된 타워 정보 반환
      },
    };
  } catch (error) {
    return {
      status: "fail",
      message: error.message,
      data: {},
    };
  }
};
