import { ReferenceList } from "./ReferenceList"
import { DefaultResponse } from "./DefaultResponse";

export interface ReferenceListResponse extends DefaultResponse {
    data: ReferenceList[]
}