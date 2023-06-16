import { YarnResolver } from './YarnResolver';

describe('Yarn resolver', () => {
  it('reads the configuration', () => {
    const resolver = new YarnResolver('foo', 'bundle/.yarnrc.verdaccio');
    const configuration = resolver.configuration();
    expect(configuration.content).toContain('registry "http://localhost:4873"');
    expect(configuration.file).toEqual('.yarnrc');
  });
});
