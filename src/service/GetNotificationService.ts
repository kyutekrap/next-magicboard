import http from './http';
import { GetNotificationPayload } from './types';

export const GetNotificationService = async (payload: GetNotificationPayload) => {
    var response = await http.Get('IF_CLIENT_RRM_OS_0060', payload);
    return response;
}