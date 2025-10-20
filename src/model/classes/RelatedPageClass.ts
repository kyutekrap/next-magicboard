export class RelatedPageClass {
    _id: string;
    visibility: boolean;
    keys: string[];

    constructor()
    constructor(_id: string, visibility: boolean, keys: string[]);

    constructor(_id?: string, visibility?: boolean, keys?: string[]) {
        this._id = _id ?? "";
        this.visibility = visibility ?? false;
        this.keys = keys ?? [];
    }
}