'use client';

import { useEffect, useState } from "react";
import { GlobalPages } from "@/model/Pages";
import { FavoritePageService } from "@/service";
import { DefaultResponse } from "@/service/types";
import { GlobalStrings } from "@/model";
import { ModuleModel, PageModel } from "@/model/types";
import { delay, safeLogout, toast } from "@/common";
import Line from "@/components/Line";
import List from "@/components/List";
import { AsyncImageButton, StaticImageButton } from "@/components/ImageButton";
import { Drawer } from "@/components/Drawer";

const Pages = ({
    module,
    setDrawerOpen,
    drawerOpen
}: {
    module: ModuleModel,
    setDrawerOpen: Function,
    drawerOpen: boolean
}) => {
    const [pageList, setPageList] = useState<PageModel[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [strings, setStrings] = useState<Record<string, string>>({});

    useEffect(() => {
        GlobalPages.getAll().then(response => {
            if (response && response.length === 0) {
                toast(GlobalStrings.get("error", "abruptLogout"));
                delay(3000);
                safeLogout();
            } else {
                setPageList((response || []).sort((a, b) => a.page_name.localeCompare(b.page_name)));
            }
        });
        setStrings(GlobalStrings.getAll("dashboard"));
    }, []);
    
    async function handleClick(page: PageModel) {
        const eventType = !page.favorite_flag;
        FavoritePageService({
            page_id: page.page_id,
            event: eventType,
            module_id: module?.name ?? ""
        }).then((data: DefaultResponse) => {
            if (data !== null) {
                const newPages: PageModel[] = pageList.map((row: PageModel) => {
                    if (row.page_id === page.page_id) {
                        return { ...row, favorite_flag: eventType };
                    } else return row
                });
                GlobalPages.set(newPages);
                setPageList(newPages);
            }
        });
    }

    const Item = ({p}: {p: PageModel}) => (
        <List.Item>
            <AsyncImageButton onClick={()=> handleClick(p)}>
                { p.favorite_flag ? <img src="/icons/star-fill.svg" width={20} height={20} className='dark:invert' /> : <img src="/icons/star-outline.svg" width={20} height={20} className='dark:invert' /> }
            </AsyncImageButton>
            <List.ItemText onClick={() => {
                window.location.href = `?id=${p.page_id}`;
                setDrawerOpen(false); }}>
                {p.page_name}
            </List.ItemText>
        </List.Item>
    );

    return (
        <Drawer drawerOpen={drawerOpen}>
            <div className="my-2">
                <StaticImageButton shadow onClick={() => setDrawerOpen(!drawerOpen)}>
                    <img src="/icons/arrow-left.svg" width={20} height={20} className='dark:invert' />
                </StaticImageButton>
            </div>
            <div className="flex flex-col space-y-4 px-2">
                <div className="px-2">
                    <input
                        type="text"
                        placeholder={strings?.searchText}
                        onChange={(event) => setSearchQuery(event.target.value.toLowerCase())}
                        className="w-full h-10 px-3 text-sm border border-neutral rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
                <List>
                    <List.Title>{strings?.favorite}</List.Title>
                    { pageList.map((p: PageModel, i: number) => (
                        p.favorite_flag && p.module === module?.name && p.page_name.toLowerCase().includes(searchQuery) && ( 
                            <Item key={i} p={p} /> 
                        )
                    )) }
                </List>
                <div className="px-2">
                    <Line />
                </div>
                <List>
                    <List.Title>{strings?.all}</List.Title>
                    { pageList.map((p: PageModel, i: number) => (
                        p.module === module?.name && p.page_name.toLowerCase().includes(searchQuery) && (
                            <Item key={i} p={p} />
                        )
                    )) }
                </List>
            </div>
        </Drawer>
    )
}

export default Pages