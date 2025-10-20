export function trimString(str: string | undefined, trimTo: number = 100): string {
    if (str !== undefined && typeof str === "string") {
        if (str.length <= trimTo) {
            return str;
        }
        return str.slice(0, trimTo) + '...';
    }
    return '';
}