import { ReactElement } from "react";

export class EntityPageSurface {
    private readonly _servicePageTabs: ReactElement[]

    public constructor() {
        this._servicePageTabs = []
    }

    public addServicePageTab(tab: ReactElement) {
        this._servicePageTabs.push(tab)
    }

    public get servicePageTabs(): ReactElement[] {
        return this._servicePageTabs
    }
}