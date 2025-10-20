import { toTimestamp } from "./toTimestamp";
import { KeyModel } from "@/model/types";

export function parseData(keys: KeyModel[], payload: Record<string, any>): Record<string, any> {
    const allKeys = keys.map(k => k.name);
    const dataKeys = Object.keys(payload);
    const response: Record<string, any> = {};
    if (payload?._id !== undefined) response["_id"] = payload?._id;

    dataKeys.map(k => {
        if (!allKeys.includes(k)) return;
        const type = keys.find((key) => key.name === k)?.readable_dtype;

        if (type === "Date & Time" || type === "Date") { response[k] = toTimestamp(payload[k]); return; }
        else { response[k] = payload[k] }
    });

    return response;
}