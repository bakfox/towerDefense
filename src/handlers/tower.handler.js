import { getInGame, createInGame } from "../inGame.js";
import towerData from "../../gameDefaultData/tower.js";
import { getTowers, addTower, removeTower } from "../models/tower.model.js";

//특정 타워 데이터가 존재하는지 조회
const getTowerDataById = (id) => {
    return towerData.data.find((tower) => tower.id === id);
};

//시작 시 타워 3개를 가지고 시작하기 위해 랜덤한 3개의 타워 가져오기
const getRandomTowers = () => {
    const shuffled = [...towerData.data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
};

// 게임 시작 시 초기화 핸들러
export const initializeGameHandler = (uuid, socket) => {
    const initialTowers = getRandomTowers();
    const gameState = createInGame(uuid);

    gameState.gold = 500; // 초기 골드 설정(수정 예정)
    gameState.tower = [];

    // 초기 타워 데이터 추가 및 고유 Type 부여
    initialTowers.forEach((towerData, index) => {
        addTower(uuid, {
            id: index + 1, // 고유 ID (사용자 타워 배열 내 순서)
            type: index + 1, // 고유 Type 번호
            atckSpead: towerData.atckSpead,
            atck: towerData.atck,
            upgrade: 0,
            upgradeValue: towerData.upgradeValue,
            price: towerData.price,
            location: null, // 초기 위치 없음
        });
    });

    socket.emit("gameInitialize", {
        status: "success",
        message: "게임이 초기화 되었습니다.",
        data: {
            tower: getTowers(uuid),
            gold: gameState.gold,
        }
    });
};

// 타워 생성 핸들러
export const towerCreateHandler = (uuid, payload, socket) => {
    const { towerId, location } = payload;
    //const {x, y} = location; x, y를 기준으로 생성하기 때문에 필요할지 의문

    //gameState에 게임 정보 불러옴
    const gameState = getInGame(uuid);

    if (!gameState) {
        throw new CustomError("게임 상태를 찾을 수 없습니다.", "towerCreate");
    }

    //타워 타입을 기준으로 했지만 id로 변경할 예정
    const towerInfo = getTowerDataById(towerId);

    if (!towerInfo) {
        throw new CustomError("유효하지 않은 타워 타입입니다.", "towerCreate");
    }

    if (gameState.gold < towerInfo.price) {
        socket.emit("towerCreate", { status: "fail", message: "골드 부족" });
        return;
    }

    const userTowers = getTowers(uuid);
    const newTower = {
        id: userTowers.length + 1,
        type: userTowers.length + 1,
        atckSpead: towerInfo.atckSpead,
        atck: towerInfo.atck,
        upgrade: 0,
        upgradeValue: towerInfo.upgradeValue,
        price: towerInfo.price,
        location,
    };

    gameState.tower.push(newTower);
    gameState.gold -= towerInfo.price;

    socket.emit("towerCreate", {
        status: "success",
        message: "타워가 생성되었습니다.",
        data: {
            towerId: newTower.id,
            towerType: newTower.type,
            location: newTower.location
            
        }
    });
};

// 타워 이동 핸들러
export const towerMoveHandler = (uuid, payload, socket) => {
    const { towerId, currentLocation, moveLocation } = payload;
    const gameState = getInGame(uuid);

    //타워 모델에서 설정한 location의 값을 가져와서 사용할 예정
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

// 타워 판매 핸들러
export const towerSellHandler = (uuid, payload, socket) => {
    const { towerId } = payload;
    const gameState = getInGame(uuid);
    
    //인덱스 값으로 찾기
    const towerIndex = gameState.tower.findIndex((t) => t.id === towerId);
    if (towerIndex === -1) {
        throw new CustomError("타워를 찾을 수 없습니다.", "towerSell");
    }

    const tower = gameState.tower[towerIndex];
    //추후 id로 변경할 예정
    const towerInfo = getTowerDataById(tower.type);

    const refundGold =
        //이 부분은 추후 스테이지에 비례해서 골드를 늘려볼 예정
        towerInfo.price + Math.floor(towerInfo.upgradeValue * 0.5);

    gameState.gold += refundGold;
    gameState.tower.splice(towerIndex, 1);

    socket.emit("towerSell", {
        status: "success",
        towerId,
    });
};

// 타워 업그레이드 핸들러
export const towerUpgradeHandler = (uuid, payload, socket) => {
    const { towerId } = payload;
    const gameState = getInGame(uuid);

    const tower = gameState.tower.find((t) => t.id === towerId);
    if (!tower) {
        throw new CustomError("타워를 찾을 수 없습니다.", "towerUpgrade");
    }

    //id를 기준으로 사용할 예정
    const towerInfo = getTowerDataById(tower.type);
    const upgradeCost = towerInfo.upgradeValue * (tower.upgrade + 1);

    if (gameState.gold < upgradeCost) {
        socket.emit("towerUpgrade", {
            status: "fail",
            message: "골드 부족",
        });
        return;
    }

    gameState.gold -= upgradeCost;
    tower.upgrade += 1;
    tower.attackPower += towerInfo.upgradeValue;

    socket.emit("towerUpgrade", {
        status: "success",
        towerId,
        towerlevel: tower.upgrade,
    });
};

// 타워 공격 핸들러
export const towerAttackHandler = (uuid, payload, socket) => {
    const { towerId, monsterId } = payload;
    const gameState = getInGame(uuid);

    const tower = gameState.tower.find((t) => t.id === towerId);

    if (!tower) {
        throw new CustomError("타워를 찾을 수 없습니다.", "towerAttack");
    }

    socket.emit("towerAttack", {
        towerId,
        monsterId,
    });
};
