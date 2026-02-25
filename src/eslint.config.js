
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".history/**",
      "node_modules/**",
      "build/**",
      "dist/**",
      ".next/**",
      "coverage/**",
      "src/vite-env.d.ts",
      "src/OktaLogin/**",
      ".eslintrc.js",
      "__mocks__/",
      "env.node.ts",
      "env.ts",
      "env.ts",
      "env.vite.ts",
      "eslint.config.js",
      "jest.config.js",
      "vite-env.d.ts",
      "vite.config.ts",
      "eslint-formatters/",
      "src/constants/formFields/util/FieldLength.ts",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
);