"use client";

import { getter, LocalBank, setter } from "@/cachier-api";


export class GlobalNMS extends LocalBank {

    private static data: boolean;
    protected static __name__ = "GlobalNMS";

    @setter
    static set(data: boolean): void {
        GlobalNMS.data = data;
    }

    @getter
    static get(): boolean {
        return GlobalNMS?.data;
    }
}