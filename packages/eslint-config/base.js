import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"

import js from "@eslint/js"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "prefer-const": "error",
      "no-unused-vars": "off",
      "object-shorthand": ["error", "always"],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            [
              "^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)",
            ],
            [
              "^react",
              "^next",
              "^\\w",
              "^@testing-library",
              "^@tanstack",
              "^@oy-alldev",
              "^@datadog",
              "^@braze",
              "^@amplitude",
              "^@hackler",
              "^@popperjs",
              "^@emotion",
            ],
            ["^@?\\w"],
            ["^\\u0000"],
            ["^\\."],
          ],
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-interface": [
        "error",
        {
          allowSingleExtends: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          additionalHooks: "useRecoilCallback",
        },
      ],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
]
