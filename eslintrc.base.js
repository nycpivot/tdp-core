function createPackageConfig(dir) {
  return require('@backstage/cli/config/eslint-factory')(dir, {
    plugins: ['@esback'],
    rules: {
      '@esback/todo-format': 'error',
    },
  });
}

module.exports = createPackageConfig; // Alias
