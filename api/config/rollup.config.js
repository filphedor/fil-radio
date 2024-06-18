const babel = require('@rollup/plugin-babel');

let conf = [
    {
        "input": "./src/server.js",
        "output": {
            "file": "dist/server.js",
            "format": "cjs"
        },
        "plugins": [babel({"configFile": "./config/.babel.config.json", "babelHelpers": "bundled"})]
    }
];

module.exports = conf;