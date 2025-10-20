export class ReferenceClass {
    _id: string;
    name: string;

    constructor()
    constructor(id: string, name: string)

    constructor(id?: string, name?: string) {
        this._id = id ?? "";
        this.name = name ?? "";
    }
}