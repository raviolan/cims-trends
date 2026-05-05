import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        document: "readonly",
        FormData: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },
  },
];
