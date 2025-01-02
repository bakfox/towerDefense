# 🏰 TowerDefense Project

<h3>Project - WebSocket을 활용한 타워 디펜스 게임 서버 구축 </h3>

</br>

이 프로젝트는 Plants vs. Zombies와 같은 타워 디펜스 게임으로, 플레이어가 다양한 타워를 게임 맵에 배치해 몰려오는 적들을 전략적으로 방어하는 게임입니다.<br><br>
서버는 게임 상태와 사용자 데이터를 실시간으로 관리하며, API와 WebSocket을 통해 타워 공격, 쿨다운 계산, 적의 이동 등 주요 게임 메커니즘을 처리하며
클라이언트는 직관적인 인터페이스와 개선된 비주얼로 사용자 경험을 향상시키며, 오브젝트의 이미지를 새롭게 디자인해 몰입감 있는 환경을 제공합니다.<br>

</br>

### TowerDefense Game v1.0
> **TeamName: 불4조, 사**<br>
> **1.0v :  2024.12.23 ~ 2025.01.02**</br>

<br>

|          조상우         |          이준성         |          한윤재         |          박성욱         |          이유민         |
| :--------------------------: | :--------------------------: | :--------------------------: | :--------------------------: | :--------------------------: |
|<image width="150px" src="https://github.com/user-attachments/assets/3b1aab86-19e0-4543-a753-dea39b233ca6">|<image width="150px" src="https://github.com/user-attachments/assets/5cf14aac-2a7d-47f5-a841-8a446b8e3374">|<image width="150px" src="https://github.com/user-attachments/assets/79408b1b-d176-498c-8f44-b54e7a8f10d7"> |<image width="150px" src="https://user-images.githubusercontent.com/119159558/227076242-6e802ef4-4f4e-48f0-8a8a-aa5f4ebdb8b8.png"/> | <image width="150px" src="https://github.com/user-attachments/assets/bdef272d-3695-4091-8f21-35ea09302728"> |
| [bakfox](https://github.com/bakfox) | [junstar96](https://github.com/junstar96)| [yoon-H](https://github.com/yoon-H)| [WooK1184](https://github.com/WooK1184) | [JavaCPP0](https://github.com/JavaCPP0) |


<br/>

## 📕 시작 가이드
###
<h3>Requirements</h3>
For building and running the application you need:
 
 - Node.js 18.x
 - Npm 9.2.0
 
<h3>Installation</h3>

```
$ git clone https://github.com/bakfox/towerDefense.git
$ cd towerDefense
```
#### Run Method
```
$ npm install
$ node src/app.js
```
---

<br>

## 📖 Stacks
### Environment
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)

### Config
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)        

