import { DefaultPayload } from "./DefaultPayload"

export interface UpdateRecordPayload extends DefaultPayload {
    data: Record<string, any>;
    page_id: string
}