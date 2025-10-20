import http from './http';
import { DeleteNotificationPayload, DeleteNotificationResponse } from './types';

export const DeleteNotificationService = async (payload: DeleteNotificationPayload) => {
    var response: DeleteNotificationResponse = await http.Get('IF_CLIENT_RRM_OS_0061', payload);
    return response;
}