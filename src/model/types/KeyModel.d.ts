import { CurrencyKey } from "@/asset/currency";
import { ConditionModel, ReferenceModel, ActiveKey } from "@/model/types";

export interface KeyModel {
    name: string;
    readable_dtype: string;
    max_length?: number;
    options?: string[];
    reference?: ReferenceModel;
    active: ActiveKey;
    currency?: CurrencyKey;
    format?: string;
    required: boolean;
    standard: boolean;
    api_key: string;
    visibility: boolean;
    active_if?: ConditionModel[];
    max?: number;
    min?: number;
    decimals?: number;
    size?: number;
    types?: string[];
}