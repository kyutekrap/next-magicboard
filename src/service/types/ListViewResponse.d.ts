import { ConditionModel, SortModel } from "@/model/types";
import { DefaultResponse } from "./DefaultResponse";

export interface ListViewResponse extends DefaultResponse {
    data: Record<string, any>[];
    keys: KeyModel[];
    flows: FlowModel[];
    sorting: SortModel;
    filter: ConditionModel[];
}