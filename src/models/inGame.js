const ingame = {};
class defaultIngame {
  constructor() {
    (this.userId = 0),
      (this.gold = 5000),
      (this.score = 0),
      (this.house = {
        hp: 5,
        x: 0,
        y: 0,
      }),
      (this.stage = 0),
      (this.monster = []), //인게임에 스폰된 몬스터들
      (this.tower = []),
      (this.ownTower = []),
      (this.nowMonsterData = []), // 스폰할 몬스터를 저장할 데이터 풀
      (this.nowStageData = []), // 스폰할 스테이지 데이터
      (this.MonsterCoordinate = {}),
      (this.isSpawn = true),
      (this.isRunning = true),
      (this.monsterCoolTime = 5);
  }
}

export const createInGame = (uuid) => {
  return (ingame[uuid] = new defaultIngame());
};

export const getInGame = (uuid) => {
  return ingame[uuid];
};

export const deleteInGame = (uuid) => {
  if (ingame[uuid]) {
    delete ingame[uuid];
  }
};
