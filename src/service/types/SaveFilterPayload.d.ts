import { ConditionModel, SortModel } from "@/model/types";

export interface SaveFilterPayload {
    pageId: string;
    filter?: ConditionModel[];
    sort?: SortModel;
    related_pages?: string[];
    keys?: string[];
}