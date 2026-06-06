import globals from "globals";

export default [
  {
    ignores: ["assets/js/bootstrap.min.js"],
  },
  {
    files: ["assets/js/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.jquery,
        module: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none" }],
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
    },
  },
];
