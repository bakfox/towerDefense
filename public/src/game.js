import { initSocket, sendEvent } from "./handlers/socket.js";
import { initData } from "./default/gameData.js";
import { House } from "./house.js";
import { Monster } from "./monster.js";
import { Tower } from "./tower.js";
import { GameManager } from "./gameManager.js";

/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/

let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const NUM_OF_MONSTERS = 5; // 몬스터 개수

let userGold = 0; // 유저 골드
let house; // 기지 객체
let houseHp = 0; // 기지 체력

let towerCost = 0; // 타워 구입 비용
let numOfInitialTowers = 0; // 초기 타워 개수
let stage = 0; // 스테이지
const monsters = new Map();
const towers = new Set();

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;
let towerDec;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = "images/bg.webp";

const towerImage = new Image();
towerImage.src = "images/tower.png";

const houseImage = new Image();
houseImage.src = "images/house.png";

const pathImage = new Image();
pathImage.src = "images/path.png";

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}

let monsterPath = [];

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
      // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function getRandomPositionNearPath(maxDistance) {
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}

function placeInitialTowers() {
  /* 
    타워를 초기에 배치하는 함수입니다.
    무언가 빠진 코드가 있는 것 같지 않나요? 
  */
  for (let i = 0; i < numOfInitialTowers; i++) {
    const { x, y } = getRandomPositionNearPath(200);
    const tower = new Tower(x, y, towerCost);
    towers.push(tower);
    tower.draw(ctx, towerImage);
  }
}

function placeNewTower() {
  /*
  타워를 구입할 수 있는 자원이 있을 때 타워 구입 후 랜덤 배치하면 됩니다.
  빠진 코드들을 채워넣어주세요!
  */
  const { x, y } = getRandomPositionNearPath(200);
  const tower = new Tower(x, y);
  towers.push(tower);
  tower.draw(ctx, towerImage);
}

function placeHouse() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  house = new House(lastPoint.x, lastPoint.y, houseHp);
  house.draw(ctx, houseImage);
}

export function setHouseHp(value) {
  house.setHouseHp(value);
}

// #region 몬스터 기능
// 몬스터 추가
export function addMonster(id, type) {
  monsters.set(id, new Monster(monsterPath, monsterImages, id, type, stage));
}

// 몬스터 삭제
export function deleteMonster(id) {
  monsters.delete(id);
}

// 몬스터 이동
export function moveMonsters(locationList) {
  for (const item of locationList) {
    const monster = monsters.get(item.id);

    monster.move(item.x, item.y);
  }
}
// #endregion


// #region 타워 기능
// 타워 추가
async function addTower(targetLocation, type) {
  try {
    const data = await sendEvent(101, { towerId: type, targetLocation });
    const { towerId, towerType, location } = data;
    towers.set(id, new Tower(location.x, location.y, towerId, towerType));
  } catch (error) {
    console.log("타워 설치에 실패했습니다!");
  }
}

// 타워 이동
async function moveTower(id, curLocation, targetLocation) {
  try {
    const data = await sendEvent(102, { id, curLocation, targetLocation });
    const { towerId, moveLocation } = data;

    towers.get(towerId).move(moveLocation);
  } catch (error) {
    console.log("타워 이동에 실패했습니다!");
  }
}

// 타워 판매
async function sellTower(id) {
  try {
    const data = await sendEvent(103, { id });
    const { towerId } = data;

    towers.delete(towerId);
  } catch (error) {
    console.log("타워 판매매에 실패했습니다!");
  }
}

// 타워 강화
async function upgradeTower(id) {
  try {
    const data = await sendEvent(104, { id });
    const { towerId } = data;

    towers.get(towerId).upgrade();
  } catch (error) {
    console.log("타워 강화에 실패했습니다!");
  }
}

// 타워 공격
export function towerAttack(towerId, monsterId) {
  const monster = monsters.get(monsterId);
  const tower = towers.get(towerId);

  tower.attack(monster);
}

// #endregion

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = "25px Times New Roman";
  ctx.fillStyle = "skyblue";
  ctx.fillText(`최고 기록: ${GameManager.highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = "white";
  ctx.fillText(`점수: ${GameManager.score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = "yellow";
  ctx.fillText(`골드: ${GameManager.userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = "black";
  ctx.fillText(`현재 스테이지: ${GameManager.stage}`, 100, 200); // 최고 기록 표시

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImage);
    tower.updateCooldown();
    monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2)
      );
      if (distance < tower.range) {
        tower.attack(monster);
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  house.draw(ctx, houseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(house);
      if (isDestroyed) {
        /* 게임 오버 */
        alert("게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ");
        location.reload();
      }
      monster.draw(ctx);
    } else {
      /* 몬스터가 죽었을 때 */
      monsters.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function initGame() {
  if (GameManager.isInitGame) {
    return;
  }

  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  placeHouse(); // 기지 배치

  gameLoop(); // 게임 루프 최초 실행
  GameManager.isInitGame = true;
}

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImage.onload = resolve)),
  new Promise((resolve) => (houseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map(
    (img) => new Promise((resolve) => (img.onload = resolve))
  ),
]).then(async () => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */
  let somewhere;

  serverSocket = await initSocket(somewhere);

  if (!serverSocket) console.log("socket 접속 실패!");

  try {
    const gameAssets = await sendEvent(1, {});

    // 게임 데이터 초기화 TODO
    const { monster, tower } = gameAssets;

    ({
      towerDec,
      monsterPath,
      playerHp: houseHp,
      playerGold: GameManager.userGold,
      stage: GameManager.stage,
    } = gameAssets);

    // 기본 데이터 초기화
    initData(monster, tower);

    if (!GameManager.isInitGame) initGame();
  } catch (error) {
    console.log("게임 데이터 반환 실패!:", error);
  }

  /* 
    서버의 이벤트들을 받는 코드들은 여기다가 쭉 작성해주시면 됩니다! 
    e.g. serverSocket.on("...", () => {...});
    이 때, 상태 동기화 이벤트의 경우에 아래의 코드를 마지막에 넣어주세요! 최초의 상태 동기화 이후에 게임을 초기화해야 하기 때문입니다! 
    if (!isInitGame) {
      initGame();
  */
});

// 타워 선택 UI 생성
const towerSelectionUI = document.createElement("div");
towerSelectionUI.style.position = "absolute";
towerSelectionUI.style.top = "50%";
towerSelectionUI.style.left = "50%";
towerSelectionUI.style.transform = "translate(-50%, -50%)";
towerSelectionUI.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
towerSelectionUI.style.padding = "20px";
towerSelectionUI.style.borderRadius = "10px";
towerSelectionUI.style.color = "white";

initGame();

document.body.appendChild(towerSelectionUI);
