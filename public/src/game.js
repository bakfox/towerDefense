import { initSocket, sendEvent } from "./handlers/socket.js";
import { initMonsterData, initTowerData } from "./default/gameData.js";
import { House } from "./house.js";
import { Button } from "./button.js";
import { TowerUI } from "./towerUI.js";
import { Monster } from "./monster.js";
import { Tower } from "./tower.js";
import { GameManager } from "./gameManager.js";

/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/

let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const FRAME_RATE = 60; // 고정 시킬 프레임
const FRAME_INTERVAL = 1000 / FRAME_RATE; // 프레임 계산
let lastFrameTime = performance.now(); //처음 실행 시간

const NUM_OF_MONSTERS = 6; // 몬스터 개수
const NUM_OF_TOWERS = 5; // 타워 개수수

let house; // 기지 객체
let houseHp = 0; // 기지 체력

const monsters = new Map();
const towers = new Map();

//입출력 이벤트
let ioBuffer = {
  action: "",
  id: -1,
  location: { x: 0, y: 0 },
  reset() {
    this.action = "";
    this.id = -1;
    this.location = { x: 0, y: 0 };
  },
};
let hoverLoc = { x: 0, y: 0 };
let buttons = [];

let towerUI;

let towerDec = [];

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = "images/bg.webp";

const towerImage = new Image();
towerImage.src = "images/tower.png";

const houseImage = new Image();
houseImage.src = "images/house.png";

const pathImage = new Image();
pathImage.src = "images/path.png";

