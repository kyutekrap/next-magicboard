"use client";

import { GlobalFilter, GlobalKeys, GlobalPageLayout, GlobalSort, GlobalStrings } from "@/model";
import { Paper } from "../Paper";
import { Button } from "../Button";
import { Input } from "../Input";
import { Paragraph } from "../Paragraph";
import { useState } from "react";
import { SubHeader } from "../SubHeader";
import { SaveFilterPayload } from "@/service/types";
import { SortClass } from "@/model/classes";
import { toast } from "@/common";
import { SaveFilterService } from "@/service";

interface SavePreferencesProps {
    pageId: string;
    viewType: 'list' | 'item';
}

export const SavePreferences: React.FC<SavePreferencesProps> = ({
    pageId,
    viewType
}) => {
    const [saveList, setSaveList] = useState<string[]>([]);
    const [disabled, setDisabled] = useState(false);

    function submit() {
        setDisabled(true);
        const payload: SaveFilterPayload = { pageId: pageId };
        saveList.forEach((s: string) => {
            switch (s) {
                case "filter":
                    payload.filter = GlobalFilter.find(pageId) || [];
                    break;
                
                case "page":
                    payload.related_pages = (GlobalPageLayout.find(pageId) || []).filter(p => p.visibility).map(p => p._id);
                    break;
                
                case "sort":
                    payload.sort = GlobalSort.find(pageId) || new SortClass();
                    break;
                
                case "table":
                    payload.keys = GlobalKeys.get(pageId).filter(p => p.visibility).map(k => k.name);
                    break;
                
                default:
                    break;
            }
        });
        SaveFilterService(payload).then(response => {
            if (response !== null) {
                toast(GlobalStrings.get("dashboard", "updated"));
            }
        }).finally(() => {
            setDisabled(false);
        });
    }

    return (
        <div className='flex flex-col space-y-4 px-2 pb-4'>
            <SubHeader textAlign="left">{GlobalStrings.get("dashboard", "saveSearchQuery")}</SubHeader>
            <Paper>
                <div className='m-4 flex flex-col'>
                    {
                        viewType === 'list' ? (
                            <div className="flex flex-col space-y-4">
                                <div className='flex flex-row items-center justify-between'>
                                    <div className='flex-1 flex flex-row items-center space-x-2'>
                                        <img src='/icons/filter.svg' width={20} height={20} className="dark:invert" />
                                        <Paragraph>{GlobalStrings.get("dashboard", "filterConditions")}</Paragraph>
                                    </div>
                                    <div>
                                        <Input.Checkbox onChange={(e) => e ? setSaveList([...saveList, "filter"]) : setSaveList(saveList.filter(s => s !== "filter"))} />
                                    </div>
                                </div>
                                <div className='flex flex-row items-center justify-between'>
                                    <div className='flex-1 flex flex-row items-center space-x-2'>
                                        <img src='/icons/arrow-up.svg' width={20} height={20} className="dark:invert" />
                                        <Paragraph>{GlobalStrings.get("dashboard", "sortOrder")}</Paragraph>
                                    </div>
                                    <div>
                                        <Input.Checkbox onChange={(e) => e ? setSaveList([...saveList, "sort"]) : setSaveList(saveList.filter(s => s !== "sort"))} />
                                    </div>
                                </div>
                                <div className='flex flex-row items-center justify-between'>
                                    <div className='flex-1 flex flex-row items-center space-x-2'>
                                        <img src='/icons/columns.svg' width={20} height={20} className="dark:invert" />
                                        <Paragraph>{GlobalStrings.get("dashboard", "tableLayout")}</Paragraph>
                                    </div>
                                    <div>
                                        <Input.Checkbox onChange={(e) => e ? setSaveList([...saveList, "table"]) : setSaveList(saveList.filter(s => s !== "table"))} />
                                    </div>
                                </div>
                            </div>
                        ): (
                            <div>
                                <div className='flex flex-row items-center justify-between'>
                                    <div className='flex-1 flex flex-row items-center space-x-2'>
                                        <img src='/icons/layout.svg' width={20} height={20} className="dark:invert" />
                                        <Paragraph>{GlobalStrings.get("dashboard", "pageLayout")}</Paragraph>
                                    </div>
                                    <div>
                                        <Input.Checkbox onChange={(e) => e ? setSaveList([...saveList, "page"]) : setSaveList(saveList.filter(s => s !== "page"))} />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </Paper>
            <Button variant='contained' onClick={submit} disabled={disabled}>
                {GlobalStrings.get("dashboard", "save")}
            </Button>
        </div>
    )
}