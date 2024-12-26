let monsterData;
let towerData;
let stageData;

export function initData(monster, tower, stage) {
    monsterData = monster;
    towerData = tower;
    stageData = stage;
}

export function getMonsterData() {
    return monsterData;
}

export function getTowerData() {
    return towerData;
}

export function getStageData() {
    return stageData;
}