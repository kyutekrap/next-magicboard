import { KeyModel, ConditionModel } from "@/model/types";
import { stringifyConditions } from "./stringifyConditions";
import { validateString } from "./validateString";

const operators: Record<string, string> = {
    "=": "===",
    "!=": "!==",
    "is": "===",
    "is not": "!=="
};

export function isActiveKey(data: Record<string, any>, keys: KeyModel[], index: number): boolean {
    const key = keys[index];
    if (key?.active_if === undefined || key?.active_if?.length === 0) return false;

    const groupedConditions: Record<string, ConditionModel[]> = {};
    key["active_if"].forEach(condition => {
        if (!groupedConditions[condition["key"]]) {
            groupedConditions[condition["key"]] = [];
        }
        groupedConditions[condition["key"]].push(condition);
    });

    return Object.keys(groupedConditions).every(key_name => {
        return groupedConditions[key_name].some(condition => {
            const type = keys.find(key => key.name === key_name)?.readable_dtype;
            if (!validateString(type)) return false;

            var key = "";
            switch (type) {
                case "Reference":
                    key = data?.[key_name]?.name;
                    break;
                case "Conditions":
                    key = stringifyConditions(data[key_name]);
                    break;
                default:
                    key = data?.[key_name];
                    break;
            }
            if (!validateString(key)) return false;

            const operator = condition["operator"];
            const value = condition["value"];
            if (operator === "has") {
                return key.includes(value);
            } else {
                if (typeof key === 'string') {
                    return eval(`'${key}' ${operators?.[operator] ?? operator} '${value}'`);
                } else {
                    return eval(`${key} ${operators?.[operator] ?? operator} ${value}`);
                }
            }
        });
    });
}