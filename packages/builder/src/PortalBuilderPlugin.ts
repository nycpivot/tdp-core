export class PortalBuilderPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Tanzu Portal Builder Plugin', () => {
      console.log('building Tanzu Portal Builder!');
    });
  }
}
