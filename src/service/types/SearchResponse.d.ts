import { DefaultResponse } from "@/service/types";
import { ReferenceModel } from "@/model/types";

export interface SearchResponse extends DefaultResponse {
    data: ReferenceModel[]
}