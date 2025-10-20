import http from './http';
import { UploadFilePayload } from './types';

export const UploadFileService = async (payload: UploadFilePayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0047', payload);
    return response;
}
