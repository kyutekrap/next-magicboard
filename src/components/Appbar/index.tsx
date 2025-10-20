"use client";

import React, { useEffect, useState } from 'react';
import Tools from './Tools';
import Modules from './Modules';
import Pages from './Pages';
import { useSearchParams } from 'next/navigation'
import { GlobalModules, GlobalNotifications } from '@/model';
import { ModuleModel, NotificationModel } from '@/model/types';
import { ModuleClass } from '@/model/classes';
import { StaticImageButton } from '../ImageButton';
import { getNotification, validateString } from '@/common';
import { Notifications } from './Notifications';
import { Badge } from '../Badge';

export const Appbar = () => {
  const [module] = useState<ModuleModel>(GlobalModules.getActivated() ?? new ModuleClass());
  const searchParams = useSearchParams();
  const [pageId, setPageId] = useState("");
  const [itemId, setItemId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [defaultNotifs, setDefaultNotifs] = useState<NotificationModel[] | null>(null);
  const [notifLen, setNotifLen] = useState(0);

  useEffect(() => {
    setPageId(searchParams.get('id') ?? "");
    setItemId(searchParams.get('item') ?? "");
    GlobalNotifications.get().then(response => {
      getNotification(response).then(result => {
        if (result !== undefined) {
          const newNotifs = [...result, ...response].sort((a, b) => b.timestamp - a.timestamp);;
          setDefaultNotifs(newNotifs);
          setNotifLen(result.length + response.filter(n => !n.visited).length);
        } else {
          setDefaultNotifs(response.sort((a, b) => b.timestamp - a.timestamp));
          setNotifLen(response.filter(n => !n.visited).length);
        }
      });
    });
  }, [searchParams]);

  return (
    <>
    <Pages module={module} setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
    { defaultNotifs && (
      <Notifications showNotifs={showNotifs} setShowNotifs={setShowNotifs} defaultNotifs={defaultNotifs} setNotifLen={setNotifLen} />
      ) }
    
    <div className='w-full bg-background dark:bg-foreground dark:border-b dark:border-neutral fixed top-0 z-10 flex flex-row px-4 py-2 justify-between items-center border-b border-neutral'>
      <div className='flex flex-row items-center space-x-2'>
        <StaticImageButton shadow onClick={() => setDrawerOpen(!drawerOpen)}>
          <img src="/icons/menu.svg" width={20} height={20} className='dark:invert' />
        </StaticImageButton>
        <Modules module={module} />
      </div>
      <div className='flex flex-row justify-end items-center space-x-2'>
        { validateString(pageId) && (<Tools pageId={pageId} itemId={itemId} />) }
        { defaultNotifs && (
          <Badge badgeContent={notifLen}>
            <StaticImageButton shadow onClick={() => setShowNotifs(!showNotifs)}>
              <img src="/icons/notification.svg" width={24} height={24} className='dark:dark:invert' />
            </StaticImageButton>
          </Badge>
        ) }
        <StaticImageButton shadow onClick={() => window.location.href = "/me"}>
          <img src="/icons/account.svg" width={25} height={25} className='dark:dark:invert' />
        </StaticImageButton>
      </div>
    </div>
    </>
  );
}