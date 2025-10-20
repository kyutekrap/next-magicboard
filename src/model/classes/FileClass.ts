export class FileClass {
    name: string;
    url: string;

    constructor()
    constructor(name: string, url: string)

    constructor(name?: string, url?: string) {
        this.name = name ?? "";
        this.url = url ?? "";
    }
}