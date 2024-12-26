export class Tower {
  constructor(x, y, towerData) {
    this.x = x;
    this.y = y;
    this.width = 78;
    this.height = 150;
    this.id = towerData.id;
    this.attackPower = towerData.atck;
    this.attackSpeed = towerData.atckSpead;
    this.upgrade = towerData.upgrade;
    this.upgradeValue = towerData.upgradeValue;
    this.price = towerData.price;
    this.range = 300;
    this.cooldown = 0;
    this.beamDuration = 0;
    this.target = null;
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
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower;
      this.cooldown = 180; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = 30; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }

  static checkCollision(x, y, existingTowers) {
    return existingTowers.some(tower => 
      Math.abs(tower.x - x) < 50 && Math.abs(tower.y - y) < 50
    );
  }

  static canCreate(x, y, towerType, userGold, existingTowers) {
    // 위치 충돌 검사
    if (this.checkCollision(x, y, existingTowers)) {
      return {
        canBuild: false,
        message: "이미 타워가 존재하는 위치입니다"
      };
    }

    // 골드 확인
    if (userGold < towerType.price) {
      return {
        canBuild: false,
        message: "골드가 부족합니다"
      };
    }

    return {
      canBuild: true,
      message: "타워를 설치할 수 있습니다"
    };
  }
}
