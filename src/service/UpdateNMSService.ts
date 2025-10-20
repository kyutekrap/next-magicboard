import http from './http';
import { UpdateNMSPayload } from './types';

export const UpdateNMSService = async (payload: UpdateNMSPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0059', payload);
    return response;
}