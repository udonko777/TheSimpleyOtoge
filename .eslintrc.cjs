module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": false,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": ['./tsconfig.json']
    },
    "ignorePatterns": [
        "/dist/**/*", // Ignore built files.
        "**/*.cjs",
    ],
    "rules": {
        "@typescript-eslint/strict-boolean-expressions": "error",
        "no-implicit-coercion": "error",
        "@typescript-eslint/restrict-plus-operands": [
            "error",
            {
                "allowBoolean": false,
                "allowNullish": false,
                "allowNumberAndString": false,
                "allowRegExp": false,
                "allowAny": false
            }
        ],
        "prefer-template": "error",
        "no-useless-concat": "error",

        "@typescript-eslint/switch-exhaustiveness-check": "error",
        
    }
};