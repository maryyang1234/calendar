// https://github.com/facebook/create-react-app/blob/9750738cce89a967cc71f28390daf5d4311b193c/packages/eslint-config-react-app/index.js

module.exports = {
    root: true,
    parser: 'babel-eslint',
    plugins: ['import', 'flowtype', 'jsx-a11y', 'react', 'react-hooks', 'prettier'],
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jest: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    rules: {
        'prettier/prettier': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error'
    },
    overrides: [
        {
            files: ['**/*.ts?(x)'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                },
                warnOnUnsupportedTypeScriptVersion: true
            },
            plugins: ['react', '@typescript-eslint'],
            extends: [
                'eslint:recommended',
                'plugin:react/recommended',
                'plugin:react-hooks/recommended',
                'plugin:@typescript-eslint/recommended'
            ],
            rules: {
                '@typescript-eslint/explicit-module-boundary-types': 0
            }
        }
    ],
    settings: {
        react: {
            version: '16'
        }
    }
};
