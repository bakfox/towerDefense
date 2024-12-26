import towerData from '../../gameDefaultData/tower.js';

let availableTowers = []; // 플레이어가 사용할 수 있는 타워 리스트

//게임 시작 시 초기화하며 3개의 리스트를 제공할 예정
export const initializeGameHandler = (socket) => {
    // 타워 데이터에서 3개의 랜덤 타워 선택
    const towerKeys = Object.keys(towerData);
    //랜덤 데이터를 넣을 배열 생성
    const selectedTowers = [];

    //랜덤인덱스를 기준으로 3개 추출 후 배열에 넣기
    while (selectedTowers.length < 3) {
        const randomIndex = Math.floor(Math.random() * towerKeys.length);
        const randomTower = towerKeys[randomIndex];

        if (!selectedTowers.includes(randomTower)) {
            selectedTowers.push(randomTower);
        }
    }

    // 선택된 타워 리스트 데이터 준비
    availableTowers = selectedTowers.map((key) => ({
        type: key,
        cost: towerData[key].cost,
        attackPower: towerData[key].attackPower,
        upgradeValue: towerData[key].upgradeValue,
    }));

    // 클라이언트에 초기 데이터 전달
    socket.emit('initializeGame', {
        status: 'success',
        message: '게임이 시작되었습니다.',
        availableTowers,
        gold,
    });
};