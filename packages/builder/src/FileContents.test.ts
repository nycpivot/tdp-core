import fs from 'fs';
import path from 'path';
import { generate, buildContents } from './FileContents';
import { PluginsResolver } from './PluginsResolver';

function readFileContent(filePath: string) {
  return fs.readFileSync(path.resolve(__dirname, filePath)).toString();
}

describe('File Contents', () => {
  describe('preparation', () => {
    it('calculates output file paths', () => {
      const tpbConfig = {
        app: {
          plugins: [],
        },
        backend: {
          plugins: [],
        },
      };

      const preparedTemplates = buildContents(
        path.join(path.dirname(__filename), '../bundle'),
        new PluginsResolver(tpbConfig, {
          resolve: () => '1.0.0',
          configuration: () => ({
            file: '.yarnrc',
            content: 'lorem ipsum',
          }),
        }),
      );
      const fileNames = preparedTemplates.map(pt => pt.file);

      expect(fileNames).toHaveLength(6);
      expect(fileNames).toContain('packages/app/package.json');
      expect(fileNames).toContain('packages/app/src/index.ts');
      expect(fileNames).toContain('packages/backend/package.json');
      expect(fileNames).toContain('packages/backend/src/index.ts');
      expect(fileNames).toContain('package.json');
      expect(fileNames).toContain('.yarnrc');
    });
  });

  describe('root', () => {
    it('includes local packages', () => {
      const config = {
        app: {
          plugins: [
            {
              name: 'app_plugin1',
              version: '1.1.1',
              local: true,
              localPath: '/foo/bar',
            },
            {
              name: 'app_plugin2',
              version: '2.2.2',
            },
          ],
        },
        backend: {
          plugins: [
            {
              name: 'backend_plugin1',
              version: '1.1.1',
              local: true,
              localPath: '/bar/foo',
            },
            {
              name: 'backend_plugin2',
              version: '2.2.2',
            },
          ],
        },
      };

      const got = generate(
        readFileContent('../bundle/package.json.hbs'),
        config,
      );

      expect(got).toContain('"/foo/bar",');
      expect(got).toContain('"/bar/foo",');
    });
  });

  describe('app templates', () => {
    it('generates package.json', () => {
      const config = {
        app: {
          plugins: [
            {
              name: 'app_plugin1',
              version: '1.1.1',
            },
            {
              name: 'app_plugin2',
              version: '2.2.2',
            },
          ],
        },
      };

      const got = generate(
        readFileContent('../bundle/packages/app/package.json.hbs'),
        config,
      );

      expect(got).toContain('"app_plugin1": "1.1.1"');
      expect(got).toContain('"app_plugin2": "2.2.2"');
    });

    it('generates index.ts', () => {
      const config = {
        app: {
          plugins: [
            {
              name: 'app_plugin1',
              version: '1.1.1',
            },
            {
              name: 'app_plugin2',
              version: '2.2.2',
            },
          ],
        },
      };

      const got = generate(
        readFileContent('../bundle/packages/app/src/index.ts.hbs'),
        config,
      );

      expect(got).toContain("import { plugin as plugin0 } from 'app_plugin1';");
      expect(got).toContain("import { plugin as plugin1 } from 'app_plugin2';");
      expect(got).toContain('plugin0(),');
      expect(got).toContain('plugin1(),');
    });
  });

  describe('backend templates', () => {
    it('generates package.json', () => {
      const config = {
        backend: {
          plugins: [
            {
              name: 'backend_plugin1',
              version: '1.1.1',
            },
            {
              name: 'backend_plugin2',
              version: '2.2.2',
            },
          ],
        },
      };

      const got = generate(
        readFileContent('../bundle/packages/backend/package.json.hbs'),
        config,
      );

      expect(got).toContain('"backend_plugin1": "1.1.1"');
      expect(got).toContain('"backend_plugin2": "2.2.2"');
    });

    it('generates index.ts', () => {
      const config = {
        backend: {
          plugins: [
            {
              name: 'backend_plugin1',
              version: '1.1.1',
            },
            {
              name: 'backend_plugin2',
              version: '2.2.2',
            },
          ],
        },
      };

      const got = generate(
        readFileContent('../bundle/packages/backend/src/index.ts.hbs'),
        config,
      );

      expect(got).toContain(
        "import { plugin as plugin0 } from 'backend_plugin1';",
      );
      expect(got).toContain(
        "import { plugin as plugin1 } from 'backend_plugin2';",
      );
      expect(got).toContain('plugin0(),');
      expect(got).toContain('plugin1(),');
    });
  });
});
