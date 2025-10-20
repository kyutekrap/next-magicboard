"use client";

import { getter, LocalBank, setter } from "@/cachier-api";


export class GlobalEmail extends LocalBank {

    private static data: string;
    protected static __name__ = "GlobalEmail";

    @setter
    static set(data: string): void {
        GlobalEmail.data = data;
    }

    @getter
    static get(): string {
        return GlobalEmail?.data;
    }
}