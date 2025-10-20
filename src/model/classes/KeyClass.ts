import { CurrencyKey } from "@/asset/currency";
import { ConditionModel, ReferenceModel, ActiveKey } from "@/model/types";

export class KeyClass {
    name: string = "";
    type: string = "";
    max_length?: number;
    options?: string[];
    reference?: ReferenceModel;
    active: ActiveKey = "Always";
    currency?: CurrencyKey;
    format?: string;
    required: boolean = false;
    standard: boolean = false;
    api_key: string = "";
    visibility: boolean = false;
    active_if?: ConditionModel[]
}