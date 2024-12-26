const FPS = 60;
const interval = 1000 / FPS;

//이거 호출해서 루프 시작
export function logicLoop() {
  const start = Date.now();
  if (!isRunning) {
    console.log("Logic loop stopped.");
    return; // 루프를 종료
  }
  console.log("Logic executed at:", start);
  // 여기에 실행할 로직 작성

  const elapsed = Date.now() - start;
  setTimeout(
    () => process.nextTick(logicLoop),
    Math.max(0, interval - elapsed)
  );
}

// 실행시 루프 종료
export const endLoop = () => {
  console.log("Stopping loop...");
  isRunning = false; // 루프 종료 신호
};
