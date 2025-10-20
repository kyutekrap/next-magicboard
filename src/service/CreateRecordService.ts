import http from './http';
import { CreateRecordPayload, CreateRecordResponse } from './types';

export const CreateRecordService = async (payload: CreateRecordPayload) => {
    var response: CreateRecordResponse = await http.Get('IF_CLIENT_RRM_OS_0040', payload);
    return response;
}