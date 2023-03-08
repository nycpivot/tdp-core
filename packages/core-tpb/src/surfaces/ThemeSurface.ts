import { AppTheme } from '@backstage/core-plugin-api';
import { ReactElement } from 'react';

export class ThemeSurface {
  private _themes: AppTheme[];
  private _rootBuilder: ((children: JSX.Element) => ReactElement) | undefined;

  constructor() {
    this._themes = [];
  }

  public addTheme(theme: AppTheme) {
    this._themes.push(theme);
  }

  public setRootBuilder(builder: (children: JSX.Element) => ReactElement) {
    this._rootBuilder = builder;
  }

  public rootBuilder(): ((children: JSX.Element) => ReactElement) | undefined {
    return this._rootBuilder;
  }

  public themes(): AppTheme[] {
    return this._themes;
  }

  isNotConfigured() {
    return this._themes.length === 0 || !this._rootBuilder;
  }
}
