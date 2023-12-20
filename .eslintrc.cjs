module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: 'eslint:recommended',
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    ignorePatterns: ['**/*.jpg', '**/*.jpeg', '**/*.json'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-var': 'error',
        indent: 'off',
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    },
};
