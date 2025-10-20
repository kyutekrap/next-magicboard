export function validateString(str: string | undefined | null): boolean {
    return str !== undefined && str !== null && str !== ""
}