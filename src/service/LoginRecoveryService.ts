import http from './http';
import { RecoverPayload } from './types';

export const LoginRecoveryService = async (payload: RecoverPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0033', payload);
    return response;
}