// babel.config.js
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "current",
                },
                modules: "commonjs", // ES 모듈을 CommonJS로 변환
            },
        ],
    ],
};
