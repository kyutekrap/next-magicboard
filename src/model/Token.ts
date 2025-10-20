"use client";

import { getter, LocalBank, setter } from "@/cachier-api";


export class GlobalToken extends LocalBank {

    private static data: string;
    protected static __name__ = "GlobalToken";

    @setter
    static set(data: string): void {
        GlobalToken.data = data;
    }

    @getter
    static get(): string {
        return GlobalToken?.data;
    }
}