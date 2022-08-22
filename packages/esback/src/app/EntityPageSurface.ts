import { ReactElement } from "react";

export class EntityPageSurface {
    private readonly _overviewContent: ReactElement[]

    private readonly _apiPageTabs: ReactElement[]
    private readonly _componentPageCases: ReactElement[]
    private readonly _defaultPageTabs: ReactElement[]
    private readonly _domainPageTabs: ReactElement[]
    private readonly _groupPageTabs: ReactElement[]
    private readonly _servicePageTabs: ReactElement[]
    private readonly _systemPageTabs: ReactElement[]
    private readonly _userPageTabs: ReactElement[]
    private readonly _websitePageTabs: ReactElement[]

    public constructor() {
        this._overviewContent = []

        this._apiPageTabs = []
        this._componentPageCases = []
        this._defaultPageTabs = []
        this._domainPageTabs = []
        this._groupPageTabs = []
        this._servicePageTabs = []
        this._systemPageTabs = []
        this._userPageTabs = []
        this._websitePageTabs = []
    }

    public addOverviewContent(content: ReactElement) {
        this._overviewContent.push(content)
    }

    public addApiPageTab(tab: ReactElement) {
        this._apiPageTabs.push(tab)
    }

    public addComponentPageCase(tab: ReactElement) {
        this._componentPageCases.push(tab)
    }

    public addDefaultPageTab(tab: ReactElement) {
        this._defaultPageTabs.push(tab)
    }

    public addDomainPageTab(tab: ReactElement) {
        this._domainPageTabs.push(tab)
    }

    public addGroupPageTab(tab: ReactElement) {
        this._groupPageTabs.push(tab)
    }

    public addServicePageTab(tab: ReactElement) {
        this._servicePageTabs.push(tab)
    }

    public addSystemPageTab(tab: ReactElement) {
        this._systemPageTabs.push(tab)
    }

    public addUserPageTab(tab: ReactElement) {
        this._userPageTabs.push(tab)
    }

    public addWebsitePageTab(tab: ReactElement) {
        this._websitePageTabs.push(tab)
    }

    public get overviewContent(): ReactElement[] {
        return this._overviewContent
    }

    public get apiPageTabs(): ReactElement[] {
        return this._apiPageTabs
    }

    public get componentPageCases(): ReactElement[] {
        return this._componentPageCases
    }

    public get defaultPageTabs(): ReactElement[] {
        return this._defaultPageTabs
    }

    public get domainPageTabs(): ReactElement[] {
        return this._domainPageTabs
    }

    public get groupPageTabs(): ReactElement[] {
        return this._groupPageTabs
    }

    public get servicePageTabs(): ReactElement[] {
        return this._servicePageTabs
    }

    public get systemPageTabs(): ReactElement[] {
        return this._systemPageTabs
    }

    public get userPageTabs(): ReactElement[] {
        return this._userPageTabs
    }

    public get websitePageTabs(): ReactElement[] {
        return this._websitePageTabs
    }
}