import http from './http';
import { ResetPasswordPayload } from './types';

export const ResetPasswordService = async (payload: ResetPasswordPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0004', payload);
    return response;
}