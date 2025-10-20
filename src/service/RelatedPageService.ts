import http from './http';
import { RelatedPagePayload } from '@/service/types';

export const RelatedPageService = async (payload: RelatedPagePayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0056', payload);
    return response;
}