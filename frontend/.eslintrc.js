module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ["plugin:react/recommended", "airbnb", "prettier", "prettier/react"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            impliedStric: true
        },
        ecmaVersion: 12,
        sourceType: "module"
    },
    plugins: ["react", "prettier"],
    rules: {
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto"
            }
        ],
        "import/no-unresolved": "off",
        "no-param-reassign": "off",
        "import/prefer-default-export": "off",
        "react/prop-types": "off",
        "react/jsx-props-no-spreading": "off"
    }
};
