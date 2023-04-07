import { TpbConfiguration } from './TpbConfiguration';

describe('TPB configuration', () => {
  it('resolves plugin versions', () => {
    const config = {
      app: {
        plugins: [
          {
            name: 'appPlugin1',
          },
          {
            name: 'appPlugin2',
          },
        ],
      },
      backend: {
        plugins: [
          {
            name: 'backendPlugin1',
          },
          {
            name: 'backendPlugin2',
          },
        ],
      },
    };

    const versions = {
      appPlugin1: '1',
      appPlugin2: '2',
      backendPlugin1: '3',
      backendPlugin2: '4',
    };

    const tpbConfig = new TpbConfiguration(config, name => versions[name]);

    const resolvedConfig = tpbConfig.resolve();

    expect(resolvedConfig).toEqual({
      app: {
        plugins: [
          {
            name: 'appPlugin1',
            version: '1',
          },
          {
            name: 'appPlugin2',
            version: '2',
          },
        ],
      },
      backend: {
        plugins: [
          {
            name: 'backendPlugin1',
            version: '3',
          },
          {
            name: 'backendPlugin2',
            version: '4',
          },
        ],
      },
    });
  });
});
