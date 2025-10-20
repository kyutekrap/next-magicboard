export function joinList(list: any[] | undefined): string {
    if (list !== undefined || typeof list === 'object') {
        return list.join(",");
    }
    return '';
}