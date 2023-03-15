function createPackageConfig(dir) {
  return require('@backstage/cli/config/eslint-factory')(dir, {
    plugins: ['@tpb'],
    rules: {
      '@tpb/todo-format': 'error',
    },
  });
}

module.exports = createPackageConfig; // Alias
