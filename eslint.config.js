import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

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
        },
        rules: {
            ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
            ...importPlugin.configs.recommended.rules,
            'import/order': [
                'error',
                {
                    groups: [['builtin', 'external', 'internal']],
                    'newlines-between': 'always',
                },
            ],
            '@typescript-eslint/n o-explicit-any': 'off',
            'no-undef': 'off',
            'import/no-unresolved': 'off',
            '@typescript-eslint/no-unsafe-declaration-merging': 'off',
        },
    },
];
