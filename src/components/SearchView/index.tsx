'use client';

import { useState } from "react";
import { EmptyList, Link, Searchbar } from "@/components";
import { GlobalModules, GlobalStrings } from "@/model";
import { SearchService } from "@/service/SearchService";
import { ReferenceModel } from "@/model/types";
import { SearchPayload, SearchResponse } from "@/service/types";

export const SearchView = ({
    placeholder,
    defaultValue,
    pageId,
    onClick,
    parentId,
    hasRole
}: {
    placeholder?: string,
    defaultValue?: string,
    pageId: string,
    onClick?: Function,
    parentId?: string,
    hasRole: boolean
}) => {
    const [data, setData] = useState<ReferenceModel[]>([]);

    const ReferenceItem = ({item}: {item: ReferenceModel}) => {
        return hasRole ? (
                <Link type="secondary" id={pageId} item={item._id} value={item.name} />
            ): item.name
    }

    function runSearch(event: any) {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (data.length % 200 === 0) {
                const payload: SearchPayload = {
                    page_id: pageId,
                    module_id: GlobalModules.getActivated()?.name ?? '',
                    search: event.target.value,
                    parent_id: parentId ?? ''
                }
                SearchService(payload).then((data: SearchResponse) => {
                    if (data !== null) {
                        setData(data.data);
                    }
                });
            } else {
                setData(data.filter(d => d.name.toLowerCase().includes(event.target.value.toLowerCase()) ));
            }
        }
    }

    return (
        <>
            <Searchbar
            onEnter={runSearch}
            placeholder={placeholder}
            value={defaultValue}
            />
            <table className="w-full border-collapse mt-2">
                <thead className="border-b border-neutral border-b-2">
                    <tr>
                        <th className="text-left py-2 px-4 text-sm font-semibold">{GlobalStrings.get("dashboard", "name")}</th>
                        {onClick && <th className="py-2 px-4"></th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((d: ReferenceModel, i: number) => (
                            <tr key={i} className="border-b border-neutral">
                                <td className="py-2 px-4">
                                    <ReferenceItem item={d} />
                                </td>
                                {onClick && (
                                    <td className="py-2 px-4 text-right">
                                        <button onClick={() => onClick(d)} className="p-1">
                                            <img src="/icons/copy.svg" width={24} height={24} alt="Copy Icon" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={onClick ? 2 : 1}>
                                <EmptyList />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}