import { ReactElement } from "react";

export class EntityPageSurface {
    private readonly _overviewContent: ReactElement[]
    private readonly _servicePageTabs: ReactElement[]

    public constructor() {
        this._overviewContent = []
        this._servicePageTabs = []
    }

    public addOverviewContent(content: ReactElement) {
        this._overviewContent.push(content)
    }

    public addServicePageTab(tab: ReactElement) {
        this._servicePageTabs.push(tab)
    }

    public get overviewContent(): ReactElement[] {
        return this._overviewContent
    }

    public get servicePageTabs(): ReactElement[] {
        return this._servicePageTabs
    }
}