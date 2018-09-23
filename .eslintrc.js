module.exports = {
    extends: [
        'plugin:@thibaudcolas/eslint-plugin-cookbook/recommended',
        'plugin:compat/recommended',
    ],
    settings: {
        polyfills: ['promises'],
    },
    env: {
        jest: true,
    },
};
