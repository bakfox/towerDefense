let monsterData;
let towerData;

export function initMonsterData(monster) {
  monsterData = monster;
}

export function initTowerData(tower) {
  towerData = tower;
}

export function getMonsterData(id) {
  console.log(id);
  const monster = monsterData.find((item) => item.id === id);
  console.log(monster);
  return monster;
}

export function getTowerData(id) {
  const tower = towerData.data.find((item) => item.id === id);
  return tower;
}
