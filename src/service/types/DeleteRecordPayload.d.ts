import { DefaultPayload } from "./DefaultPayload"

export interface DeleteRecordPayload extends DefaultPayload {
    item_id: string[];
    page_id: string;
}