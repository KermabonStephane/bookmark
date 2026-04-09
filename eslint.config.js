import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ["packages/**/*.ts", "packages/**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs["recommended"].rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      // Enforce no cross-layer imports: domain must not import from other packages
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@bookmark/application", "@bookmark/github-storage", "@bookmark/auth-*", "@bookmark/chrome-extension"],
              message: "Domain layer must not import from other layers.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/application/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@bookmark/github-storage", "@bookmark/auth-*", "@bookmark/chrome-extension"],
              message: "Application layer must not import from infrastructure or interface layers.",
            },
          ],
        },
      ],
    },
  },
];
