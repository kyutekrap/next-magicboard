'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link, EmptyList, Form, TableLayout, Paragraph, ExternalLink, ReactiveTable, TRow, TCell, LoadingList, FlowSelection } from '@/components';
import { stringifyConditions, hasRole, formatDate, formatDateTime, validateString, formatBoolean, joinList, formatNumber, show, toast, validateAllKeys, safeLogout, delay } from '@/common';
import { GlobalKeys, GlobalPages, GlobalModules, GlobalData, GlobalStrings, GlobalCurrency, GlobalSort } from '@/model';
import { ListViewService, RelatedPageService } from '@/service';
import { ListViewPayload, ListViewResponse, RelatedPagePayload } from '@/service/types';
import { FlowModel, KeyModel, PageModel } from '@/model/types';
import { GlobalFilter } from '@/model/Filter';
import { CurrencyKey } from '@/asset/currency';
import List from '../List';
import { PageClass, SortClass } from '@/model/classes';
import IconButton from '../IconButton';

interface context_tp {
    page: PageModel;
    currentPage: number;
    uboundHit: boolean;
    position?: number;
    flows: FlowModel[];
    rowsPerPage: 5 | 15 | 30;
    parentId?: string;
    itemId?: string;
    reloadData?: number;
}

interface tableContext_tp {
    context: context_tp;
    setContext: React.Dispatch<React.SetStateAction<context_tp>>;
}

const TableContext = createContext<tableContext_tp | undefined>(undefined);
const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext must be used within a FormProvider');
    }
    return context;
};

async function loadData(
    context: context_tp, setContext: Function, offset: number,
    { parentId, itemId, filterCol, sorting }: { parentId?: string, itemId?: string, filterCol?: string, sorting?: 'asc' | 'desc' },
    initialLoad?: boolean
): Promise<boolean> {
    let result: ListViewResponse;
    let payload: RelatedPagePayload | ListViewPayload;
    if (validateString(parentId)) {
        payload = {
            page_id: context.page.page_id,
            conditions: [],
            item_id: itemId ?? "",
            parent_id: parentId ?? "",
            module_id: GlobalModules.getActivated()?.name ?? "",
            offset: offset,
            key: filterCol,
            sorting: sorting === 'asc' ? 1 : -1
        }
        result = await RelatedPageService(payload);
    } else {
        payload = {
            page_id: context.page.page_id,
            module_id: GlobalModules.getActivated()?.name ?? "",
            offset: offset,
            conditions: GlobalFilter.find(context.page.page_id) || null,
            key: filterCol,
            sorting: sorting === 'asc' ? 1 : -1
        }
        result = await ListViewService(payload);
    }
    if (result !== null) {
        if (result.data.length < 200) setContext({...context, uboundHit: true});

        if (initialLoad) {
            GlobalFilter.set({[context.page.page_id]: result.filter});
            GlobalKeys.set(context.page.page_id, result.keys);
            setContext({...context, flows: result.flows, page: {
                ...context.page,
                sort: {
                    sorting: result?.sorting?.sorting,
                    key: result?.sorting?.key
                }
            }});
        }

        GlobalSort.set({[context.page.page_id]: new SortClass(
            result?.sorting?.sorting,
            result?.sorting?.key
        )});

        if (offset === 0) GlobalData.set(context.page.page_id, result.data);
        else GlobalData.add(context.page.page_id, result.data);

        return true;
    } else {
        return false;
    }
}

export const TableView = ({
    children,
    pageId,
    parentId,
    itemId
}: {
    children: React.ReactNode,
    pageId: string,
    parentId?: string,
    itemId?: string
}) => {
    const [context, setContext] = useState<context_tp>({
        page: new PageClass(),
        currentPage: 1,
        uboundHit: false,
        flows: [],
        parentId: parentId,
        itemId: itemId,
        rowsPerPage: 15
    });
    const [render, setRender] = useState(false);

    useEffect(() => {
        GlobalPages.get(pageId).then(response => {
            if (response) {
                loadData({...context, page: response}, setContext, 0, { parentId: parentId, itemId: itemId }, true).then(res => {
                    if (res) setRender(true);
                });
            } else {
                toast(GlobalStrings.get("error", "abruptLogout"));
                delay(3000);
                safeLogout();
            }
        })
    }, []);

    return (
        <TableContext.Provider value={{ context, setContext }}>
            { render && children }
        </TableContext.Provider>
    )
}

