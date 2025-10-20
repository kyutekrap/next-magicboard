import http from './http';
import { ItemViewPayload } from './types/ItemViewPayload';

export const ItemViewService = async (payload: ItemViewPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0055', payload);
    return response;
}