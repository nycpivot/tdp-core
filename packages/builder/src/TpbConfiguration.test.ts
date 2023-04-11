import { TpbConfiguration } from './TpbConfiguration';
import * as path from 'path';

describe('TPB configuration', () => {
  it('resolves plugin versions', () => {
    const config = {
      app: {
        theme: {
          name: 'theme',
          stylesheet: 'theme.css',
        },
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
      theme: '5',
    };

    const tpbConfig = new TpbConfiguration(config, name => versions[name]);

    const resolvedConfig = tpbConfig.resolve();

    expect(resolvedConfig).toEqual({
      app: {
        theme: {
          name: 'theme',
          version: '5',
          stylesheet: 'theme.css',
        },
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

  it('caches the version', () => {
    const calls = {
      count: 0,
    };
    const config = {
      app: {
        plugins: [{ name: 'bar' }],
      },
      backend: {
        plugins: [],
      },
    };
    const tpbConfig = new TpbConfiguration(config, () => {
      calls.count++;
      return 'foo';
    });

    tpbConfig.resolve();
    tpbConfig.resolve();

    expect(calls.count).toEqual(1);
  });

  it('generates content from a template', () => {
    const config = {
      app: {
        plugins: [{ name: 'foo' }],
      },
      backend: {
        plugins: [{ name: 'bar' }],
      },
    };
    const tpbConfig = new TpbConfiguration(config, name => '1');
    const generated = tpbConfig.generate(
      'hello {{app.plugins.0.name}} and {{backend.plugins.0.name}}',
    );

    expect(generated).toEqual('hello foo and bar');
  });
});
