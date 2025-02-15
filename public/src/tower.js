import { getTowerData } from "./default/gameData.js";
import { Button } from "./button.js";

export class Tower {
  constructor(x, y, id, type, width = null, height = null, image, onClick) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.id = id;
    this.level = 1;
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = width; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = height; // 타워 이미지 세로 길이
    this.range = 300; // 타워 사거리
    this.cooldown = 0; // 타워 공격 쿨타임
    this.beamDurations = []; // 타워 광선 지속 시간
    this.btn = new Button(
      "tower",
      id,
      x - this.width / 2,
      y - this.height / 2,
      width,
      height,
      image,
      onClick
    );
    this.init(type);
  }

  init(type) {
    const item = getTowerData(type);

    this.upgradeValue = item.upgradeValue; // 타워 업그레이드 정도도
    this.atckSpeed = item.atckSpead; // 타워 공격 속도
    this.atck = item.atck; // 타워 공격력
    this.cost = item.price; // 타워 구입 비용
  }

  move(location) {
    this.x = location.x;
    this.y = location.y;
    this.btn.move(this.x, this.y);
  }

  upgrade() {
    this.atck += this.upgradeValue;
    this.level += 1;
  }

  draw(ctx) {
    this.btn.draw(ctx);

    this.beamDurations.forEach((item, idx) => {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(item.monster.x, item.monster.y);
      ctx.strokeStyle = "skyblue";
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.closePath();
      item.duration--;

      if(item.duration <=0) {
        this.beamDurations.splice(idx, 1);
      }
    });
  }

  attack(monster) {
    this.beamDurations.push({monster, duration : 20}); // 광선 지속 시간 (0.5초)
  }

  popTarget(monsterId) {
    this.target.delete(monsterId);
  }
}
