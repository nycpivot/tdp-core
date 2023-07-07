import { ReactElement } from 'react';

export class HomeSurface {
  public static readonly id = 'HomeSurface';
  private readonly _homeWidgets: ReactElement[];
  private readonly _homeContent: ReactElement[];

  constructor() {
    this._homeWidgets = [];
    this._homeContent = [];
  }

  public addWidget(item: ReactElement) {
    this._homeWidgets.push(item);
  }

  public addContent(item: ReactElement) {
    this._homeContent.push(item);
  }

  public get widgets(): ReactElement[] {
    return this._homeWidgets;
  }

  public get content(): ReactElement[] {
    return this._homeContent;
  }
}
