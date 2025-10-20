import http from './http';
import { CodeCompilerResponse, CodeCompilerPayload } from './types';

export const CodeCompilerService = async (payload: CodeCompilerPayload) => {
    var response: CodeCompilerResponse = await http.Get("IF_CLIENT_RRM_OS_0002", payload);
    return response;
}