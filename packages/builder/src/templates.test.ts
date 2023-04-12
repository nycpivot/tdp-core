import * as fs from 'fs';
import * as path from 'path';
import { compile } from 'handlebars';

const generate = (templateString: string, config: any) => {
  return compile(templateString)(config);
};

function readFileContent(filePath: string) {
  return fs.readFileSync(path.resolve(__dirname, filePath)).toString();
}

describe('Templates', () => {
  describe('app', () => {
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
        readFileContent('assets/packages/app/package.json.hbs'),
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
        readFileContent('assets/packages/app/src/index.ts.hbs'),
        config,
      );

      expect(got).toContain("import { plugin as plugin0 } from 'app_plugin1';");
      expect(got).toContain("import { plugin as plugin1 } from 'app_plugin2';");
      expect(got).toContain('plugin0(),');
      expect(got).toContain('plugin1(),');
    });
  });

  describe('backend', () => {
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
        readFileContent('assets/packages/backend/package.json.hbs'),
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
        readFileContent('assets/packages/backend/src/index.ts.hbs'),
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
