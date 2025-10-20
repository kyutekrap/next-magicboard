import http from './http';
import { FavoritePagePayload } from './types/FavoritePagePayload';

export const FavoritePageService = async (payload: FavoritePagePayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0043', payload);
    return response;
}