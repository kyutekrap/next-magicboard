import { ConditionModel } from "@/model/types";

export function stringifyConditions(conditions: ConditionModel[]): string {
    if (!conditions || conditions.length === 0) return "";

    const response: string[] = [];
    conditions.map((search) => {
        if (typeof search["value"] === "string") {
            response.push(`${search["key"]} ${search["operator"]} ${search["value"]}`);
        } else {
            response.push(`${search["key"]} ${search["operator"]} ${search["value"]["name"]}(${search["value"]["_id"]})`);
        }
    });
    return response.join(',\n');
}