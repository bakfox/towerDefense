import { addMonster } from "../game.js";

const actionMappings = {
  3: "changeStage",
  4: "changeHouseHp",
  5: "changeMoney",
  6: "changeScore",
  201: addMonster,
  202: "moveMonster",
  203: "monsterAttack",
  204: "killMonster",
};

export default actionMappings;
