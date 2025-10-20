import { DefaultResponse } from "./DefaultResponse"

export interface CreateRecordResponse extends DefaultResponse {
    created_by: string;
    rec_num: string[];
}