module.exports = {
    extends: [
        'plugin:@thibaudcolas/eslint-plugin-cookbook/prettier',
        'plugin:compat/recommended',
    ],
    rules: {
        '@thibaudcolas/cookbook/prettier/prettier': 0,
    },
    settings: {
        polyfills: ['promises'],
    },
    env: {
        jest: true,
    },
};
