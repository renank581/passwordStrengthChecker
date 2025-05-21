import js from "@eslint/js";
import globals from "globals";
import pluginSecurity from "eslint-plugin-security";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
      security: pluginSecurity
    },
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginSecurity.configs.recommended.rules
    }
  }
]);
