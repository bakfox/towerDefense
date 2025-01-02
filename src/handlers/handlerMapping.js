import { gameStart } from "./stageHandler.js";
import {
  installTowerHandler,
  moveTowerHandler,
  refundTowerHandler,
  upgradeTowerHandler,
} from "./towerHandler.js";

const handlerMappings = {
  //여기에 1 : 이벤트 함수 로 매칭
  1: gameStart,
  101: installTowerHandler,
  102: moveTowerHandler,
  103: refundTowerHandler,
  104: upgradeTowerHandler,
};

export default handlerMappings;
