//import { getTowerData } from "./default/gameData";

export class Tower {
  constructor(x, y, id, type) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.id = id;
    this.level = 1;
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이
    this.range = 300; // 타워 사거리
    this.cooldown = 0; // 타워 공격 쿨타임
    this.beamDuration = 0; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표

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
  }

  upgrade() {
    this.atck += this.upgradeValue;
    this.atckSpeed += this.upgradeValue;
    this.level += 1;
  }

  draw(ctx, towerImage) {
    ctx.drawImage(towerImage, this.x, this.y, this.width, this.height);
    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(
        this.target.x + this.target.width / 2,
        this.target.y + this.target.height / 2
      );
      ctx.strokeStyle = "skyblue";
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
  }

  attack(monster) {
    this.beamDuration = 30; // 광선 지속 시간 (0.5초)
    this.target = monster; // 광선의 목표 설정
  }
}
