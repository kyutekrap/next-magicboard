import { validateString } from "./validateString";

export function validateAllKeys(record: Record<string, any>): boolean {
    return Object.values(record).every(v => validateString(v));
}