module.exports = {
    env: {
        node: true,
        es6: true,
        jest: true,
        jasmine: true
    },
    extends: ["airbnb-base", "prettier"],
    parserOptions: {
        ecmaVersion: 11,
        sourceType: "module",
        ecmaFeatures: {
            globalReturn: false
        },
        babelOptions: {
            configFile: "./.babelrc.js"
        }
    },
    plugins: ["import", "prettier"],
    parser: "@babel/eslint-parser",
    rules: {
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto"
            }
        ],
        "import/prefer-default-export": "off",
        "class-methods-use-this": "off",
        "no-useless-constructor": "off",
        "no-plusplus": "off",
        "no-unused-vars": "warn",
        "no-cycle": "true"
    }
};
