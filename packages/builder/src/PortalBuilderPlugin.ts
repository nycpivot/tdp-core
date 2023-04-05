export class PortalBuilderPlugin {
  apply(compiler) {
    compiler.hooks.done.tapAsync({
      name: 'Tanzu Portal Builder Plugin'
    }, (stats, callback) => {
      const outputFolder = compiler.options.output.path;


      callback()
    });
  }
}
