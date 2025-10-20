import { sha256 } from 'js-sha256';
import http from './http';
import { CompleteLogoutPayload } from './types';

export const CompleteLogoutService = async (payload: CompleteLogoutPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0058', {
        password: sha256(payload.password)
    });
    return response;
}