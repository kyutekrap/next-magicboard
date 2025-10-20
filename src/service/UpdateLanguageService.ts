import http from './http';
import { UpdateLanguagePayload } from './types';

export const UpdateLanguageService = async (payload: UpdateLanguagePayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0049', payload);
    return response;
}