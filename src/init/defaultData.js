import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 위에 두개가 현재 파일 경로 찾는거
const basePath = path.join(__dirname, "../../gameDefaultData"); // 그거 기준에서 폴더 찾기
let defaultData = {};

const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadDefaultData = async () => {
  try {
    const [combo, monster, player, stage] = await Promise.all([
      readFileAsync("monster.json"),
      readFileAsync("player.json"),
      readFileAsync("stage.json"),
    ]);

    defaultData = { combo, monster, player, stage };
    return defaultData;
  } catch (err) {
    throw new Error("Failed to load game assets : " + err.message);
  }
};

export const getDefaultData = () => {
  return defaultData;
};
