// const base = require('@thibaudcolas/eslint-plugin-cookbook/src/prettier.json');
// delete base.filePath;
// delete base.baseDirectory;

// module.exports = base;

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
