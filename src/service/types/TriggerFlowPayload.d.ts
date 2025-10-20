import { ReferenceModel } from "@/model/types"
import { DefaultPayload } from "./DefaultPayload"

export interface TriggerFlowPayload extends DefaultPayload {
    flow_id: string
    item: Record<string, any>[]
    page: ReferenceModel
}