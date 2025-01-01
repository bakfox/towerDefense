// jest.config.js
module.exports = {
    transform: {
        "^.+\\.js$": "babel-jest",  // 모든 JS 파일을 babel-jest로 처리
    },
    testEnvironment: "node",  // Node 환경에서 테스트 실행
};
