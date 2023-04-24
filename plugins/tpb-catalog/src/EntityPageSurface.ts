import { ReactElement } from 'react';

class BasicPage {
  private readonly _tabs: ReactElement[];

  constructor() {
    this._tabs = [];
  }

  addTab(tab: ReactElement) {
    this._tabs.push(tab);
  }

  get tabs() {
    return this._tabs;
  }
}

export class EntityPageSurface {
  private readonly _overviewContent: ReactElement[];
  private readonly _componentPageCases: ReactElement[];
  private readonly _apiPage: BasicPage;
  private readonly _defaultPage: BasicPage;
  private readonly _domainPage: BasicPage;
  private readonly _groupPage: BasicPage;
  private readonly _servicePage: BasicPage;
  private readonly _systemPage: BasicPage;
  private readonly _userPage: BasicPage;
  private readonly _websitePage: BasicPage;

  public constructor() {
    this._overviewContent = [];

    this._componentPageCases = [];

    this._apiPage = new BasicPage();
    this._defaultPage = new BasicPage();
    this._domainPage = new BasicPage();
    this._groupPage = new BasicPage();
    this._servicePage = new BasicPage();
    this._systemPage = new BasicPage();
    this._userPage = new BasicPage();
    this._websitePage = new BasicPage();
  }

  public addOverviewContent(content: ReactElement) {
    this._overviewContent.push(content);
  }

  get apiPage() {
    return this._apiPage;
  }

  get defaultPage() {
    return this._defaultPage;
  }

  get domainPage() {
    return this._domainPage;
  }

  get groupPage() {
    return this._groupPage;
  }

  get servicePage() {
    return this._servicePage;
  }

  get systemPage() {
    return this._systemPage;
  }

  get userPage() {
    return this._userPage;
  }

  get webistePage() {
    return this._websitePage;
  }

  public addApiPageTab(tab: ReactElement) {
    this._apiPage.addTab(tab);
  }

  public addComponentPageCase(pageCase: ReactElement) {
    this._componentPageCases.push(pageCase);
  }

  /**
   * @deprecated use defaultPage
   */
  public addDefaultPageTab(tab: ReactElement) {
    this._defaultPage.addTab(tab);
  }

  /**
   * @deprecated use domainPage
   */
  public addDomainPageTab(tab: ReactElement) {
    this._domainPage.addTab(tab);
  }

  /**
   * @deprecated use groupPage
   */
  public addGroupPageTab(tab: ReactElement) {
    this._groupPage.addTab(tab);
  }

  /**
   * @deprecated use servicePage
   */
  public addServicePageTab(tab: ReactElement) {
    this._servicePage.addTab(tab);
  }

  /**
   * @deprecated use systemPage
   */
  public addSystemPageTab(tab: ReactElement) {
    this._systemPage.addTab(tab);
  }

  /**
   * @deprecated use userPage
   */
  public addUserPageTab(tab: ReactElement) {
    this._userPage.addTab(tab);
  }

  /**
   * @deprecated use websitePage
   */
  public addWebsitePageTab(tab: ReactElement) {
    this._websitePage.addTab(tab);
  }

  public get overviewContent(): ReactElement[] {
    return this._overviewContent;
  }

  public get apiPageTabs(): ReactElement[] {
    return this._apiPage.tabs;
  }

  public get componentPageCases(): ReactElement[] {
    return this._componentPageCases;
  }

  public get defaultPageTabs(): ReactElement[] {
    return this._defaultPage.tabs;
  }

  public get domainPageTabs(): ReactElement[] {
    return this._domainPage.tabs;
  }

  public get groupPageTabs(): ReactElement[] {
    return this._groupPage.tabs;
  }

  public get servicePageTabs(): ReactElement[] {
    return this._servicePage.tabs;
  }

  public get systemPageTabs(): ReactElement[] {
    return this._systemPage.tabs;
  }

  public get userPageTabs(): ReactElement[] {
    return this._userPage.tabs;
  }

  public get websitePageTabs(): ReactElement[] {
    return this._websitePage.tabs;
  }
}
