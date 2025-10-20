export class FlowClass {
    name: string;
    flow_id: string;
    is_bulk: boolean;

    constructor()

    constructor(name?: string, flow_id?: string, is_bulk?: boolean) {
        this.name = name ?? "";
        this.flow_id = flow_id ?? "";
        this.is_bulk = is_bulk ?? false;
    }
}