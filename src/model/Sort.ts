"use client";

import { getter, SessionBank, setter } from "@/cachier-api";
import type { SortModel } from "./types";


export class GlobalSort extends SessionBank {

    private static data: Record<string, SortModel> = {};
    protected static __name__ = "GlobalSort";

    @setter
    static set(data: Record<string, SortModel>): void {
        GlobalSort.data = {...GlobalSort.data, ...data};
    }

    @getter
    static get(): undefined | Record<string, SortModel> {
        return;
    }

    static find(pageId: string): SortModel {
        if (GlobalSort?.data?.[pageId]) return GlobalSort?.data?.[pageId];
        const response = GlobalSort.get();
        if (response) GlobalSort.data = response;
        return GlobalSort?.data?.[pageId];
    }
}