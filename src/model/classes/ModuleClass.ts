export class ModuleClass {
    name: string;
    activated: boolean;

    constructor();
    constructor(name: string, activated: boolean);

    constructor(name?: string, activated?: boolean) {
        this.name = name ?? "";
        this.activated = activated ?? false;
    }
}