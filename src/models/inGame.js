const ingame = {};
const defaultIngame = {
  userId: 0,
  gold: 0,
  score: 0,
  house: {
    hp: 5,
    x: 0,
    y: 0,
  },
  stage: 0,
  monster: [], //인게임에 스폰된 몬스터들
  tower: [],
  ownTower: [],
  nowMonsterData: [], // 스폰할 몬스터를 저장할 데이터 풀
  nowStageData: [], // 스폰할 스테이지 데이터
  isSpawn: true,
  isRunning: true,
  monsterCoolTime: 1,
};

export const createInGame = (uuid) => {
  return (ingame[uuid] = defaultIngame);
};

export const getInGame = (uuid) => {
  return ingame[uuid];
};

export const deleteInGame = (uuid) => {
  if (ingame[uuid]) {
    delete ingame[uuid];
  }
};
