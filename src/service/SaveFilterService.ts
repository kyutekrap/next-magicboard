import http from './http';
import { SaveFilterPayload } from './types';

export const SaveFilterService = async (payload: SaveFilterPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0062', payload);
    return response;
}