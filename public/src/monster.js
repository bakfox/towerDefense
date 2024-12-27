import { getMonsterData } from "./default/gameData.js";

export class Monster {
  constructor(path, monsterImages, type, id, stage) {
    // 생성자 안에서 몬스터의 속성을 정의한다고 생각하시면 됩니다!
    this.id = id; // 몬스터 고유번호
    this.type = type; // 몬스터 종류
    this.x = path[0].x;
    this.y = path[0].y;
    this.width = 80; // 몬스터 이미지 가로 길이
    this.height = 80; // 몬스터 이미지 세로 길이
    this.speed = speed; // 몬스터의 이동 속도
    this.image = monsterImages[this.type]; // 몬스터 이미지

    this.init(type, stage);
  }

  init(type, stage) {
    const item = getMonsterData(type);

    const amount = (stage - 1) * item.upgradeValue;

    this.atck = item.atck + amount; // 공격력
    this.hp = item.hp + amount; // 체력
    this.reword = item.reword + amount; // 잡으면 얻는 보상
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`${this.hp}/${this.maxHp}`, this.x, this.y - 5);
  }
}
