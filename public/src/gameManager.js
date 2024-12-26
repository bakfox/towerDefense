export class GameManager {
  static isGameOver = false;
  static isInitGame = false;
  static stage = 0; // 현재 스테이지

  static userGold = 0; // 유저 골드
  static score = 0; // 게임 점수
  static highScore = 0; // 기존 최고 점수

  static reset() {
    this.isGameOver = false;
    this.isInitGame = false;
    this.stage = 0;

    this.userGold = 0;
    this.score = 0;
    this.highScore = 0;
  }
}
