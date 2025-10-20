export class GlobalData {
    private static data: Record<string, Record<string, any>[]> = {};

    static set(pageId: string, newData: Record<string, any>[]) {
        GlobalData.data[pageId] = newData;
    }

    static get(pageId: string) {
        return GlobalData.data[pageId] ?? [];
    }

    static add(pageId: string, newData: Record<string, any>[]) {
        GlobalData.data[pageId] = [...GlobalData.data[pageId], ...newData];
    }
}