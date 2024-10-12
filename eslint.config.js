import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    {
        ignores: ['dist/**/*'],
    },
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
            ...importPlugin.configs.recommended.rules,
            ...prettierPlugin.configs.recommended.rules,
            indent: ['error', 4],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'import/order': [
                'error',
                {
                    groups: [['builtin', 'external', 'internal']],
                    'newlines-between': 'always',
                },
            ],
            'prettier/prettier': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-undef': 'off',
            'import/no-unresolved': 'off',
            '@typescript-eslint/no-unsafe-declaration-merging': 'off',
        },
    },
];
