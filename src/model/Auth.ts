"use client";

import { SessionBank, getter, setter } from "@/cachier-api";

export class GlobalAuth extends SessionBank {

    protected static __name__ = "GlobalAuth";
    private static data: string;

    @setter
    static set(data: string): void {
        GlobalAuth.data = data;
    }

    @getter
    static get(): string {
        return GlobalAuth?.data;
    }
}