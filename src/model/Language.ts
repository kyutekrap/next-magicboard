"use client";

import type { LanguageKey } from "@/asset/language";
import { getter, LocalBank, setter } from "@/cachier-api";


export class GlobalLanguage extends LocalBank {

    private static data: LanguageKey;
    protected static __name__ = "GlobalLanguage";

    @setter
    static set(data: LanguageKey): void {
        GlobalLanguage.data = data;
    }

    @getter
    static get(): LanguageKey {
        return GlobalLanguage?.data;
    }
}