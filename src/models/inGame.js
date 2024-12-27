const ingame = {};
const defaultIngame = {
  gold: 0,
  score: 0,
  house: {
    hp: 5,
    x: 0,
    y: 0,
  },
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
  if (ingame[uuid]) {
    delete ingame[uuid];
  }
};
