//타워 테이블을 local 정보로 처리한다.
//타워는 각각의 사용자에 따라 하나씩 가지고 있는 식이다.

const towers = {}; // 사용자별 타워 데이터 저장

// 타워 기본 구조 생성
const createTowerTemplate = (id, type, atckSpead, atck, upgrade, upgradeValue, price) => ({
    id, 
    type,
    atckSpead,
    atck,
    upgrade,
    upgradeValue,
    price
});

// 사용자 타워 리스트 초기화
export const initializeTowers = (uuid) => {
    towers[uuid] = [];
};

// 특정 사용자의 타워 리스트 가져오기
export const getTowers = (uuid) => {
    return towers[uuid] || [];
};

// 특정 타워 가져오기
export const getTowerById = (uuid, towerId) => {
    const userTowers = towers[uuid] || [];
    return userTowers.find((tower) => tower.id === towerId);
};

// 타워 추가
export const addTower = (uuid, tower) => {
    if (!towers[uuid]) {
        towers[uuid] = [];
    }
    towers[uuid].push(tower);
};

// 타워 삭제
export const removeTower = (uuid, towerId) => {
    const userTowers = towers[uuid];
    if (!userTowers) throw new Error("타워 데이터를 찾을 수 없습니다.");

    const index = userTowers.findIndex((tower) => tower.id === towerId);
    if (index === -1) throw new Error("타워를 찾을 수 없습니다.");

    return userTowers.splice(index, 1)[0]; // 삭제된 타워 반환
};

// 타워 데이터 리셋
export const resetTowers = (uuid) => {
    towers[uuid] = [];
};

export default createTowerTemplate