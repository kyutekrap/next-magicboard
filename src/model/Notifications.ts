"use client";

import type { NotificationModel } from "@/model/types";
import { adder, collector, getter, IndexedDB, setter } from "@/cachier-api";


export class GlobalNotifications extends IndexedDB {

    private static data: NotificationModel[];
    protected static __name__ = "GlobalNotifications";

    @setter
    static async set(notifications: NotificationModel[]): Promise<void> {
        GlobalNotifications.data = notifications;
    }

    @getter
    static async get(): Promise<NotificationModel[]> {
        return GlobalNotifications?.data;
    }

    @adder
    static async update(notification: NotificationModel): Promise<void> {
        GlobalNotifications.data = GlobalNotifications.data.map(n => {
            if (n.notification_id === notification.notification_id) return notification;
            else return n;
        });
    }

    @adder
    static async add(notification: NotificationModel): Promise<void> {
        if (GlobalNotifications.data) GlobalNotifications.data.push(notification);
    }

    @collector
    static async clear(): Promise<void> {
        GlobalNotifications.data = [];
    }
}