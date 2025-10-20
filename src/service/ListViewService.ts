import http from './http';
import { ListViewPayload } from '@/service/types';

export const ListViewService = async (payload: ListViewPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0051', payload);
    return response;
}