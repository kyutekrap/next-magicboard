'use client';

import { Filter, Export, SearchView, SavePreferences } from "@/components";
import { useEffect, useState } from "react";
import { GlobalStrings, GlobalFilter, GlobalPages } from "@/model";
import List from "@/components/List";
import { hasRole, show, validateString } from "@/common";
import IconButton from "@/components/IconButton";
import { PageModel } from "@/model/types";
import { PageClass } from "@/model/classes";

const Tools = ({ pageId, itemId }: { pageId: string, itemId: string }) => {
    const [strings, setStrings] = useState<Record<string, string>>({});
    const [page, setPage] = useState<PageModel>(new PageClass());
    const [render, setRender] = useState(false);

    useEffect(() => {
        GlobalPages.get(pageId).then(response => {
            if (response) {
                setPage(response);
                setRender(true);
            }
        });
        setStrings(GlobalStrings.getAll("dashboard"));
    }, []);

    const PopupView = () => {
        const Item = ({ name, icon }: { name: string, icon: any }) => (
            <List.Item>
                <List.ItemText onClick={() => {
                    if (name === 'export') show(<Export pageId={pageId ?? ""} />);
                    else if (name === 'search') show(
                        <SearchView
                        pageId={pageId ?? ""}
                        placeholder="Search.."
                        hasRole={hasRole("read_role", page.page_name)}
                        />
                    );
                    else if (name === 'filter') show(
                        <Filter pageId={pageId ?? ""} defaultValue={GlobalFilter.find(pageId) || []}>
                            <Filter.Preview />
                            <Filter.ButtonGroup>
                                <Filter.Add />
                                <Filter.Run />
                            </Filter.ButtonGroup>
                        </Filter>, 'medium'
                    );
                    else if (name === "save") show(<SavePreferences pageId={pageId} viewType={validateString(itemId) ? 'item' : 'list'} />);
                }}>
                    <div>{icon}</div>
                    <div>{strings?.[name]}</div>
                </List.ItemText>
            </List.Item>
        )

        return (
            <div className="p-2">
                {
                    validateString(itemId) ? (
                        <List>
                            <Item name='save' icon={<img src="/icons/save.svg" width={20} height={20} className='dark:invert' />} />
                        </List>
                    ): (
                        <List>
                            <Item name='search' icon={<img src="/icons/search.svg" width={20} height={20} className="dark:invert" />} />
                            <Item name='filter' icon={<img src="/icons/filter.svg" width={20} height={20} className="dark:invert" />} />
                            <Item name='export' icon={<img src="/icons/export.svg" width={20} height={20} className="dark:invert" />} />
                            <Item name='save' icon={<img src="/icons/save.svg" width={20} height={20} className='dark:invert' />} />
                        </List>
                    )
                }
            </div>
        );
    }

    return (
        render && (
            <IconButton onClick={() => show(<PopupView />)}>
                <img src="/icons/magic-wand.svg" width={24} height={24} className='dark:invert' />
            </IconButton>
        )
    )
}

export default Tools