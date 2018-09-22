module.exports = {
    rules: {
        'no-alert': [0],
        '@thibaudcolas/cookbook/import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: true,
            },
        ],
    },
};
