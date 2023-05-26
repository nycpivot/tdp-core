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

class ApiPage extends BasicPage {
  private readonly _overviewContents: ReactElement[];

  constructor() {
    super();
    this._overviewContents = [];
  }

  addOverviewContent(content: ReactElement) {
    this._overviewContents.push(content);
  }

  get overviewContents() {
    return this._overviewContents;
  }
}

export class EntityPageSurface {
  public static readonly id = 'EntityPageSurface';
  private readonly _overviewContent: ReactElement[];
  private readonly _componentPageCases: ReactElement[];
  private readonly _apiPage: ApiPage;
  private readonly _defaultPage: BasicPage;
  private readonly _domainPage: BasicPage;
  private readonly _groupPage: BasicPage;
  private readonly _servicePage: BasicPage;
  private readonly _systemPage: BasicPage;
  private readonly _userPage: BasicPage;
  private readonly _websitePage: BasicPage;
  private readonly _packagePage: BasicPage;

  public constructor() {
    this._overviewContent = [];

    this._componentPageCases = [];

    this._apiPage = new ApiPage();
    this._defaultPage = new BasicPage();
    this._domainPage = new BasicPage();
    this._groupPage = new BasicPage();
    this._servicePage = new BasicPage();
    this._systemPage = new BasicPage();
    this._userPage = new BasicPage();
    this._websitePage = new BasicPage();
    this._packagePage = new BasicPage();
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

  get websitePage() {
    return this._websitePage;
  }

  get packagePage() {
    return this._packagePage;
  }

  public addComponentPageCase(pageCase: ReactElement) {
    this._componentPageCases.push(pageCase);
  }

  public get componentPageCases(): ReactElement[] {
    return this._componentPageCases;
  }

  /**
   * @deprecated use apiPage
   */
  public addApiPageTab(tab: ReactElement) {
    this._apiPage.addTab(tab);
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
}
