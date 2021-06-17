module.exports = {
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        project: 'tsconfig.json',
        sourceType: 'module',
        createDefaultProgram: true,
    },
    'plugins': ['@typescript-eslint/eslint-plugin'],
    'extends': [
        'google',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'root': true,
    'env': {
        node: true,
        jest: true,
    },
    'rules': {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/quotes': ['error', 'single'],
        'no-extra-parens': 'error',
        'require-atomic-updates': 'error',
        'block-scoped-var': 'error',
        'default-param-last': 'error',
        'default-case-last': 'error',
        'eqeqeq': 'error',
        'no-lone-blocks': 'error',
        'no-return-await': 'error',
        'no-use-before-define': 'error',
        'block-spacing': 'error',
        // todo: FIX, see ShikimoriUser
        'camelcase': 'off',
        'function-call-argument-newline': ['error', 'consistent'],
        'max-len': ['error', {
            code: 120,
            tabWidth: 4,
        }],
        'no-inline-comments': 'error',
        'no-whitespace-before-property': 'error',
        'object-curly-spacing': ['error', 'always'],
        'operator-linebreak': ['error', 'after', {
            'overrides': {
                '?': 'before',
                ':': 'before',
            },
        }],
        'space-in-parens': ['error', 'never'],
        'no-duplicate-imports': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-rename': 'error',
        'indent': ['error', 4],
        'new-cap': 'off',
        'require-jsdoc': 'off',
    },
    'ignorePatterns': ['node_modules', 'dist'],
};
