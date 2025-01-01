export class GameManager {
  static isGameOver = false;
  static isInitGame = false;
  static stage = 0; // 현재 스테이지

  static userGold = 0; // 유저 골드
  static score = 0; // 게임 점수
  static highScore = 0; // 기존 최고 점수

  static reset() {
    GameManager.isGameOver = false;
    GameManager.isInitGame = false;
    GameManager.stage = 0;

    GameManager.userGold = 0;
    GameManager.score = 0;
    GameManager.highScore = 0;
  }

  static setStage({ stage }) {
    GameManager.stage = stage;
  }

  static setUserGold({ playerGold }) {
    GameManager.userGold = playerGold;
  }

  static setScore({ score }) {
    GameManager.score = score;
  }
}
