import { getInGame, createInGame } from "../inGame.js";
import towerData from "../../gameDefaultData/tower.js";
import { getTowers, addTower, removeTower } from "../models/tower.model.js";

let currentType = 1; // Type 유니크 ID 초기화

//특정 타워 데이터가 존재하는지 조회
const getTowerDataById = (id) => {
    return towerData.data.find((tower) => tower.id === id);
};

// //시작 시 타워 3개를 가지고 시작하기 위해 랜덤한 3개의 타워 가져오기
// const getRandomTowers = () => {
//     const shuffled = [...towerData.data].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, 3);
// };

// // 게임 시작 시 초기화 핸들러
// export const initializeGameHandler = (uuid, socket) => {
//     currentType = 1;
//     const initialTowers = getRandomTowers();
//     const gameState = createInGame(uuid);

//     gameState.gold = 500; // 초기 골드 설정(수정 예정)
//     gameState.tower = [];

//     // 초기 타워 데이터 추가 및 고유 Type 부여
//     initialTowers.forEach((towerData, index) => {
//         addTower(uuid, {
//             id: index + 1, // 고유 ID (사용자 타워 배열 내 순서)
//             type: currentType++, // 고유 Type 번호
//             atckSpead: towerData.atckSpead,
//             atck: towerData.atck,
//             upgrade: 0,
//             upgradeValue: towerData.upgradeValue,
//             price: towerData.price,
//             location: null, // 초기 위치 없음
//         });
//     });

//     socket.emit("gameInitialize", {
//         status: "success",
//         message: "게임이 초기화 되었습니다.",
//         data: {
//             tower: getTowers(uuid),
//             gold: gameState.gold,
//         }
//     });
// };

// 타워 생성 핸들러
export const towerCreateHandler = (uuid, payload, socket) => {
    const { towerId, location } = payload;
    //const {x, y} = location; x, y를 기준으로 생성하기 때문에 필요할지 의문

    //gameState에 게임 정보 불러옴
    const gameState = getInGame(uuid);

    if (!gameState) {
        throw new Error("게임 상태를 찾을 수 없습니다.", "towerCreate");
    }

    //타워 타입을 기준으로 했지만 id로 변경
    const towerInfo = getTowerDataById(towerId);

    if (!towerInfo) {
        throw new Error("유효하지 않은 타워 타입입니다.", "towerCreate");
    }

    if (gameState.gold < towerInfo.price) {
        socket.emit("towerCreate", { status: "fail", message: "골드 부족" });
        return;
    }

    const userTowers = getTowers(uuid);
    // createTowerTemplate을 사용하여 타워 생성
    const newTower = createTowerTemplate(
        userTowers.id,  // 타워의 종류
        currentType++,  // 고유 Type 번호
        towerInfo.atckSpead,    // 공격 속도
        towerInfo.atck,         // 공격력
        0,                      // 업그레이드 초기화
        towerInfo.upgradeValue, // 업그레이드 값
        towerInfo.price         // 가격
    );
    newTower.location = location; // 위치는 별도로 설정

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
    const { towerId, currentLocation, moveLocation } = payload.data;
    const towers = getTowers(uuid);
    //타워 모델에서 설정한 location의 값을 가져와서 사용할 예정
    const tower = towers.find(
        (t) => t.type === towerId && t.location === currentLocation
    );

    if (!tower) {
        throw new Error("타워를 찾을 수 없거나 위치가 잘못되었습니다.", "towerMove");
    }

    tower.location = moveLocation;

    socket.emit("towerMove", {
        status: "success",
        message: "타워가 이동하였습니다",
        data: {
            towerId,
            moveLocation,
        }
    });
};

// 타워 판매 핸들러
export const towerSellHandler = (uuid, payload, socket) => {
    const { towerId } = payload;
    const gameState = getInGame(uuid);
    const towers = getTowers(uuid);
    
    //인덱스 값으로 찾기
    const towerIndex = towers.findIndex((t) => t.type === towerId);
    if (towerIndex === -1) {
        throw new Error("타워를 찾을 수 없습니다.", "towerSell");
    }

    const tower = removeTower(uuid, towerId)
    const towerInfo = getTowerDataById(tower.id);

    const refundGold = towerInfo.price + Math.floor(towerInfo.upgradeValue * 0.5);
    gameState.gold += refundGold;

    socket.emit("towerSell", {
        status: "success",
        towerId,
    });
};

// 타워 업그레이드 핸들러
export const towerUpgradeHandler = (uuid, payload, socket) => {
    const { towerId } = payload;
    const gameState = getInGame(uuid);
    const towers = getTowers(uuid);

    const tower = towers.find((t) => t.type === towerId);
    if (!tower) {
        throw new Error("타워를 찾을 수 없습니다.", "towerUpgrade");
    }

    //id를 기준으로 사용할 예정
    const towerInfo = getTowerDataById(tower.id);
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
    // tower.attackPower += towerInfo.upgradeValue; 추후 성능 업그레이드 설정

    socket.emit("towerUpgrade", {
        status: "success",
        towerId,
        towerlevel: tower.upgrade,  
    });
};

// 타워 공격 핸들러
export const towerAttackHandler = (towers, monsters, socket) => {
    class Tower {
        constructor(id, location, range, attack, attackSpeed) {
            this.id = id;
            this.location = location;
            this.range = range;
            this.attack = attack;
            this.attackSpeed = attackSpeed;
            this.cooltime = attackSpeed; // 초기 쿨타임 설정, 아래서 값을 줘도 되고 추후 바꿀 예정
        }

        // 쿨타임 감소 및 공격 처리
        decreaseCooltime(monsters) {
            if (this.cooltime > 0) {
                this.cooltime--; // 쿨타임 감소
            } else {
                this.towerAttack(monsters); // 공격 수행
                this.cooltime = this.attackSpeed; // 쿨타임 초기화
            }
        }
    }
    towers.forEach(tower => {
        tower.decreaseCooltime(monsters);
    });
}
