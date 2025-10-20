import { LanguageKey } from "@/asset/language";
import * as strings from "@/asset/strings";
import { GlobalLanguage } from "./Language";

type routeKey = "dashboard" | "error";

export class GlobalStrings {
    private static strings: Record<routeKey, Record<string, string>>;

    static getAll(route: routeKey): Record<string, string> {
        if (GlobalStrings.strings) return GlobalStrings.strings[route];

        const language: LanguageKey = GlobalLanguage.get();
        switch (language) {
            case "en-US":
                GlobalStrings.strings = strings.en;
                break;
            default:
                GlobalStrings.strings = strings.en;
                break;
        }
        return GlobalStrings.strings[route];
    }

    static get(route: routeKey, key: string): string {
        if (GlobalStrings.strings) return GlobalStrings.strings[route]?.[key] ?? "";

        return GlobalStrings.getAll(route)?.[key] ?? "";
    }
}