### Development
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=HTML&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma&logoColor=white)
![AmazonRDS](https://img.shields.io/badge/AmazonRDS-527FFF?style=for-the-badge&logo=AmazonRDS&logoColor=white)
![AmazonEC2](https://img.shields.io/badge/AmazonEC2-FF9900?style=for-the-badge&logo=AmazonEC2&logoColor=white)

### Communication
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)

---

</br>

## 📙 담당 파트 및 전반적인 기획

### 담당 파트

- 조상우 - 데이터 베이스 기획 및 게임 제어 로직 담당 - 팀장
- 이준성 - API 통신 담당
- 한윤재 - 클라이언트 게임 담당
- 박성욱 - 서버 타워 담당
- 이유민 - 서버 몬스터 담당

<br>

<h3>타워 디펜스 게임의 전반적인 기획</h3>
<details>

## 아웃 게임

### 랭킹

1. 랭킹 조회 - 상위 100개의 랭킹을 불러온다. (오름차순)
2. 랭킹 저장 - 인게임 끝나면 데이터 베이스에 저장

### 타워

1. 기본 타워 초월 시스템 - 가차를 통해 여러가지 타워들을 뽑고 중복을 합쳐서 기본적인 성능이 강력한 타워를 얻는다!
2. 기본 타워 가차 시스템 - 가차를 통해 여러가지 기본적인 타워를 획득한다.
3. 기본 타워 장착 시스템 - 가차를 통해서 획득한 타워를 5종류 정도 정해서 인 게임에 가져간다. (5개는 예시)

### 재화

1. 게임 클리어시 스코어 혹은 스테이지 비례해서 재화 획득

### 가차

1. 확률적으로 타워를 획득할 수 있으며 가차에는 위에서 획득한 재화가 들어간다.
2. 카드풀은 JSON파일로 관리

## 인 게임

### 서버 기본 작동

1. 서버에서 검증
    - 검증 실패하면 클라이언트에 실패 응답 보내기
2. 클라이언트의 요청 처리
    - 변경된 정보 서버 데이터에 반영
    - 변경된 서버 데이터 클라이언트에 응답 보내기
3. 서버 내부에서 게임 로직 진행
    - 로직 진행 후 서버 데이터에 반영
    - 변경된 서버 데이터 클라이언트에 응답 보내기
4. 클라이언트에게 응답하기
    - 요청에 따라서 해당하는 데이터를 응답.

### 클라이언트 기본 작동

1. 렌더링
    - 정해진 시간마다 클라이언트 데이터로 게임 화면을 렌더링한다.
2. 이벤트 발생하면 서버에게 요청을 보낸다.
    - 클라이언트는 클릭 이벤트만 처리
3. 서버에서 받은 응답을 현재 데이터에 반영한다.

### JWT토큰 인증

1. API 통신을 통해서 할때는 JWT인증을 이용해서 USER_ID 사용한다.
2. 소켓 통신 JWT인증 후 UUID 생성후  JWT인증 값으로 받아온 USER_ID와 연결해서 UUID로 사용한다.
    
    ( 게임 시작 시 JWT 인증 받아서  USER_ID 값을 가져오고  UUID랑 접목해서 사용)
    

### 서버 루프문

```jsx
const FPS = 60;
const interval = 1000 / FPS;

//이거 호출해서 루프 시작
function logicLoop() {

  const start = Date.now();
	if (!isRunning) {
    console.log('Logic loop stopped.');
    return; // 루프를 종료
  }
  console.log('Logic executed at:', start);
  // 여기에 실행할 로직 작성
	
  const elapsed = Date.now() - start;
  setTimeout(() => process.nextTick(logicLoop), Math.max(0, interval - elapsed));
}

logicLoop(); // 루프 시작

// 실행시 루프 종료 
const endLoop = ()=>{
	console.log('Stopping loop...');
  isRunning = false; // 루프 종료 신호
}
```

# 타워

1. 타워 강화 시스템 
    - 강화 규칙
        - 설치된 타워를 지정해서 골드로 업그레이드 할 수 있다.
        - 레벨에 비례해서 스탯 값이 올라간다.
            - 올라가는 정도는 메모리에 저장되어 있다.
            - upgradeValue * price 가 강화에 드는 비용
    - 강화 방법
        1. 설치된 타워를 클릭하면 강화, 환불 여부를 물어보는 창이 나온다.
        2. 강화를 누르면 보유 골드를 확인한다.
        3. 골드가 충분하다면 강화 성공 아니면 실패 ( 성공 실패 message 출력 )
    - 클라이언트에 보이는 응답.
        - message와 결과 값을 응답받는다.
2. 타워 설치 시스템
    - 설치 규칙
        - 처음에 몇개의 지정한 타워 리스트를 가지고 게임을 시작한다.
        - 타워 리스트에 있는 타워를 골드 지불 후 설치할 수 있다.
        - 필요한 골드는 서버 메모리에 저장되어 있다.
        - 1 레벨로 시작한다.
    - 설치 방법
        1. 타워 리스트에서 원하는 타워를 클릭한다.
        2. 설치할 공간을 클릭한다.
        3. 지정된 위치의 겹치는 건물이 있는지 확인한다.
        4. 구매할 금액이 충분한지 확인한다.
        5. 3,4번 조건이 만족하면 설치
3. 타워 회수 시스템
    - 회수 규칙
        - 설치된 타워를 팔아서 절반 정도의 골드를 얻을 수 있다.
        - 환불하면 기본 타워 값 + 업그레이드 비례 값을 계산해 골드를 얻고 판매된 타워를 삭제한다.
    - 회수 방법
        1. 설치된 타워를 클릭하면 강화, 환불 여부를 물어보는 창이 나온다.
        2. 환불을 누르면 골드를 얻는다.
4.  타워 공격 시스템
    - 공격 규칙(알고리즘)
        1. 서버에서 Loop로 계속 체크를 해준다.
        2. 타워의 쿨타임이 0이하가 되면 공격 로직을 실행한다.
        3. 사거리에 들어온 적을 찾는다.
        4. 가장 먼저 들어온 적을 타켓으로 설정한다.
            - 사거리 내의 적들을 배열로 저장
            - 적이 죽거나 사거리 밖으로 나가면 배열에서 지워주기.
        5. 공격을 해서 몬스터의 체력을 감소시킨다.
        6. 클라이언트에 특정 타워의 공격을 요청한다.
        7. 쿨타임을 미리 정한 값으로 초기화 하고 다시 Loop를 진행한다.

### 몬스터

1. 몬스터 생성 
    - 생성 규칙(알고리즘)
        1. 서버에서 Loop로 계속 체크를 해준다.
        2. 몬스터 생성 쿨타임이 0 이하가 되면 생성 로직을 실행한다.
            - 배열 순서대로 몬스터 생성
            - 생성 후 카운트 감소
            - 카운트 0이면 다음 배열 확인
        3. 생성한 몬스터를 몬스터 배열에 집어넣는다.
            - 몬스터는 스테이지에 비례해서 강해짐
        4. 클라이언트에게 생성한 몬스터를 보내준다.
        5. 쿨타임을 미리 정한 값으로 초기화 하고 다시 Loop를 진행한다.
2. 몬스터가 죽을때 클라이언트로 응답을 보냅니다.
    - 사망 규칙
        1. 타워가 공격하면 몬스터의 생존 체크 함수 호출 (몬스터 공격 시에도 호출 ) 
        2. 자신의 체력이 0 이하면 
        3. 클라이언트에 해당 몬스터 Index 값을 클라이언트에 보낸다.
        4. 해당 몬스터를 몬스터 배열에서 삭제합니다.
3. 몬스터가 하우스에 도착하면 클라이언트로 응답을 보냅니다.
    - 공격 규칙(알고리즘)
        1. 서버에서 Loop로 계속 체크를 해준다.
        2. 몬스터의 x , y 좌표가 집의 x , y 좌표랑 같다면 플레이어 생존 체크 함수 호출 (몬스터 생존 체크 함수도 호출)
            - 하우스 체력 수정 후 클라이언트에 전달.

### 스테이지

1. 게임 시작 
    - 게임 시작 규칙
        1. 클라이언트 에서 게임 시작 버튼 클릭시 새로 생성한 uuid를 기반으로 inGame 배열에 새로운 게임 데이터 객체를 생성합니다.
            - 게임 데이터
                - 플레이어 체력
                - 플레이어 골드
                - 플레이어 스코어
                - 몬스터 배열
                - 타워 배열
                - 스테이지 레벨
        2. 그리고 클라이언트에 이 데이터를 객체 형태로 보내줍니다.
2. 게임 종료
    - 게임 종료 규칙
        1. 특정 조건으로 인해서 게임이 종료 하면 서버  스코어를 기반으로 젬(아웃 게임 재화)를 획득
        2.  기존에 있던 inGame 배열에서 유저의 uuid 위치를 삭제합니다.
3. 스테이지 변경 
    - 스테이지 변경 규칙
        1. 스테이지의 모든 몬스터 처치 시 다음 스테이지로 진입.
        2. 플레이어 자본 추가하기 메서드 호출
        3. 플레이어 스코어 추가 메서드 호출
        4. 클라이언트에게 스테이지 레벨을 보낸다.
4. 하우스 체력 갱신
    - 하우스 체력 갱신 규칙
        1. 하우스의 체력 변경 후 클라이언트에게 보낸다.
5. 자본 변경
    - 자본 변경 규칙
        1. 자본 변경 후 클라이언트에게 보낸다.
6. 점수 변경
    - 점수 변경 규칙
        1. 몬스터 처치 또는 스테이지 클리어 시 스코어를 변경 후 클라이언트에게 보낸다.

### 점수

- 몬스터 처치해서 점수 획득
- 스테이지 클리어 시 점수 획득

### 재화

1. 몬스터를 처치해서 인게임 재화 획득
    - 재화량
        - 종류에 따른 기본 값 + 스테이지에 따른 추가 금액 값
2. 스테이지 클리어시 재화 추가 획득
    - 스테이지 비례해서 올라가기
    - 

### 기본 데이터

- js 파일로 객체를 생성해서 import를 이용해서 사용

1. 스테이지 

- 몬스터 스폰량
    - id : 1 (  몬스터 id가 1번 ) , count : 10  ( 10마리 소환 )
    - 몬스터 소환시 count-1 씩 감소 count가 0이면 다음 배열로 이동합니다.
- 몬스터 id 를 기준으로 생성

```jsx
[
  [{ id: 1, count: 10 }, { id: 5, count: 2 }],
  [{ id: 1, count: 10 }, { id: 3, count: 5 }],
]
```

1.  몬스터

```jsx
[
  {
  id: 1, 
  spead : 2 
  atck  : 1
  hp  : 10
  upgradeValue : 2
  reward : 200
  },
]
```

1.  타워

```jsx
[
  {
  id: 1, 
  atckSpead : 2 
  atck  : 1
  upgradeValue : 2
  price: 200
  },
]
```

### 인게임 데이터

1. 인게임

```jsx
[
	{ 
		house = {}, // 객체 형태로 
		monsterSpawnCooldown = 1, //이거 기준으로 생성
		playerGold = 0,
		playerScore = 0,
		monster = [], // 배열 형태로 여러개 저장
		tower = [], // 배열 형태로 여러개 저장 
	},
]
```

- house 객체 형태
    
    ```jsx
    { 
    		x - 집 좌표 x
    		y - 집 좌표 y
    		hp - 집 체력 기본 값 : 5
    },
    ```
    

2. 몬스터 

- [] 객체 배열 형태로 관리
    
    ```jsx
    [
    	{ 
    		id - 몬스터 id
    		x - 좌표 
    		y - 좌표 
    		spead - 스피드 / 기본값 : 1
    		atck - 공격력 ( 이 수치만큼 체력이 깎임 ) / 기본값 : 1
    		hp - 체력 / 기본값 : 5
    		upgradeValue - 스테이지 오르면 얼마나 오르는지 / 기본값 : 1
    		reward - 보상 골드 / 기본값 : 200
    	},
    ]
    ```
    

3. 타워 

- [] 객체 배열 형태로 관리</details>

---
</br>

## 📚 API 명세서 및 패킷 명세서

[API 명세서 .Notion](https://teamsparta.notion.site/1622dc3ef51481babda0c688bbe8cf23?v=1622dc3ef51481398dba000cc87324ea)

<br>

[패킷 명세서 .Notion](https://teamsparta.notion.site/58461f6c72014d5794fc937cdd2e0e2a?v=1662dc3ef51481f0aeb9000c5f49724f)

---
<br>

## 🖥️ 와이어 프레임
| 게임 구조 |
| :--------------------------------------------: |
![image](https://github.com/user-attachments/assets/f94fc582-7797-4a48-81af-fc4fbaf80e79)
![image](https://github.com/user-attachments/assets/ac3d3f5e-3241-43ad-9edb-d8f3ee73accd)


## 🕹️ 게임 화면
| 시작 화면 |
| :--------------------------------------------: |
![image](https://github.com/user-attachments/assets/1efa337c-3b08-4b6f-b0eb-afb1cbf19651)


---
<br>

## 📦 아키텍쳐

### ERD DIAGRAM
![image](https://github.com/user-attachments/assets/e9baea2d-5217-478c-b098-5d608b0c6226)


### 디렉토리 구조

```
├── README.md
├── gameDefaultData
│   ├── monster.js
│   ├── stage.js
│   └── tower.js
├── node_modules
├── package-lock.json
├── package.json
├── prisma
│   ├── migrations
│   └── schema.prisma
├── public
│   ├── beforeGame.html
│   ├── game.html
│   ├── images
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── squad.html
│   └── src
│       ├── button.js
│       ├── default
│       │   └── gameData.js
│       ├── game.js
│       ├── gameManager.js
│       ├── handlers
│       │   ├── Constants.js
│       │   ├── actionMappings.js
│       │   ├── socket.js
│       ├── house.js
│       ├── monster.js
│       ├── tower.js
│       └── towerUI.js
└── src
    ├── app.js
    ├── constants.js
    ├── gameLogic
    │   └── serverGame.js
    ├── handlers
    │   ├── handlerMapping.js
    │   ├── helper.js
    │   ├── monsterHandler.js
    │   ├── registerHandler.js
    │   ├── stageHandler.js
    │   └── towerHandler.js
    ├── init
    │   └── socket.js
    ├── middleware
    │   └── auth.middlewares.js
    ├── models
    │   ├── inGame.js
    │   ├── monster.model.js
    │   └── tower.model.js
    ├── routers
    │   ├── accounts.router.js
    │   └── user.js
    └── utils
        ├── index.js
        └── prisma_client.js
```

