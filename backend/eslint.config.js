import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{ ignores: ["dist/**"] },
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: globals.browser },
	},
	tseslint.configs.recommended,
	{
		rules: {
			"@typescript-eslint/no-empty-object-type": "off",
			"no-empty-pattern": "off",
			"react-refresh/only-export-components": "off",
		},
	},
]);
