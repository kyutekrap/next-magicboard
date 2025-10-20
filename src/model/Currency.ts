import { CurrencyKey } from "@/asset/currency";

export class GlobalCurrency {
    private static data: Record<CurrencyKey, string>;

    static async get(currency: CurrencyKey): Promise<string> {
        if (GlobalCurrency.data && GlobalCurrency.data[currency]) return GlobalCurrency.data[currency];

        GlobalCurrency.data = (await import("@/asset/currency/currency.json")).default;
        return GlobalCurrency.data[currency] ?? "$";
    }

    static async getAll(): Promise<Record<CurrencyKey, string>> {
        if (GlobalCurrency.data) return GlobalCurrency.data;

        GlobalCurrency.data = (await import("@/asset/currency/currency.json")).default;
        return GlobalCurrency.data;
    }
}