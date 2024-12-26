const ingame = [];
const defaultIngame = {
  gold: 0,
  score: 0,
  hp: 5,
  stage: 0,
  monster: [],
  tower: [],
  isSpawn: true,
  isRunning: true,
};

export const createInGame = (uuid) => {
  return (ingame[uuid] = defaultIngame);
};

export const getInGame = (uuid) => {
  return ingame[uuid];
};

export const deleteInGame = (uuid) => {
  const index = ingame.findIndex((game) => game.uuid === uuid);
  if (index !== -1) {
    ingame.splice(uuid, 1);
  }
};
