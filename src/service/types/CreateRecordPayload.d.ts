import { DefaultPayload } from "./DefaultPayload"

export interface CreateRecordPayload extends DefaultPayload {
    page_id: string;
    data: Record<string, any>[]
}