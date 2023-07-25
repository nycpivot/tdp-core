import { LayoutConfiguration } from '@backstage/plugin-home';
import { ReactElement } from 'react';

export class HomeSurface {
  public static readonly id = 'HomeSurface';
  private readonly _homeWidgets: ReactElement[];
  private readonly _homeContent: ReactElement[];
  private readonly _widgetConfigs: LayoutConfiguration[];

  constructor() {
    this._homeWidgets = [];
    this._homeContent = [];
    this._widgetConfigs = [];
  }

  public addWidget(item: ReactElement, config?: LayoutConfiguration) {
    this._homeWidgets.push(item);

    if (config) {
      this._widgetConfigs.push(config);
    }
  }

  public addContent(item: ReactElement) {
    this._homeContent.push(item);
  }

  public addWidgetConfig(config: LayoutConfiguration) {
    this._widgetConfigs.push(config);
  }

  public get widgets(): ReactElement[] {
    return this._homeWidgets;
  }

  public get content(): ReactElement[] {
    return this._homeContent;
  }

  public get widgetConfigs(): LayoutConfiguration[] {
    return this._widgetConfigs;
  }
}
