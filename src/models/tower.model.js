//타워 테이블을 local 정보로 처리한다.
//타워는 각각의 사용자에 따라 하나씩 가지고 있는 식이다.

class Tower {
    constructor(id, attackSpeed, attack, upgrade, upgradeValue, price, location) {
        this.id = id;
        this.attackSpeed = attackSpeed;
        this.attack = attack;
        this.upgrade = upgrade;
        this.upgradeValue = upgradeValue;
        this.price = price;
        this.location = location;  // 타워 위치
        this.cooldown = 0;  // 타워의 초기 쿨타임
    }

    // 타워의 업그레이드 비용 계산
    getUpgradeCost() {
        return Math.floor(this.upgradeValue * this.price);
    }

    // 타워 업그레이드 메서드
    upgradeTower() {
        this.upgrade++;  // 업그레이드 레벨 증가
        this.attack += this.upgradeValue;  // 공격력 증가
        this.attackSpeed -= 0.1;  // 공격 속도 약간 증가
    }

    // 쿨타임 감소
    decreaseCooldown() {
        if (this.cooldown > 0) {
            this.cooldown--;
        }
    }

    // 타워 공격 메서드 (공격 가능 시 공격 실행)
    attackTarget(target) {
        if (this.cooldown === 0 && this.isInRange(target)) {
            target.takeDamage(this.attack);  // 타겟에 피해를 입힘
            this.cooldown = this.attackSpeed;  // 쿨타임 설정
            return true;
        }
        return false;
    }

    // 타워의 공격 범위 내에 적이 있는지 확인
    isInRange(target) {
        const distance = Math.sqrt(
            Math.pow(this.location.x - target.x, 2) + Math.pow(this.location.y - target.y, 2)
        );
        return distance <= this.range;
    }
}

export default Tower;
