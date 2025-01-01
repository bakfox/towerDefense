// import { Monster } from "../src/monster.js";
import { getInGame } from "../models/inGame.js";
import monsterData from "../../gameDefaultData/monster.js";
import {
  gameGoldChange,
  gameHouseChange,
  gameScoreChange,
} from "./stageHandler.js";

let uniqueId = 1; //몬스터 고유번호

export class Monster {
  constructor(path, id, uniqueId) {
    // 생성자 안에서 몬스터의 속성을 정의한다고 생각하시면 됩니다!
    if (!path || path.length <= 0) {
      throw new Error("몬스터가 이동할 경로가 필요합니다.");
    }

    // id를 기반으로 monsterData에서 해당 몬스터 데이터를 찾음
    const selectedMonsterData = monsterData.data.find(
      (monster) => monster.id === id
    );
    if (!selectedMonsterData) {
      throw new Error(`id가 ${id}인 몬스터 데이터를 찾을 수 없습니다.`);
    }

    //this.monsterNumber = Math.floor(Math.random() * monsterImages.length); // 몬스터 번호 (1 ~ 5. 몬스터를 추가해도 숫자가 자동으로 매겨집니다!)
    this.id = id; // 몬스터 아이디(종류)
    this.uniqueId = uniqueId; //몬스터 고유번호
    this.path = path; // 몬스터가 이동할 경로
    this.currentIndex = 0; // 몬스터가 이동 중인 경로의 인덱스
    this.x = path[0].x; // 몬스터의 x 좌표 (최초 위치는 경로의 첫 번째 지점)
    this.y = path[0].y; // 몬스터의 y 좌표 (최초 위치는 경로의 첫 번째 지점)
    this.speed = selectedMonsterData.speed; // id 기반의 몬스터 이동 속도
    this.attackPower = selectedMonsterData.atck; // id 기반의 몬스터 공격력
    this.maxHp = selectedMonsterData.hp; // id 기반의 몬스터 최대 HP
    this.hp = this.maxHp; // 몬스터의 현재 HP
    this.reward = selectedMonsterData.reward;
    this.isDead = false;
  }

  move(socket, ingame, uuid) {
    if (!this.isDead) {
      if (this.currentIndex < this.path.length - 1) {
        const nextPoint = this.path[this.currentIndex + 1];
        const deltaX = nextPoint.x - this.x;
        const deltaY = nextPoint.y - this.y;
        // 2차원 좌표계에서 두 점 사이의 거리를 구할 땐 피타고라스 정리를 활용하면 됩니다! a^2 = b^2 + c^2니까 루트를 씌워주면 되죠!
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < this.speed) {
          // 거리가 속도보다 작으면 다음 지점으로 이동시켜주면 됩니다!
          this.currentIndex++;
        } else {
          // 거리가 속도보다 크면 일정한 비율로 이동하면 됩니다. 이 때, 단위 벡터와 속도를 곱해줘야 해요!
          this.x += (deltaX / distance) * this.speed; // 단위 벡터: deltaX / distance
          this.y += (deltaY / distance) * this.speed; // 단위 벡터: deltaY / distance
        }
      } else {
        this.attack(socket, ingame, uuid); // 기지에 도달하면 기지에 데미지를 입힙니다!
        this.hp = 0; // 몬스터는 이제 기지를 공격했으므로 자연스럽게 소멸해야 합니다.
        this.isDead = true;
      }
      ingame.MonsterCoordinate[this.uniqueId] = {
        id: this.uniqueId,
        x: this.x,
        y: this.y,
        currentIndex: this.currentIndex,
      };
    }
  }
  //클래스내 메소드
  //hit(피격) 함수 데미지랑 소켓을 보내줌 받아서 데미지 처리  받은 몬스터와 hp반환
  //attack
  //move
  hitByTower(socket, ingame, damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.dead(socket, ingame, damage);
      return;
    }
  }
  //몬스터가 베이스에 닿았을때 gameHouseChange
  attack(socket, ingame, uuid) {
    gameHouseChange(socket, ingame, this.attackPower, uuid);
    this.dead(socket, ingame);
  }
  dead(socket, ingame) {
    gameGoldChange(socket, ingame, this.reward * ingame.stage);
    gameScoreChange(socket, ingame, (this.reward * ingame.stage) / 2);
    this.isDead = true;
    delete ingame.MonsterCoordinate[this.uniqueId];
    socket.emit("event", {
      handlerId: 204,
      status: "success",
      message: `${this.id}번 몬스터가 사망`,
      data: {
        uniqueId: this.uniqueId,
      },
    });
  }
}

// let monsterData = monsterData;

//인게임정보 받아오기
//path받아오기

//몬스터 생성 nowStageData여기에 적힌 스폰량만큼 nowMonsterData에 객체 갯수만큼 넣기 넣을때 각 객체에 고유번호 부여
const makeMonster = (path, id, uniqueId) => {
  return new Monster(path, id, uniqueId);
  //nowMonsterData.push(monster);
};

//인게임정보를 인수로 입력하면 인게임정보의 스테이지 기반으로 스폰해야할 몬스터배열 반환
export const spawnMonsters = (ingame, path, nowStageData) => {
  ingame.nowMonsterData = [];
  ingame.nowStageData = nowStageData; //[{ stageId: 1, id: 1, count: 10 }]
  for (let index = 0; index < ingame.nowStageData.length; index++) {
    let monsterType = ingame.nowStageData[index].id;
    for (let i = 0; i < ingame.nowStageData[index].count; i++) {
      const monster = makeMonster(path, monsterType, uniqueId);
      ingame.nowMonsterData.push(monster);
      uniqueId++;
    }
  }

  // 몬스터의 id와 uniqueId만 추출
  // const monsterIdsAndUniqueIds = nowMonsterData.map(monster => ({
  //   id: monster.id,
  //   uniqueId: monster.uniqueId
  // }));

  // // 클라이언트에 몬스터 ID와 uniqueId 전송
  // socket.emit('spawnedMonsters', monsterIdsAndUniqueIds);

  return ingame.nowMonsterData;
};
export const moveClient = (socket, ingame) => {
  console.log(ingame.MonsterCoordinate);
  socket.emit("event", {
    handlerId: 202,
    status: "success",
    message: `$몬스터 이동`,
    data: {
      monsters: ingame.MonsterCoordinate,
    },
  });
};

export const spawnNextMonster = (socket, ingame) => {
  if (ingame.monsterCoolTime > 0) ingame.monsterCoolTime--;

  if (ingame.isSpawn !== true) {
    return;
  }
  if (ingame.monsterCoolTime === 0) {
    const monster = ingame.nowMonsterData.shift(); // 배열에서 첫 번째 몬스터 꺼내기
    // 몬스터를 게임에 추가하는 로직
    console.log(`몬스터 스폰: ${monster.id}`);
    //스폰하면서 ingame monster배열에 넣어주기
    ingame.monster.push(monster);
    // 클라이언트에 몬스터 ID와 uniqueId 전송
    socket.emit("event", {
      handlerId: 201,
      status: "success",
      message: `${monster.id}번 몬스터 스폰 성공`,
      data: {
        id: monster.id,
        uniqueId: monster.uniqueId,
      },
    });
    if (ingame.nowMonsterData.length === 0) {
      ingame.isSpawn = false;
    }
    ingame.monsterCoolTime = 1;
  }
};

export const getMonsters = () => {
  return ingame.nowMonsterData;
};
