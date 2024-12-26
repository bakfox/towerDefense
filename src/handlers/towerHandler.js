import towerData from '../../gameDefaultData/tower.js';

export function handleTowerCreate(request, response) {
  const { towerType, location } = request;
  const { gameState } = response;

  // 1. towerType 유효성 검증
  const selectedTower = towerData.data.find(tower => tower.id === towerType);
  if (!selectedTower) {
    return {
      status: 'error',
      message: '유효하지 않은 타워 타입입니다'
    };
  }

  // 2. 위치 충돌 검사
  const isLocationOccupied = gameState.towers.some(tower => 
    tower.x === location.x && tower.y === location.y
  );
  if (isLocationOccupied) {
    return {
      status: 'error',
      message: '이미 타워가 존재하는 위치입니다'
    };
  }

  // 3. 골드 확인
  if (gameState.gold < selectedTower.price) {
    return {
      status: 'error',
      message: '골드가 부족합니다'
    };
  }

  // 타워 생성 처리
  const towerId = Date.now().toString();
  const newTower = {
    id: towerId,
    type: towerType,
    level: 1,
    x: location.x,
    y: location.y,
    ...selectedTower
  };

  // 게임 상태 업데이트
  gameState.towers.push(newTower);
  gameState.gold -= selectedTower.price;

  return {
    status: 'success',
    towerId,
    towerType,
    location,
    remainingGold: gameState.gold
  };
}
