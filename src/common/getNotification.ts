"use client";

import { GlobalNotifications } from "@/model";
import { NotificationModel } from "@/model/types";
import { GetNotificationService } from "@/service";
import { GetNotificationPayload, GetNotificationResponse } from "@/service/types";

export async function getNotification(defaultNotifs: NotificationModel[]): Promise<NotificationModel[] | undefined> {
    const timestamp = defaultNotifs.length > 0 ? defaultNotifs[0].timestamp : 0;
    const payload: GetNotificationPayload = {
        timestamp: timestamp
    }
    const result: NotificationModel[] = [];
    const response: GetNotificationResponse = await GetNotificationService(payload);
    if (response !== null) {
        response.notifications.map(res => {
            GlobalNotifications.add(res);
            result.push(res);
        });
    }
    return result;
}