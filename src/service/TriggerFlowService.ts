import http from './http';
import { TriggerFlowPayload } from './types/TriggerFlowPayload';

export const TriggerFlowService = async (payload: TriggerFlowPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0001', payload);
    return response;
}