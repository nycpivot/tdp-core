function createPackageConfig(dir) {
    return require('@backstage/cli/config/eslint-factory')(dir, {
        plugins: ['todo-format'],
        rules: {
            'todo-format/todo-format': 'error',
        },
    });
}

module.exports = createPackageConfig; // Alias