let monsterImages = new Map();
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster_${i}.png`;
  monsterImages.set(i, img);
}

let towerImages = new Map();
for (let i = 1; i <= NUM_OF_TOWERS; i++) {
  const img = new Image();
  img.src = `images/tower_${i}.png`;
  towerImages.set(i, img);
}

let btnImages = [];
for (let i = 1; i <= 3; i++) {
  const img = new Image();
  img.src = `images/btn_${i}.png`;
  btnImages.push(img);
}

let monsterPath = [];

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 55; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 3; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x - imageWidth /2;
    const startY = monsterPath[i].y - imageHeight /2;
    const endX = monsterPath[i + 1].x - imageWidth /2;
    const endY = monsterPath[i + 1].y - imageHeight /2;

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

function placeHouse() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  house = new House(lastPoint.x, lastPoint.y, houseHp);
  house.draw(ctx, houseImage);
}
export function gameEnd(value) {
  alert(
    `게임 클리어! ${value.gem} : 잼 획득! ${value.score} : 최종 스코어 ${value.playerStage} : 최종 스테이지 `
  );
  location.href = "../beforeGame.html";
}
export function setHouseHp(value) {
  house.setHp(value);
}

const decX = canvas.width - 125;
const decY = canvas.height / 2 - 50 - 130;

const TOWER_WIDTH = 100;
const TOWER_HEIGHT = 100;

function initTowerDecButton() {
  // 타워 버튼 추가
  for (let i = 0; i < towerDec.length; i++) {
    const id = towerDec[i].ID;

    buttons.push(
      new Button(
        "defaultTower",
        id,
        decX,
        decY + i * 130,
        TOWER_WIDTH,
        TOWER_HEIGHT,
        towerImages.get(id),
        function (x, y) {
          ioBuffer.action = "create";
          ioBuffer.id = id;
          hoverLoc.x = x;
          hoverLoc.y = y;
        }
      )
    );
  }
}

initTowerDecButton();

// 스테이지 변경
export function moveStage(payload) {
  const { playerStage, monster } = payload;
  console.log(payload, monster);
  GameManager.setStage(playerStage);

  initMonsterData(monster);
}

// #region 몬스터 기능
// 몬스터 추가
export function addMonster(payload) {
  const { id, uniqueId } = payload;
  monsters.set(
    uniqueId,
    new Monster(monsterPath, monsterImages, id, uniqueId, GameManager.stage)
  );
}

// 몬스터 삭제
export function deleteMonster(payload) {
  const { uniqueId } = payload;
  monsters.delete(uniqueId);
}

// 몬스터 이동
export async function moveMonsters(data) {
  for (let key of Object.keys(data.monsters)) {
    const monster = monsters.get(data.monsters[key].id);
    //console.log("setLocation", data.monsters[key]);
    monster.setLocation(
      data.monsters[key].x,
      data.monsters[key].y,
      data.monsters[key].currentIndex
    );
  }
}
// #endregion

// #region 타워 기능
// 타워 추가
async function addTower(targetLocation) {
  try {
    const type = ioBuffer.id;
    ioBuffer.reset();
    const data = await sendEvent(101, {
      towerType: type,
      location: targetLocation,
    });
    const towerData = data.tower;
    const { towerId, towerType, location } = towerData;

    const tower = new Tower(
      location.x,
      location.y,
      towerId,
      towerType,
      TOWER_WIDTH,
      TOWER_HEIGHT,
      towerImages.get(towerType),
      function () {
        ioBuffer.action = "tower";
        ioBuffer.id = this.id;
        towerUI.openUI(this.id, this.x, this.y);
        ``;
      }
    );
    towers.set(towerId, tower);
    buttons.push(tower.btn);
    tower.draw(ctx, towerImage);
  } catch (error) {
    console.log(error);
  }
}

// 타워 이동
async function moveTower(id, targetLocation) {
  try {
    ioBuffer.reset();
    const data = await sendEvent(102, {
      towerId: id,
      moveLocation: targetLocation,
    });
    const { towerId, moveLocation } = data;

    towers.get(towerId).move(moveLocation);
  } catch (error) {
    console.log(error);
  }
}

// 타워 판매
async function sellTower(id) {
  try {
    ioBuffer.reset();
    const data = await sendEvent(103, { towerId: id });
    const { towerId } = data;

    const idx = buttons.findIndex(
      (button) => button.id === towerId && button.label === "tower"
    );
    buttons.splice(idx, 1);

    towers.delete(towerId);
  } catch (error) {
    console.log(error);
  }
}

// 타워 강화
async function upgradeTower(id) {
  try {
    const data = await sendEvent(104, { towerId: id });
    const { towerId } = data.tower;

    towers.get(towerId).upgrade();
  } catch (error) {
    console.log(error);
  }
}

// 타워 공격
export function towerAttack(payload) {
  const { monsterId, towerId } = payload;
  const monster = monsters.get(monsterId);
  const tower = towers.get(towerId);

  tower.attack(monster);
  monster.takeDamage(tower.atck);
}

// #endregion

function gameLoop() {
  const deltaTime = performance.now() - lastFrameTime;

  if (deltaTime >= FRAME_INTERVAL) {
    // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
    drawPath(monsterPath); // 경로 다시 그리기

    ctx.font = "25px Times New Roman";
    ctx.fillStyle = "skyblue";
    ctx.fillText(`최고 기록: ${GameManager.highScore}`, 50, 50); // 최고 기록 표시
    ctx.fillStyle = "white";
    ctx.fillText(`점수: ${GameManager.score}`, 50, 100); // 현재 스코어 표시
    ctx.fillStyle = "yellow";
    ctx.fillText(`골드: ${GameManager.userGold}`, 50, 150); // 골드 표시
    ctx.fillStyle = "black";
    ctx.fillText(`현재 스테이지: ${GameManager.stage}`, 50, 200); // 최고 기록 표시

    // 타워 그리기
    towers.forEach((tower) => {
      tower.draw(ctx, towerImage);
    });
    // 고정 프레임 전용

    monsters.forEach((monster) => {
      monster.move(house);
      monster.draw(ctx);
    });

    // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
    house.draw(ctx, houseImage);
    // 버튼 그리기
    for (let i = buttons.length - 1; i >= 0; i--) {
      const button = buttons[i];

      if (button.label === "defaultTower") {
        ctx.globalAlpha = "0.5";
        ctx.fillStyle = "white";
        ctx.fillRect(button.x - 10, button.y - 10, 120, 120);

        ctx.globalAlpha = "1";
      }

      button.draw(ctx);
    }

    // 호버 이미지 그리기(타워)
    if (ioBuffer.action === "create") {
      ctx.drawImage(
        towerImages.get(ioBuffer.id),
        hoverLoc.x - TOWER_WIDTH / 2,
        hoverLoc.y - TOWER_WIDTH / 2,
        TOWER_WIDTH,
        TOWER_HEIGHT
      );
    }

    // 타워 UI 그리기
    towerUI.draw(ctx);

    requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
    // 호버 이미지 그리기(타워)
    if (ioBuffer.action === "create") {
      console.log("ioBuffer", ioBuffer);
      ctx.drawImage(
        towerImages.get(ioBuffer.id),
        hoverLoc.x - TOWER_WIDTH / 2,
        hoverLoc.y - TOWER_WIDTH / 2,
        TOWER_WIDTH,
        TOWER_HEIGHT
      );
    }
    lastFrameTime = performance.now();
  }
  setTimeout(() => {
    gameLoop();
  }, FRAME_INTERVAL);
}

function initGame() {
  if (GameManager.isInitGame) {
    return;
  }

  towerUI = new TowerUI(0, 0, btnImages, [
    function () {
      upgradeTower(this.id);
      towerUI.closeUI();
    },
    function () {
      ioBuffer.action = "move";
      ioBuffer.id = this.id;
      towerUI.closeUI();
    },
    function () {
      sellTower(this.id);
      towerUI.closeUI();
    },
  ]);
  placeHouse(); // 기지 배치
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  house.draw(ctx, houseImage);
  gameLoop(); // 게임 루프 최초 실행
  GameManager.isInitGame = true;
}

//쿠키를 읽는 함수
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (houseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...Array.from(monsterImages.values()).map(
    (img) =>
      new Promise((resolve) => {
        img.onload = resolve;
      })
  ),
  ...Array.from(towerImages.values()).map(
    (img) =>
      new Promise((resolve) => {
        img.onload = resolve;
      })
  ),
  ...btnImages.map(
    (img) =>
      new Promise((resolve) => {
        img.onload = resolve;
      })
  ),
]).then(async () => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */
  let token = getCookie("authorization");

  serverSocket = await initSocket(token);

  if (!serverSocket) console.log("socket 접속 실패!");

  try {
    const gameAssets = await sendEvent(1, {
      cookies: token,
      width: canvas.width,
      height: canvas.height,
    });

    // 게임 데이터 초기화 TODO
    const { monster, tower, playerGold, stage } = gameAssets;

    GameManager.setUserGold({ playerGold });
    GameManager.setStage(stage);

    ({ towerDec, path: monsterPath, playerHp: houseHp } = gameAssets);

    // 기본 데이터 초기화
    initMonsterData(monster);
    initTowerData(tower);

    initTowerDecButton();

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

canvas.addEventListener("click", (e) => {
  const x = e.offsetX;
  const y = e.offsetY;

  console.log("click", x, y);

  if (towerUI.handleClick(x, y)) {
    return;
  }

  if (towerUI.isVisible) {
    towerUI.closeUI();
  }

  let isButtonClicked = false;
  for (let i = buttons.length - 1; i >= 0; i--) {
    const button = buttons[i];
    if (button.isClicked(x, y)) {
      if (button.label === "defaultTower") button.onClick(x, y);
      else button.onClick();
      isButtonClicked = true;
      console.log(ioBuffer);
      break; // 첫 번째로 클릭된 버튼에서 순회 중단
    }
  }

  if (isButtonClicked) return;

  // TODO 허공 클릭하면 처리할 이벤트
  switch (ioBuffer.action) {
    case "create":
      addTower({ x, y });
      towerUI.closeUI();
      break;
    case "move":
      moveTower(ioBuffer.id, { x, y });
      towerUI.closeUI();
      break;
    default:
      ioBuffer.reset();
      towerUI.closeUI();
  }

  console.log(ioBuffer);
});

canvas.addEventListener("mousemove", (e) => {
  const x = e.offsetX;
  const y = e.offsetY;

  //console.log(x, y);

  if (ioBuffer.action === "create") {
    hoverLoc.x = x;
    hoverLoc.y = y;
  } else {
    hoverLoc = { x: 0, y: 0 };
  }
});
