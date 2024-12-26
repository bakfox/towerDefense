import { Monster } from "../src/monster.js";
import monsterData from "../../gameDefaultData/monster.js";
import { getInGame } from "../models/inGame.js";

let nowMonsterData = []; // 스폰할 몬스터를 데이터 저장할 배열
let nowStageData = []; // 스폰할 스테이지 데이터

const stageChange = (inGame) => {
  nowMonsterData = [];
  nowStageData = stageData.data[inGame.stage];
  for (let index = 0; index < nowStageData.length; index++) {
    nowMonsterData.push(monsterData.data[nowStageData[index].id]);
  }
};

let monsterData = monsterData;
export const spawnMonster = (path, monsterImages, id, monsterData) => {
  const monster = new Monster(path, monsterImages, id, monsterData);
  monsters.push(monster);
  return monster;
};

export const moveMonsters = (base) => {
  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDestroyed) {
        alert("게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ");
        location.reload();
      }
    } else {
      monsters.splice(i, 1); // 몬스터가 죽으면 배열에서 제거
    }
  }
};

//몬스터 생성

//몬스터 이동

//몬스터 공격

//몬스터 사망

export const drawMonsters = (ctx) => {
  for (const monster of monsters) {
    monster.draw(ctx);
  }
};

export const getMonsters = () => {
  return monsters;
};
