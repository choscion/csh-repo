import { config as reactConfig } from "@choscion/eslint-config/react-internal";

// 모든 워크스페이스에 공통 적용
export default [
  ...reactConfig,
  { ignores: ["dist/**"] },{
        rules: {
            'unicorn/prefer-module': 'off',
            'unicorn/prevent-abbreviations': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            'sonarjs/no-nested-conditional': 'off',
        },
    },
];
