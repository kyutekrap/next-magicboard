import { DefaultPayload } from "./DefaultPayload";

export interface RelatedPagePayload extends DefaultPayload {
    page_id: string;
    key?: string;
    sorting?: 1 | -1;
    offset?: number;
    conditions: ConditionModel[];
    item_id: string;
    parent_id: string;
}