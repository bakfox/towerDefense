import { addMonster, moveMonsters, setHouseHp, deleteMonster, towerAttack, moveStage } from "../game.js";
import { GameManager } from "../gameManager.js";
const actionMappings = {
  3: moveStage,
  4: setHouseHp,
  5: GameManager.setUserGold,
  6: GameManager.setScore,
  101: towerAttack,
  201: addMonster,
  202: moveMonsters,
  //203: "monsterAttack",
  204: deleteMonster,
};

export default actionMappings;
