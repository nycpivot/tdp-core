import fs from 'fs';
import path from 'path';
import { generate, prepareContents } from './FileContents';
import { PluginsResolver } from './Registry';

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

      const preparedTemplates = prepareContents(
        path.join(path.dirname(__filename), '../bundle'),
        new PluginsResolver(tpbConfig, () => '1.0.0', 'verdaccio'),
      );
      const fileNames = preparedTemplates.map(pt => pt.file);

      expect(fileNames).toHaveLength(5);
      expect(fileNames).toContain('packages/app/package.json');
      expect(fileNames).toContain('packages/app/src/index.ts');
      expect(fileNames).toContain('packages/backend/package.json');
      expect(fileNames).toContain('packages/backend/src/index.ts');
      expect(fileNames).toContain('.yarnrc');
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
