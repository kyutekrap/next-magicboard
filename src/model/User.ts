"use client";

import { getter, LocalBank, setter } from "@/cachier-api";


export class GlobalUser extends LocalBank {

    private static data: string;
    protected static __name__ = "GlobalUser";

    @setter
    static set(data: string): void {
        GlobalUser.data = data;
    }

    @getter
    static get(): string {
        return GlobalUser?.data;
    }
}