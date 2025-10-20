"use client";

import { getter, SessionBank, setter } from "@/cachier-api";
import { RelatedPageModel } from "./types";


export class GlobalPageLayout extends SessionBank {

    private static data: Record<string, RelatedPageModel[]> = {};
    protected static __name__ = "GlobalPageLayout";

    @setter
    static set(data: Record<string, RelatedPageModel[]>): void {
        GlobalPageLayout.data = {...GlobalPageLayout.data, ...data};
    }

    @getter
    static get(): undefined | Record<string, RelatedPageModel[]> {
        return;
    }

    static find(pageId: string): RelatedPageModel[] {
        if (GlobalPageLayout?.data?.[pageId]) return GlobalPageLayout?.data?.[pageId];
        const response = GlobalPageLayout.get();
        if (response) GlobalPageLayout.data = response;
        return GlobalPageLayout?.data?.[pageId];
    }
}