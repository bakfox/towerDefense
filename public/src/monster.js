import { getMonsterData } from "./default/gameData.js";

export class Monster {
  constructor(path, monsterImages, type, id, stage) {
    // 생성자 안에서 몬스터의 속성을 정의한다고 생각하시면 됩니다!
    this.id = id; // 몬스터 고유번호
    this.type = type; // 몬스터 종류
    this.path = path;
    this.currentIndex = 0; // 현재 위치 인덱스
    this.x = path[0].x;
    this.y = path[0].y;
    this.width = 80; // 몬스터 이미지 가로 길이
    this.height = 80; // 몬스터 이미지 세로 길이
    this.image = monsterImages.get(this.type); // 몬스터 이미지
    this.init(type, stage);
  }

  init(type, stage) {
    const item = getMonsterData(type);
    const amount = Math.floor((stage - 1) * item.upgradeValue);

    this.atck = item.atck + amount; // 공격력
    this.maxHp = item.hp + amount; // 체력
    this.hp = this.maxHp;
    this.speed = item.speed / 60; // 이동 속도
    this.reword = item.reword + amount; // 잡으면 얻는 보상
  }

  move() {
    if (this.currentIndex < this.path.length - 1) {
      const nextPoint = this.path[this.currentIndex + 1];
      const deltaX = nextPoint.x - this.x;
      const deltaY = nextPoint.y - this.y;
      // 2차원 좌표계에서 두 점 사이의 거리를 구할 땐 피타고라스 정리를 활용하면 됩니다! a^2 = b^2 + c^2니까 루트를 씌워주면 되죠!
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < this.speed) {
        // 거리가 속도보다 작으면 다음 지점으로 이동시켜주면 됩니다!
        // console.log(this.path);
        this.currentIndex++;
      } else {
        // 거리가 속도보다 크면 일정한 비율로 이동하면 됩니다. 이 때, 단위 벡터와 속도를 곱해줘야 해요!
        this.x += (deltaX / distance) * this.speed; // 단위 벡터: deltaX / distance
        this.y += (deltaY / distance) * this.speed; // 단위 벡터: deltaY / distance
      }
      // if (this.id === 1) {
      //   console.log(this.x, this.y);
      // }
    }
  }
  setLocation(x, y, currentIndex, monster) {
    // if (this.id === 1) {
    //   console.log(this.x, this.y, x);
    // }
    this.x = x;
    this.y = y;
    this.currentIndex = currentIndex;
    monster.move();
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x - this.width /2, this.y - this.height /2, this.width, this.height);
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`${this.hp}/${this.maxHp}`, this.x, this.y);
  }

  takeDamage(value) {
    this.hp -= value;
    if(this.hp <0) this.hp = 0;
  }
}
