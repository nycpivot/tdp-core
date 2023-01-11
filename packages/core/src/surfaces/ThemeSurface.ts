import { AppTheme } from '@backstage/core-plugin-api';

export class ThemeSurface {
  private _themes: AppTheme[];

  constructor() {
    this._themes = [];
  }

  public addTheme(theme: AppTheme) {
    this._themes.push(theme);
  }

  public themes(): AppTheme[] {
    return this._themes;
  }
}
