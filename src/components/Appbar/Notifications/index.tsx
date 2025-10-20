"use client";

import { formatDateTime, toast } from "@/common";
import { Button } from "@/components/Button";
import IconButton from "@/components/IconButton";
import Line from "@/components/Line";
import { Paragraph } from "@/components/Paragraph";
import { GlobalModules, GlobalNotifications, GlobalPages, GlobalStrings } from "@/model";
import { NotificationModel } from "@/model/types"
import { DeleteNotificationService } from "@/service";
import { DeleteNotificationPayload } from "@/service/types";
import { useState } from "react";

interface NotificationProps {
    showNotifs: boolean;
    setShowNotifs: Function;
    defaultNotifs: NotificationModel[];
    setNotifLen: Function;
}

export const Notifications: React.FC<NotificationProps> = ({showNotifs, setShowNotifs, defaultNotifs, setNotifLen}) => {
    const [notifs, setNotifs] = useState<NotificationModel[]>(defaultNotifs);
    const [notifsLen, setNotifsLen] = useState<number>(defaultNotifs.length);
    const [disabled, setDisabled] = useState(false);

    async function handleOnClick(n: NotificationModel) {
        await GlobalNotifications.update({...n, visited: true});
        var linkURL: URL;
        try {
            linkURL = new URL(n.link);
        } catch {
            toast(GlobalStrings.get("error", "invalidURL"));
            return;
        }
        if (linkURL.hostname === window.location.hostname) {
            const pageId = linkURL.searchParams.get("id") ?? "";
            if (pageId !== "") {
                const page = await GlobalPages.get(pageId);
                if (page) {
                    const newModules = GlobalModules.get().map(m => {
                        if (m.name === page?.module) {
                            return {
                                ...m,
                                activated: true
                            }
                        } else {
                            return {
                                ...m,
                                activated: false
                            }
                        }
                    });
                    GlobalModules.set(newModules);
                }
            } else {
                toast(GlobalStrings.get("error", "invalidURL"));
                return;
            }
        }
        window.location.href = n.link;
    }

    function emptyInbox() {
        if (notifs.filter(n => !n.visited).length > 0) {
            toast(GlobalStrings.get("error", "unreadNotifications"));
        } else {
            setDisabled(true);
            const payload: DeleteNotificationPayload = {
                timestamp: notifs[0].timestamp
            }
            DeleteNotificationService(payload).then(response => {
                if (response !== null) {
                    setNotifs(response.notifications);
                    const newLength = response.notifications.length;
                    setNotifsLen(newLength);
                    setNotifLen(newLength);
                    GlobalNotifications.clear();
                }
            }).finally(() => {
                setDisabled(false);
            });
        }
    }

    return (
        <div className={`z-10 fixed right-5 top-16 w-full max-w-xs max-h-96 overflow-y-auto bg-background rounded-lg shadow dark:bg-foreground text-foreground dark:text-background 
        ${showNotifs ? "block" : "hidden"}`}>
            <div className="flex items-center px-4 py-2">
                <span className="text-sm font-semibold flex-1">{GlobalStrings.get("dashboard", "notifications")}</span>
                <IconButton onClick={() => setShowNotifs(false)}>
                    <img src="/icons/close.svg" width={12} height={12} className="dark:invert" />
                </IconButton>
            </div>
            { notifsLen === 0 ? (
                    <div className="px-4 pb-2 text-sm font-normal">
                        <Paragraph>{GlobalStrings.get("error", "noData")}</Paragraph>
                    </div>
                ): notifs.map((n: NotificationModel, i: number) => (
                    <div>
                        <div className={`flex flex-col px-4 py-2 ${n.visited && "bg-neutralLight"}`}>
                            <div className="text-sm font-semibold">
                                <span className="cursor-pointer" onClick={() => handleOnClick(n)}>{n.subject}</span>
                            </div>
                            <div className="text-sm font-normal">{n.message}</div> 
                            <span className="text-xs font-medium text-primary">{formatDateTime(n.timestamp)}</span>
                        </div>
                        { i === notifsLen - 1 ? (
                            <div className="flex p-2 justify-between">
                                <div className="flex-grow" />
                                <Button onClick={() => emptyInbox()} size="small" disabled={disabled}>
                                    <small>{GlobalStrings.get("dashboard", "emptyInbox")}</small>
                                </Button>
                            </div>
                        ): (
                            <Line />
                        ) }
                    </div>
                )
            ) }
        </div>
    )
}