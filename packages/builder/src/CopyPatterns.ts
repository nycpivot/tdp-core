export class CopyPatterns {
  private readonly _appConfigFile: string;
  private readonly _resolvePath: (file: string) => string;

  constructor(appConfigFile: string, pathResolver: (file: string) => string) {
    this._appConfigFile = appConfigFile;
    this._resolvePath = pathResolver;
  }

  get patterns() {
    return [
      {
        from: this._resolvePath('../app/.eslintrc.js'),
        to: 'packages/app/.eslintrc.js',
      },
      {
        from: this._resolvePath('../backend/.eslintrc.js'),
        to: 'packages/backend/.eslintrc.js',
      },
      {
        from: this._resolvePath('../app/public'),
        to: 'packages/app/public',
      },
      {
        from: this._resolvePath('../../package.json'),
        to: 'package.json',
      },
      {
        from: this._resolvePath('../../tsconfig.json'),
        to: 'tsconfig.json',
      },
      {
        from: this._resolvePath('../../backstage.json'),
        to: 'backstage.json',
      },
      {
        from: this._appConfigFile,
        to: 'app-config.yaml',
      },
    ];
  }
}
