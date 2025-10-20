export class OptionClass {
    value: string;
    label?: string;

    constructor()
    constructor(value: string)
    constructor(value: string, label: string)

    constructor(value?: string, label?: string) {
        this.value = value ?? "";
        this.label = label ?? value;
    }
}