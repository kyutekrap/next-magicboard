"use client";

import { GlobalKeys, GlobalModules, GlobalStrings } from "@/model";
import { PageModel } from "@/model/types";
import { TriggerFlowPayload } from "@/service/types";
import { parseData } from "./parseData";
import { TriggerFlowService } from "@/service";
import { toast } from "./toast";

export async function handleCustomButton(flow_id: string, page: PageModel, myData: Record<string, any>[]): Promise<boolean> {
    const keys = GlobalKeys.get(page.page_id);
    const data: Record<string, any>[] = [];
    myData.map(d => {
        data.push(parseData(keys, d));
    });
    const payload: TriggerFlowPayload = {
        flow_id: flow_id,
        module_id: GlobalModules.getActivated()?.name ?? "",
        item: data,
        page: {
            _id: page.page_id,
            name: page?.page_name
        }
    }
    const response = await TriggerFlowService(payload);
    if (response !== null) {
        toast(GlobalStrings.get("dashboard", "completed"));
        return true;
    }
    return false;
}