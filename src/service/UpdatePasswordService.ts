import http from './http';
import { sha256 } from 'js-sha256';
import { UpdatePasswordPayload } from './types';

export const UpdatePasswordService = async (payload: UpdatePasswordPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0050', {
        ...payload,
        "password": sha256(payload.password)
    });
    return response;
}