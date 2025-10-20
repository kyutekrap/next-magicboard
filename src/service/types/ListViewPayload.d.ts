import { DefaultPayload } from "./DefaultPayload";
import { ConditionModel } from "@/model/types";

export interface ListViewPayload extends DefaultPayload {
    page_id: string;
    key?: string;
    sorting?: 1 | -1;
    offset?: number;
    conditions?: ConditionModel[];
}