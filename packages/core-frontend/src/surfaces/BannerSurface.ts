import { ReactElement } from 'react';

export class BannerSurface {
  public static readonly id = 'BannerSurface';
  private readonly _banners: ReactElement[];

  public constructor() {
    this._banners = [];
  }

  public add(banner: ReactElement) {
    this._banners.push(banner);
  }

  public get banners(): ReactElement[] {
    return this._banners;
  }
}
