const ingame = [];
const defaultIngame = {
  gold: 0,
  score: 0,
  hp: 5,
  monster: [],
  tower: [],
};

export const createinGame = (uuid) => {
  ingame[uuid] = defaultIngame;
};

export const getinGame = (uuid) => {
  return ingame[uuid];
};

export const deleteGame = (uuid) => {
  const index = ingame.findIndex((game) => game.uuid === uuid);
  if (index !== -1) {
    ingame.splice(uuid, 1);
  }
};
