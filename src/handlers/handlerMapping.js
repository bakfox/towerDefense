import { gameStart } from "./stageHandler.js";
import {installTowerHandler} from "./tower.handler.js";

const handlerMappings = {
  //여기에 1 : 이벤트 함수 로 매칭
  1: gameStart,
  101 : installTowerHandler
};

export default handlerMappings;
