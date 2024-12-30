import { Monster } from "../src/monster.js";
import monsterData from "../../gameDefaultData/monster.js";
import { getInGame } from "../models/inGame.js";
import stageData from "../../gameDefaultData/stage.js";
import { gameGoldChange, gameHouseChange } from "./stage.handler.js";

let nowMonsterData = []; // 스폰할 몬스터를 데이터 저장할 배열 고유아이디 부여해서 넣을것 1234567...
let nowStageData = []; // 스폰할 스테이지 데이터
let uniqueId = 0; //몬스터 고유번호

export class Monster {
  constructor(path, id, monsterData, uniqueId) {
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
    this.speed = selectedMonsterData.spead; // id 기반의 몬스터 이동 속도
    this.attackPower = selectedMonsterData.atck; // id 기반의 몬스터 공격력
    this.maxHp = selectedMonsterData.hp; // id 기반의 몬스터 최대 HP
    this.hp = this.maxHp; // 몬스터의 현재 HP
    this.reward = selectedMonsterData.reward;
    this.isDead = false;
  }

  move(base) {
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
      return false;
    } else {
      const isDestroyed = base.takeDamage(this.attackPower); // 기지에 도달하면 기지에 데미지를 입힙니다!
      this.hp = 0; // 몬스터는 이제 기지를 공격했으므로 자연스럽게 소멸해야 합니다.
      return isDestroyed;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(
      `(레벨 ${this.id}) ${this.hp}/${this.maxHp}`,
      this.x,
      this.y - 5
    );
  }
}

let monsterData = monsterData;

//인게임정보 받아오기
//path받아오기

//몬스터 생성 nowStageData여기에 적힌 스폰량만큼 nowMonsterData에 객체 갯수만큼 넣기 넣을때 각 객체에 고유번호 부여
const makeMonster = (path, monsterImages, id, monsterData, uniqueId) => {
  return new Monster(path, monsterImages, id, monsterData, uniqueId);
  //nowMonsterData.push(monster);
};

//인게임정보를 인수로 입력하면 인게임정보의 스테이지 기반으로 스폰해야할 몬스터배열 반환
export const spawnMonsters = (
  inGame,
  path,
  monsterImages,
  monsterData,
  stageData
) => {
  nowMonsterData = [];
  nowStageData = stageData.data[inGame.stage]; //[{ stageId: 1, id: 1, count: 10 }]
  for (let index = 0; index < nowStageData.length; index++) {
    let monsterType = nowStageData[index].id;
    for (let i = 0; i < nowStageData[index].count; i++) {
      const monster = makeMonster(
        path,
        monsterImages,
        monsterType,
        monsterData,
        uniqueId
      );
      nowMonsterData.push(monster);
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

  return nowMonsterData;
};
const spawnNextMonster = (ingame, socket) => {
  const ingame = getInGame(ingame.uuid);

  if (ingame.isSpawn === true) {
    if (monsterCoolTime === 0) {
      if (nowMonsterData.length > 0) {
        const monster = nowMonsterData.shift(); // 배열에서 첫 번째 몬스터 꺼내기
        // 몬스터를 게임에 추가하는 로직 
        console.log(`몬스터 스폰: ${monster.id}`);
        //스폰하면서 ingame monster배열에 넣어주기
        ingame.monster.push(monster);

        // 클라이언트에 몬스터 ID와 uniqueId 전송
        socket.emit("spawnedMonster", {
          status: "success",
          message: `${monster.id}번 몬스터 스폰 성공`,
          data:{
            id: monster.id,
            uniqueId: monster.uniqueId,
          },
        });
        monsterCoolTime = 10;
      } else {
        // 모든 몬스터가 스폰되었으면 isSpawn을 false로 변경
        ingame.isSpawn = false;
      }
    }else monsterCoolTime--;
  } 
};

//몬스터 공격 base랑 좌표가 같으면(충돌) gameHouseChange 호출해서 hp변경 / 몬스터 isdead true/자본변경
const monsterDead = (ingame, socket,uniqueId) => {
  const monster = nowMonsterData.find((m) => m.uniqueId === uniqueId);

  socket.on("MonsterDead", (payload) => {
    const { uniqueId } = payload;
    // Handle the monster death logic here
  });

  if (monster && monster.hp <= 0) {
    // 몬스터 사망시
    monster.isDead = true;
    //리워드 지급
    let ingame = getInGame(ingame.uuid);
    gameGoldChange({ uuid: ingame.uuid, parsedData: { gold: monster.reward } });
    //사망한 몬스터 id와 uniqueId 클라에 통보
    socket.emit("DeadMonster", {
      status: "success",
      message: `${monster.id}번 몬스터 사망`,
      data:{
        id: monster.id,
        uniqueId: monster.uniqueId,
      },
    });
  }else if (
    monster &&
    monster.x === base.x &&
    monster.y === base.y &&
    !monster.isDead
  ) {
    // Call gameHouseChange or other logic here
    gameHouseChange({ uuid: ingame.uuid, parsedData: { damage: monster.attackPower } });
    monster.isDead = true;
    socket.emit("MonsterAttack", {
      status: "success",
      message: `${monster.id}번 몬스터의 공격`,
      data:{
        id: monster.id,
        uniqueId: monster.uniqueId,
      },
    });
    
  }

  
};

export const getMonsters = () => {
  return nowMonsterData;
};

export const drawMonsters = (ctx) => {
  for (const monster of nowMonsterData) {
    monster.draw(ctx);
  }
};

//=====================================================================================================================

export const moveMonsters = (base) => {
  for (let i = nowMonsterData.length - 1; i >= 0; i--) {
    const monster = nowMonsterData[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDestroyed) {
        alert("게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ");
        location.reload();
      }
    } else {
      nowMonsterData.splice(i, 1); // 몬스터가 죽으면 배열에서 제거
    }
  }
};

//몬스터 이동 상우님이 알아봐주신다고 함
