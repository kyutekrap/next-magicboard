import { DefaultPayload } from "./DefaultPayload"

export interface PageItemPayload extends DefaultPayload {
    page_id: string;
    offset: number;
}