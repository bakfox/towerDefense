let monsterData;
let towerData;
let stageData;

export function initData(monster, tower, stage) {
  monsterData = monster;
  towerData = tower;
  stageData = stage;
}

export function getMonsterData(id) {
  const monster = getMonsterData.find((item) => item.id === id);

  return monster;
}

export function getTowerData() {
  return towerData;
}

export function getStageData() {
  return stageData;
}
