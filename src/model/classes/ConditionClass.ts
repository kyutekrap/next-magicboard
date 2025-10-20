import { ReferenceModel } from "@/model/types";

export class ConditionClass {
    key: string = "";
    operator: string = "";
    value: string | ReferenceModel = "";
}