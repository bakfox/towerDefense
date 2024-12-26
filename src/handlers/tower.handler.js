import { getInGame, createInGame } from "../inGame.js";
import towerData from "../../gameDefaultData/tower.js";
import CustomError from "../utils/errors/classes/custom.error.js";

//특정 타워 데이터가 존재하는지 조회
const getTowerDataById = (id) => {
    return towerData.data.find((tower) => tower.id === id);
};

//시작 시 타워 3개를 가지고 시작하기 위해 랜덤한 3개의 타워 타입 가져오기
const getRandomTowers = () => {
    const shuffled = [...towerData.data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
};

// 게임 시작 시 랜덤한 타워 초기화
export const initializeGameHandler = (uuid, socket) => {
    const initialTowers = getRandomTowers();
    const gameState = createInGame(uuid);

    gameState.gold = 500; // 초기 골드 설정(수정 예정)
    gameState.tower = initialTowers;

    socket.emit("gameInitialize", {
        status: "success",
        tower: initialTowers,
        gold: gameState.gold,
    });
};

// 타워 생성 핸들러
export const towerCreateHandler = (uuid, payload, socket) => {
    const { towerType, location } = payload;
    //const {x, y} = location;
    const gameState = getInGame(uuid);

    if (!gameState) {
        throw new CustomError("게임 상태를 찾을 수 없습니다.", "towerCreate");
    }

    const towerInfo = getTowerDataById(towerType);

    if (!towerInfo) {
        throw new CustomError("유효하지 않은 타워 타입입니다.", "towerCreate");
    }

    if (gameState.gold < towerInfo.price) {
        socket.emit("towerCreate", { status: "fail", message: "골드 부족" });
        return;
    }

    const newTower = {
        id: gameState.tower.length + 1,
        type: towerType,
        location,
        level: 1,
        attackPower: towerInfo.atck,
        attackSpeed: towerInfo.atckSpead,
    };

    gameState.tower.push(newTower);
    gameState.gold -= towerInfo.price;

    socket.emit("towerCreate", {
        status: "success",
        towerType,
        towerId: newTower.id,
        location,
    });
};

// 타워 이동 핸들러
export const towerMoveHandler = (uuid, payload, socket) => {
    const { towerId, currentLocation, moveLocation } = payload;
    const gameState = getInGame(uuid);

    const tower = gameState.tower.find(
        (t) => t.id === towerId && t.location === currentLocation
    );

    if (!tower) {
        throw new CustomError("타워를 찾을 수 없거나 위치가 잘못되었습니다.", "towerMove");
    }

    tower.location = moveLocation;

    socket.emit("towerMove", {
        status: "success",
        towerId,
        moveLocation,
    });
};
