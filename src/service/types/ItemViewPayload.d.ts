import { DefaultPayload } from "./DefaultPayload";

export interface ItemViewPayload extends DefaultPayload {
    item_id: string;
    page_id: string;
}