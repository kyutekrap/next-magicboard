import http from './http';
import { DeleteRecordPayload } from './types/DeleteRecordPayload';

export const DeleteRecordService = async (payload: DeleteRecordPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0042', payload)
    return response
}