export function toFloat(numStr: string): number {
    const cleanedStr = numStr.replace(/,/g, '');
    return parseFloat(cleanedStr);
}