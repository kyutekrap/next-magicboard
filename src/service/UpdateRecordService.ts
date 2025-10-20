import http from './http';
import { UpdateRecordPayload } from './types';

export const UpdateRecordService = async (payload: UpdateRecordPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0047', payload);
    return response;
}