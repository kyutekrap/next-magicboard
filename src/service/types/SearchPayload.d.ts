import { DefaultPayload } from "./DefaultPayload"

export interface SearchPayload extends DefaultPayload {
    page_id: string;
    search: string;
    parent_id?: string;
}