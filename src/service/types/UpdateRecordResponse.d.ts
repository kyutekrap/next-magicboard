import { DefaultResponse } from "./DefaultResponse"

export interface UpdateRecordResponse extends DefaultResponse {
    updated_by: string;
}