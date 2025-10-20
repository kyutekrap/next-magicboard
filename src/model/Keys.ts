import { KeyModel } from "@/model/types";

export class GlobalKeys {
    private static data: Record<string, KeyModel[]> = {};

    static set(pageId: string, newKeys: KeyModel[]) {
        GlobalKeys.data[pageId] = newKeys;
    }

    static get(pageId: string): KeyModel[] {
        return GlobalKeys.data?.[pageId];
    }
}