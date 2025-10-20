import { LanguageKey } from "@/asset/language";
import { GlobalLanguage } from "./Language";
import * as strings from "@/asset/strings/guest"

export class GuestStrings {
    private static strings: Record<string, string>;

    static getAll(): Record<string, string> {
        if (GuestStrings.strings) return GuestStrings.strings;

        const language: LanguageKey = GlobalLanguage.get();
        switch (language) {
            case "en-US":
                GuestStrings.strings = strings.en;
                break;
            default:
                GuestStrings.strings = strings.en;
                break;
        }
        return GuestStrings.strings;
    }

    static get(key: string): string {
        if (GuestStrings.strings) return GuestStrings.strings?.[key] ?? "";

        return GuestStrings.getAll()?.[key] ?? "";
    }
}