import { FlowModel, KeyModel, RelatedPageModel } from "@/model/types";
import { DefaultResponse } from "./DefaultResponse";

export interface ItemViewResponse extends DefaultResponse {
    header: Record<string, any>;
    pages: RelatedPageModel[];
    keys: KeyModel[];
    flows: FlowModel[];
}