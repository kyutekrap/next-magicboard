import http from './http';
import { SearchPayload } from './types';

export const SearchService = async (payload: SearchPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0053', payload);
    return response;
}