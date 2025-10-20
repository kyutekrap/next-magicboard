"use client";

import { ConditionModel } from "@/model/types";
import { getter, SessionBank, setter } from "@/cachier-api";


export class GlobalFilter extends SessionBank {

    private static data: Record<string, ConditionModel[]> = {};
    protected static __name__ = "GlobalFilter";

    @setter
    static set(data: Record<string, ConditionModel[]>): void {
        GlobalFilter.data = {...GlobalFilter.data, ...data};
    }

    @getter
    static get(): undefined | Record<string, ConditionModel[]> {
        return;
    }

    static find(pageId: string): ConditionModel[] {
        if (GlobalFilter?.data?.[pageId]) return GlobalFilter?.data?.[pageId];
        const response = GlobalFilter.get();
        if (response) GlobalFilter.data = response;
        return GlobalFilter?.data?.[pageId];
    }
}