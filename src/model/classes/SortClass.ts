export class SortClass {
    sorting: 1 | -1;
    key: string;

    constructor()
    constructor(sorting: 1 | -1, key: string)

    constructor(sorting?: 1 | -1, key?: string) {
        this.sorting = sorting ?? -1;
        this.key = key ?? "Created On";
    }
}