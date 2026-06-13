const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    files: ["calculator/assets/js/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.jquery,
        ...globals.node,
        module: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none" }],
      "no-console": "warn",
      "no-undef": "error",
      "no-eval": "warn",
      "no-unreachable": "warn",
      "no-constant-condition": "warn",
      "no-irregular-whitespace": "error",
      "no-trailing-spaces": "warn",
      semi: ["warn", "always"],
      "no-extra-semi": "warn",
      curly: "warn",
      eqeqeq: ["warn", "smart"],
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
  {
    files: ["calculator/assets/js/__tests__/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        module: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none" }],
      "no-console": "warn",
      "no-undef": "error",
    },
  },
  {
    ignores: [
      "calculator/assets/js/bootstrap.min.js",
      "node_modules/**",
    ],
  },
];
