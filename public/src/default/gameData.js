let monsterData;
let towerData;

export function initData(monster, tower) {
  monsterData = monster;
  towerData = tower;
}

export function getMonsterData(id) {
  const monster = getMonsterData.find((item) => item.id === id);

  return monster;
}

export function getTowerData() {
  return towerData;
}
