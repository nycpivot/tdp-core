import { ReactElement } from 'react';

export class SettingsTabsSurface {
  private readonly _tabs: ReactElement[];

  public constructor() {
    this._tabs = [];
  }

  public add(tab: ReactElement) {
    this._tabs.push(tab);
  }

  public get tabs(): ReactElement[] {
    return this._tabs;
  }
}
