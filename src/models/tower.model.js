// models/tower.js

import towerData from "../../gameDefaultData/tower.js";

// 타워 생성 시마다 증가하는 유니크 ID 관리 변수
let towerIdCounter = 1; // 최초 타워 ID는 1부터 시작

export class Tower {
  constructor(towerType, location) {
    const tower = towerData.data.find((t) => t.id === towerType);

    if (!tower) {
      throw new Error("타워 정보를 찾을 수 없습니다.");
    }

    // 고유 ID를 순차적으로 증가시키는 방식으로 설정
    this.towerId = towerIdCounter++; // 유니크 ID는 순차적으로 증가 //현재는 유니크 아이디로 적음, 추후 type이나 다른 걸로 수정
    this.towerType = tower.id; // 타워 종류 (ID)
    this.atckSpeed = tower.atckSpead;
    this.atck = tower.atck;
    this.range = tower.range;
    this.upgrade = tower.upgrade;
    this.upgradeValue = tower.upgradeValue;
    this.price = tower.price;
    this.location = location; // {x, y} 위치 정보
    this.cooldown = this.atckSpeed; // 타워의 초기 쿨타임
  }
  attack(monster, socket, ingame) {
    monster.hitByTower(socket, ingame, this.atck);
    socket.emit(101, {
      status: "success",
      message: `타워 ${this.uniqueId}가 몬스터 ${monster.uniqueId}를 공격했습니다.`,
      data: {
        towerId: this.towerId,
        monsterId: monster.uniqueId,
      },
    });
  }
  //몬스터 피격 호출

  // 쿨타임 감소 함수
  decreaseCooldown(socket, ingame) {
    this.cooldown--;
    console.log("cooldown", this.cooldown);
    if (this.cooldown <= 0) {
      ingame.monster.forEach((monster) => {
        const distance = Math.sqrt(
          Math.pow(this.location.x - monster.x, 2) +
            Math.pow(this.location.y - monster.y, 2)
        );

        console.log("distance", distance, this.location, monster.x, monster.y);

        if (distance < this.range) {
          console.log("in range");
          this.attack(monster, socket, ingame); // 타워 공격
          this.cooldown = this.atckSpeed; // 쿨타임 초기화
        }
      });
    }
  }

  // 타워 업그레이드 함수
  upgradeTower() {
    this.atck += this.upgradeValue;
    this.upgrade++;
    this.cooldown = this.atckSpeed; // 업그레이드 후 쿨타임 초기화
    console.log(`타워 ${this.towerId}가 업그레이드되었습니다.`);
  }

  // 타워 이동 메서드
  moveTower(newLocation) {
    if (
      !newLocation ||
      typeof newLocation.x !== "number" ||
      typeof newLocation.y !== "number"
    ) {
      throw new Error("타워 이동 위치 정보가 유효하지 않습니다.");
    }
    this.location = newLocation;
    console.log(
      `타워 ${this.uniqueId}가 위치를 ${JSON.stringify(newLocation)}로 이동했습니다.`
    );
  }
}

// 타워 객체 생성 함수 (타워 ID와 위치를 받아서 타워 객체 생성)
export const createTowerFromData = (towerId, location) => {
  return new Tower(towerId, location);
};
