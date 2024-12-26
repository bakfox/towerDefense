// 게임 몬스터 데이터 관리 모듈

// 몬스터를 저장할 배열
const monsters = []; // 스폰된 몬스터 배열
const aliveMonsters = []; // 살아있는 몬스터 배열

/**
 * 새로운 몬스터 추가
 * @param {Monster} monster - 추가할 몬스터 객체
 */
export const addMonster = (monster) => {
  monsters.push(monster);
  aliveMonsters.push(monster); // 몬스터가 스폰될 때 alive 배열에도 추가
};

/**
 * 살아있는 몬스터 배열 반환
 * @returns {Array} 살아있는 몬스터 배열
 */
export const getAliveMonsters = () => {
  return aliveMonsters;
};

/**
 * 몬스터의 HP를 감소시키고, HP가 0 이하일 경우 alive 배열에서 제거
 * @param {string} monsterId - 몬스터의 ID
 * @param {number} damage - 감소시킬 데미지
 */
export const damageMonster = (monsterId, damage) => {
  const monster = aliveMonsters.find(m => m.id === monsterId);
  if (monster) {
    monster.hp -= damage;
    if (monster.hp <= 0) {
      removeMonster(monsterId);
    }
  }
};

/**
 * 몬스터 제거
 * @param {string} monsterId - 제거할 몬스터의 ID
 */
const removeMonster = (monsterId) => {
  const index = aliveMonsters.findIndex(m => m.id === monsterId);
  if (index !== -1) {
    aliveMonsters.splice(index, 1); // alive 배열에서 제거
  }
};

/**
 * 모든 몬스터 초기화
 */
export const clearMonsters = () => {
  monsters.length = 0; // 스폰된 몬스터 배열 초기화
  aliveMonsters.length = 0; // 살아있는 몬스터 배열 초기화
};