TableView.Header = ({
    border
}: {
    border?: boolean
}) => {
    const { context, setContext } = useTableContext();
    const [rerenderKey, setRerenderKey] = useState(0);
    const [page, setPage] = useState<PageModel>();
    const scrollTarget = useRef<HTMLDivElement>(null);
    const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

    useEffect(() => {
        GlobalPages.get(context.page.page_id).then(response => {
            if (response) {
                setPage(response);
            } else {
                toast(GlobalStrings.get("error", "abruptLogout"));
                delay(3000);
                safeLogout();
            }
        });
    }, []);

    function wipeData() {
        setRerenderKey(rerenderKey + 1);
        setIsAccordionExpanded(!isAccordionExpanded);
        setContext({...context, position: undefined});
    }

    useEffect(() => {
        if (context.position !== undefined) {
            setIsAccordionExpanded(true);
            if (scrollTarget.current) {
                const elementPosition = scrollTarget.current.getBoundingClientRect().top;
                const offset = -100;
                let scrollPosition = window.scrollY + elementPosition + offset;
                const maxScroll = document.body.scrollHeight - window.innerHeight;
                if (scrollPosition < 0) {
                    scrollPosition = 0;
                } else if (scrollPosition > maxScroll) {
                    scrollPosition = maxScroll;
                }
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth',
                });
            }
        }
    }, [context.position]);

    function onSave(newRec: Record<string, any>) {
        GlobalData.set(context.page.page_id, [newRec, ...GlobalData.get(context.page.page_id)]);
        setContext({...context, reloadData: (context?.reloadData ?? 0) + 1, position: 0});
    }

    function onDelete(oldRec: string) {
        const newData = GlobalData.get(context.page.page_id).filter(d => d?._id !== oldRec);
        GlobalData.set(context.page.page_id, newData);
        setContext({...context, reloadData: (context?.reloadData ?? 0) + 1});
    }
    
    function onUpdate(newRec: Record<string, any>) {
        let position;
        const newData = GlobalData.get(context.page.page_id).map((d, i) => {
            if (d?._id === newRec?._id) {
                position = i;
                return newRec;
            } else {
                return d;
            }
        });
        GlobalData.set(context.page.page_id, newData);
        setContext({...context, reloadData: (context?.reloadData ?? 0) + 1, position: position});
    }

    return (
        <div className={`${border ? 'border border-neutral rounded m-2' : 'border-b border-neutral'}`}>
            <div className='px-4' id={context.page.page_id} ref={scrollTarget}>
                <button
                onClick={wipeData}
                className="w-full flex justify-between items-center py-2 text-slate-800"
                >
                    <Paragraph>{page?.page_name}</Paragraph>
                    <span
                    className={`transition-transform duration-300 ${
                        isAccordionExpanded ? "rotate-180" : "rotate-0"
                    }`}
                    >
                        <img src="/icons/expand.svg" width={20} height={20} alt="Expand" className='dark:invert' />
                    </span>
                </button>
                <div
                key={rerenderKey}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isAccordionExpanded ? "max-h-[3000px] py-5" : "max-h-0"
                }`}
                >
                    <Form pageId={context.page.page_id} parentId={context.parentId}>
                        <Form.Data
                        position={context.position}
                        flows={context.flows.filter(f => !f.is_bulk)}
                        onSave={onSave} onUpdate={onUpdate}
                        onDelete={onDelete}
                        />
                    </Form>
                </div>
            </div>
        </div>
    )
}

TableView.Body = ({
    rowsPerPage
}: {
    rowsPerPage?: 5 | 15 | 30
}) => {
    const { context, setContext } = useTableContext();
    const [data, setData] = useState<Record<string, any>[]>([]);
    const [keys, setKeys] = useState<KeyModel[]>([]);
    const [render, setRender] = useState(false);
    const [filterCol, setFilterCol] = useState('');
    const [sorting, setSorting] = useState<'asc' | 'desc'>('desc');
    const [hasBulk, setHasBulk] = useState(false);
    const [checkedData, setCheckedData] = useState<Record<string, any>[]>([]);

    useEffect(() => {
        setContext({...context, rowsPerPage: rowsPerPage ?? 15});
    }, []);

    useEffect(() => {
        const globalSort = GlobalSort.find(context.page.page_id);
        setFilterCol(globalSort?.key ?? "Created On");
        setSorting(globalSort?.sorting === 1 ? 'asc' : 'desc');

        setData(GlobalData.get(context.page.page_id));
        setKeys(GlobalKeys.get(context.page.page_id));
        if (context.flows.filter(f => f.is_bulk).length > 0) setHasBulk(true);
        setRender(true);
    }, [context]);

    function invokePagingApi() {
        loadData(context, setContext, 
            (context.rowsPerPage) * context.currentPage - 1,
            { parentId: context.parentId, itemId: context.itemId, filterCol: filterCol, sorting: sorting }
        );
    }

    function handleSortingRequest(key: string, direction: 'asc' | 'desc') {
        setFilterCol(key);
        setSorting(direction);
        loadData(context, setContext, 0, 
            { parentId: context.parentId, itemId: context.itemId, filterCol: key, sorting: direction }
        );
    }

    function handleCheckAll(checked: boolean) {
        if (checked) {
            const newData = data.filter((_d: Record<string, any>, i: number) => 
                ((context.rowsPerPage) * (context.currentPage - 1) <= i && i < (context.rowsPerPage) * context.currentPage)
            );
            const oldData = checkedData.map(d => d?._id);
            setCheckedData([...checkedData, ...newData.filter(d => !oldData.includes(d?._id))]);
        } else {
            const newData = data.filter((_d: Record<string, any>, i: number) => 
                ((context.rowsPerPage) * (context.currentPage - 1) <= i && i < (context.rowsPerPage) * context.currentPage)
            ).map(d => d?._id);
            setCheckedData(checkedData.filter(d => !newData.includes(d?._id)));
        }
    }

    const Checkbox = ({row}: {row: Record<string, any>}) => {
        useEffect(() => {
            
        }, [checkedData]);

        function handleChange(checked: boolean) {
            if (checked) setCheckedData([...checkedData, row]);
            else setCheckedData(checkedData.filter(d => d?._id !== row?._id));
        }

        return (
            <input type="checkbox" checked={checkedData.find(c => c?._id === row?._id) ? true : false} onChange={(e => handleChange(e.target.checked))} />
        )
    }

    return (
        <>
        <div className="relative overflow-x-auto">
            {
                render ? (
                    <>
                    <ReactiveTable headers={keys.filter(k => k.visibility).map((k: KeyModel) => k.name)} defaultKey={filterCol} defaultSorting={sorting} onSort={handleSortingRequest} hasBulk={hasBulk} handleCheckAll={handleCheckAll} currentPage={context.currentPage}>
                        { data.map((d: Record<string, any>, i: number) => {
                            if ((context.rowsPerPage) * (context.currentPage - 1) <= i && i < (context.rowsPerPage) * context.currentPage) {
                                return (
                                    <TRow key={i}>
                                        { (keys).filter(k => k.visibility).map((k: KeyModel, idx: number) => (
                                            <>
                                            { idx === 0 && hasBulk && (
                                                <TCell key={`${i}_cb`}>
                                                    <Checkbox row={d} />
                                                </TCell>
                                            ) }
                                            <TCell key={`${i}_${idx}`}>
                                                { k.api_key === 'name' ? (
                                                    <div onClick={() => setContext({...context, position: i})}>
                                                        <ExternalLink>
                                                            <TCell.Span>{d[k.name]}</TCell.Span>
                                                        </ExternalLink>
                                                    </div>
                                                ): k.readable_dtype === 'Date & Time' ? ( <TCell.Span>{formatDate(d[k.name])}</TCell.Span> ) :
                                                k.readable_dtype === 'Date' ? ( <TCell.Span>{formatDateTime(d[k.name])}</TCell.Span> ) :
                                                k.readable_dtype === 'True/False' ? ( <TCell.Span>{formatBoolean(d[k.name])}</TCell.Span> ) :
                                                k.readable_dtype === 'Reference' ? (
                                                    hasRole("read_role", k?.reference?.name ?? "") ? (
                                                        <TCell.Span>
                                                            <Link type="secondary" id={k?.reference?._id ?? ""} item={d?.[k.name]?._id} value={d?.[k.name]?.name} />
                                                        </TCell.Span>
                                                    ): ( <TCell.Span>{d?.[k.name]?.name}</TCell.Span> )
                                                ) :
                                                k.readable_dtype === 'URL' ? ( 
                                                    <ExternalLink type="secondary" href={d[k.name]}>
                                                        <TCell.Span>{d[k.name]}</TCell.Span>
                                                    </ExternalLink> ) : 
                                                k.readable_dtype === 'List' ? ( <TCell.Span>{joinList(d[k.name])}</TCell.Span> ) :
                                                k.readable_dtype === 'Conditions' ? ( <TCell.Span>{stringifyConditions(d[k.name])}</TCell.Span> ) : 
                                                k.readable_dtype === 'Quantity' ? ( <TCell.Span>{formatNumber(d[k.name])}</TCell.Span> ) : 
                                                k.readable_dtype === "Currency" ? ( <TCell.Span>{`${GlobalCurrency.get(k.currency as CurrencyKey)}${formatNumber(d[k.name])}`}</TCell.Span> ) :
                                                k.readable_dtype === "Multiple Choice" ? ( <TCell.Span>{joinList(d[k.name])}</TCell.Span> ) :
                                                k.readable_dtype === "Percentage" ? ( <TCell.Span>{`${d[k.name]}%`}</TCell.Span> ) : ( <TCell.Span>{d[k.name]}</TCell.Span> ) }
                                            </TCell>
                                            </>
                                        )) }
                                    </TRow>
                                ) } else {
                                    if ((context.rowsPerPage) * (context.currentPage - 1) <= i && i < (context.rowsPerPage) * context.currentPage && i === data.length - 1 && !context.uboundHit) {
                                        invokePagingApi();
                                    }
                                    return null;
                                }
                        }) }
                    </ReactiveTable>
                    { data.length === 0 && ( <EmptyList /> ) }
                    </>
                ): (
                    <LoadingList />
                )
            }
        </div>
        <Controls data={data} keys={keys} setKeys={setKeys} checkedData={checkedData} />
        </>
    );
}

const ColumnConfig = ({keys, setKeys, checkedData}: {keys: KeyModel[], setKeys: Function, checkedData: Record<string, any>[]}) => {
    const { context, setContext } = useTableContext();
    const bulkFlows = context.flows.filter(f => f.is_bulk);

    const PopupView = () => (
        <div className="p-2">
            <List>
                <List.Item>
                    <List.ItemText onClick={() => {
                        show(<TableLayout pageId={context.page.page_id} keys={keys} setKeys={setKeys} />);
                    }}>
                        <img src='/icons/columns.svg' width={20} height={20} className="dark:invert" />
                        <span>{GlobalStrings.get("dashboard", "columns")}</span>
                    </List.ItemText>
                </List.Item>
                {
                    bulkFlows.length > 0 && (
                        <List.Item>
                            <List.ItemText onClick={() => {
                                show(<FlowSelection flows={bulkFlows} checkedData={checkedData} page={context.page} />);
                            }}>
                                <img src='/icons/rocket.svg' width={20} height={20} className="dark:invert" />
                                <span>{GlobalStrings.get("dashboard", "fireFlow")}</span>
                            </List.ItemText>
                        </List.Item>
                    )
                }
            </List>
        </div>
    );

    return (
        <IconButton onClick={() => show(<PopupView />)} size='small'>
            <img src='/icons/setting.svg' width={20} height={20} />
        </IconButton>
    )
}

const Controls = ({
    data, keys, setKeys, checkedData
}: {
    data: Record<string, any>[], keys: KeyModel[], setKeys: Function, checkedData: Record<string, any>[]
}) => {
    const { context, setContext } = useTableContext();

    return (
        <div className='flex flex-row items-center pt-2 pb-2 pl-1 pr-1'>
            <div className='flex flex-row flex-1 items-center space-x-1'>
                <ColumnConfig keys={keys} setKeys={setKeys} checkedData={checkedData} />
                <div className='flex flex-row w-[150px] items-center justify-center space-x-2'>
                    <small>{GlobalStrings.get("dashboard", "rowsPerPage")}</small>
                    <select
                    className='border rounded border-neutral pl-2'
                    style={{ flex: 1 }}
                    value={context.rowsPerPage}
                    onChange={(event) => setContext({...context, rowsPerPage: parseInt(event.target.value) as 5 | 15 | 30})}
                    >
                        <option value={5}>5</option>
                        <option value={15}>15</option>
                        <option value={30}>30</option>
                    </select>
                </div>
            </div>
            <div className='flex flex-row flex-1 items-center space-x-1 justify-end'>
                <IconButton
                size='small'
                disabled={context.currentPage === 1}
                onClick={() => setContext({...context, currentPage: context.currentPage - 1 })}>
                    <img src='/icons/chevron-left.svg' width={16} height={16} className='dark:invert' />
                </IconButton>
                <Paragraph>{context.currentPage}</Paragraph>
                <IconButton
                size='small'
                disabled={!(((context.rowsPerPage) * context.currentPage <= data.length || data.length % 200 == 0) && data.length > 0)}
                onClick={() => setContext({...context, currentPage: context.currentPage + 1 })}>
                    <img src='/icons/chevron-right.svg' width={16} height={16} className='dark:invert' />
                </IconButton>
            </div>
        </div>
    );
}