import { GlobalStrings } from "@/model";

export function validateNumber(
    input: number, 
    max: number | undefined = undefined, 
    min: number | undefined = undefined,
    decimals: number | undefined = undefined
): string {
    const floatInput = typeof input === "string" ? parseFloat(input) : input;
    const stringInput = typeof input === "string" ? input : String(input);

    if (max && floatInput > max) return `${GlobalStrings.get("dashboard", "max").replace("{0}", max.toString())}`;
    if (min && floatInput < min) return `${GlobalStrings.get("dashboard", "min").replace("{0}", min.toString())}`;
    
    let maxDecimals = decimals ?? 6;
    const decimalIndex = stringInput.indexOf('.');
    if (decimalIndex !== -1 && stringInput.substring(decimalIndex + 1).length > maxDecimals) {
        return `${GlobalStrings.get("dashboard", "maxDecimals").replace("{0}", maxDecimals.toString())}`;
    }

    return "pass";
}