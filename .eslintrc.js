module.exports = {
    "env": {
        "browser": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-invalid-this": 2,
        "no-multi-spaces": 2,
        "no-new-wrappers": 2,
        "no-throw-literal": 2,
        "no-with": 2,
        "no-unused-vars": [2, {args: "none"}],
        "array-bracket-spacing": [2, "never"],
        "eqeqeq": [2, "always"],
        "no-new-object": 2
    }
};
