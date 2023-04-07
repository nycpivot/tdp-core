import { TpbConfiguration } from './TpbConfiguration';

describe('TPB configuration', () => {
  it('resolves app plugin versions', () => {
    const config = {
      app: {
        plugins: [
          {
            name: 'plugin1',
          },
          {
            name: 'plugin2',
          },
        ],
      },
    };

    const versions = { plugin1: '1', plugin2: '2' };
    const tpbConfig = new TpbConfiguration(config, name => versions[name]);
    const resolvedConfig = tpbConfig.resolve();
    expect(resolvedConfig).toEqual({
      app: {
        plugins: [
          {
            name: 'plugin1',
            version: '1',
          },
          {
            name: 'plugin2',
            version: '2',
          },
        ],
      },
    });
  });
});
