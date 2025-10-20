import { sha256 } from 'js-sha256';
import http from './http';
import { LoginPayload } from './types/LoginPayload';

export const LoginService = async (payload: LoginPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0031', {
        ...payload,
        "password": sha256(payload.password)
    });
    return response;
}