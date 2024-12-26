import { addMonster, moveMonsters, setHouseHp } from "../game.js";
import { GameManager } from "../gameManager.js";
const actionMappings = {
  3: GameManager.setStage,
  4: setHouseHp,
  5: GameManager.setUserGold,
  6: GameManager.setScore,
  101: "towerAttack",
  201: addMonster,
  202: moveMonsters,
  203: "monsterAttack",
  204: "killMonster",
};

export default actionMappings;
