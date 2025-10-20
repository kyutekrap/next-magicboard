'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Input, FieldSet, Label, Button } from '@/components';
import { isActiveKey, formatDate, formatDateTime, validateString, hasRole, parseData, toast, getTimestamp, hasValue } from '@/common'
import { GlobalKeys, GlobalData, GlobalModules, GlobalStrings, GlobalPages, GlobalEmail } from '@/model';
import { CreateRecordResponse, CreateRecordPayload, DeleteRecordPayload, UpdateRecordResponse, UpdateRecordPayload, UploadFilePayload, UploadFileResponse } from '@/service/types'
import { CreateRecordService, DeleteRecordService, UpdateRecordService } from '@/service';
import { FlowModel, KeyModel, PageModel } from '@/model/types';
import { ModuleClass, PageClass, ReferenceClass } from '@/model/classes';
import { UploadFileService } from '@/service/UploadFileService';
import { handleCustomButton } from '@/common/handleFlow';

class CallBacks {
    static saveCallBack: Function | undefined;
    static deleteCallBack: Function | undefined;
    static updateCallBack: Function | undefined;

    constructor(onSave?: Function, onDelete?: Function, onUpdate?: Function) {
        CallBacks.saveCallBack = onSave;
        CallBacks.deleteCallBack = onDelete;
        CallBacks.updateCallBack = onUpdate;
    }
}

interface context_tp {
    page: PageModel;
    position?: number;
    parentPage?: PageModel;
    disabled: boolean;
}

interface formContext_tp {
    context: context_tp;
    setContext: React.Dispatch<React.SetStateAction<context_tp>>;
}

const FormContext = createContext<formContext_tp | undefined>(undefined);
const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};

export const Form = ({
    children,
    pageId,
    parentId
}: {
    children: React.ReactNode,
    pageId: string,
    parentId?: string
}) => {
    const [context, setContext] = useState<context_tp>({ page: new PageClass(), disabled: false });
    const [render, setRender] = useState(false);

    useEffect(() => {
        let defaultContext: context_tp = { page: new PageClass(), disabled: false };
        const promises: Promise<void>[] = [];
        promises.push(GlobalPages.get(pageId).then(response => {
            if (response) {
                defaultContext["page"] = response;
            }
        }));
        if (parentId !== undefined) {
            promises.push(GlobalPages.get(parentId).then(response => {
                if (response) {
                    defaultContext["parentPage"] = response;
                }
            }));
        }
        Promise.all(promises).then(_ => {
            setContext(defaultContext);
            setRender(true);
        });
    }, []);

    return (
        render && (
            <FormContext.Provider value={{ context, setContext }}>
                {children}
            </FormContext.Provider>
        )
    )
}

Form.Data = ({
    position,
    flows,
    onDelete,
    onSave,
    onUpdate
}: {
    position?: number;
    flows: FlowModel[];
    onDelete?: Function;
    onSave?: Function;
    onUpdate?: Function;
}) => {
    const { context, setContext } = useFormContext();
    const [data, setData] = useState<Record<string, any>>({});
    const [keys, setKeys] = useState<KeyModel[]>([]);
    const [render, setRender] = useState(false);

    useEffect(() => {
        const initKeys = GlobalKeys.get(context.page.page_id);
        setKeys(initKeys);
        const initData: Record<string, any> = {};
        setData(initData);
        setContext({...context});
        new CallBacks(onSave, onDelete, onUpdate);
        setRender(true);
    }, []);

    useEffect(() => {
        if (position !== undefined) {
            const newData = GlobalData.get(context.page.page_id)?.[position];
            if (newData) {
                setData(newData);
            }
        }
        setContext({...context, position: position});
    }, [position]);

    function updateData(e: any) {
        setData({...data, ...e});
    }

    function getData(action: string): void {
        setContext({...context, disabled: true});

        const payload: UploadFilePayload = {
            data: [],
            module_id: GlobalModules.getActivated()?.name ?? ""
        }
        
        for (const k of keys) {
            if (k.readable_dtype === "File" && hasValue(data?.[k.name])) {
                payload.data.push({
                    key: k.name,
                    value: data?.[k.name]
                });
            }
        }
        if (payload.data.length > 0) {
            UploadFileService(payload).then((response: UploadFileResponse) => {
                // Send encrypted file, receive url
                if (response !== null) {
                    for (const res of response.data) {
                        data[res.key] = res.value;
                    }
                    callBack();
                }
            });
        } else {
            callBack();
        }

        async function callBack() {
            switch (action) {
                case "create":
                    await createRecord(data);
                    break;
                
                case "update":
                    await updateRecord(data);
                    break;
                
                case "delete":
                    await deleteRecord(data);
                    break;
                
                default:
                    await handleCustomButton(
                        action,
                        context.page,
                        [data]
                    );
                    break;
            }
            setContext({...context, disabled: false});
        }
    }

    async function updateRecord(myData: Record<string, any>) {
        const payload: UpdateRecordPayload = {
            module_id: GlobalModules.getActivated()?.name ?? "",
            data: [parseData(keys, myData)],
            page_id: context.page.page_id
        }
        const response: UpdateRecordResponse = await UpdateRecordService(payload);
        if (response !== null) {
            toast(GlobalStrings.get("dashboard", "updated"));
            myData["Updated By"] = { "_id": response.updated_by, "name": GlobalEmail.get() };
            myData["Updated On"] = getTimestamp();
            switch (context.page.page_name) {
                case "Page Configuration":
                    if (myData?.["Page"]?.["name"] === "Page Configuration") {
                        const newData: Record<string, any> = {};
                        Object.keys(myData).map(mk => {
                            if (mk === "Page") return;
                            const key = keys.find(k => k.name === mk)?.api_key;
                            if (key) newData[key] = myData[mk];
                        });
                        const newKeys: KeyModel[] = keys.map((k: KeyModel) => {
                            if (k.name === myData?.["Name"]) return myData as KeyModel;
                            else return k;
                        });
                        GlobalKeys.set(context.page.page_id, newKeys);
                        setKeys(newKeys);
                    }
                    if (context.parentPage?.page_id && myData?.["Page"]?.["_id"] === context.parentPage?.page_id) {
                        const newData: Record<string, any> = {};
                        Object.keys(myData).map(mk => {
                            if (mk === "Page") return;
                            const key = keys.find(k => k.name === mk)?.api_key;
                            if (key) newData[key] = myData[mk];
                        });
                        const newKeys: KeyModel[] = GlobalKeys.get(context.parentPage.page_id).map(k => {
                            if (k.name === myData?.["Name"]) return myData as KeyModel;
                            else return k;
                        });
                        GlobalKeys.set(context.parentPage.page_id, newKeys);
                    }
                    break;
                case "Pages":
                    GlobalPages.update(new PageClass(myData["_id"], myData["Name"], false, myData["Module"]["name"]));
                    break;
                default:
                    break;
            }
            if (CallBacks.updateCallBack) CallBacks.updateCallBack(myData);
        }
    }

    async function createRecord(myData: Record<string, any>) {
        const payload: CreateRecordPayload = {
            module_id: GlobalModules.getActivated()?.name ?? "",
            page_id: context.page.page_id,
            data: [parseData(keys, myData)]
        }
        const response: CreateRecordResponse = await CreateRecordService(payload);
        if (response !== null) {
            toast(GlobalStrings.get("dashboard", "created"));
            myData["Created By"] = { "_id": response.created_by, "name": GlobalEmail.get() }
            myData["Created On"] = getTimestamp();
            myData["_id"] = response.rec_num[0];
            switch(context.page.page_name) {
                case "Page Configuration":
                    if (myData?.["Page"]?.["name"] === "Page Configuration") {
                        const newData: Record<string, any> = {};
                        Object.keys(myData).map(mk => {
                            if (mk === "Page") return;
                            const key = keys.find(k => k.name === mk)?.api_key;
                            if (key) newData[key] = myData[mk];
                        });
                        newData["visibility"] = true;
                        setKeys([newData as KeyModel, ...keys]);
                        GlobalKeys.set(context.page.page_id, [newData as KeyModel, ...keys]);
                    }
                    if (context.parentPage?.page_id && myData?.["Page"]?.["_id"] === context.parentPage?.page_id) {
                        const newData: Record<string, any> = {};
                        Object.keys(myData).map(mk => {
                            if (mk === "Page") return;
                            const key = keys.find(k => k.name === mk)?.api_key;
                            if (key) newData[key] = myData[mk];
                        });
                        newData["visibility"] = true;
                        GlobalKeys.set(context.parentPage.page_id, [newData as KeyModel, ...GlobalKeys.get(context.parentPage.page_id)]);
                    }
                    break;
                case "Pages":
                    GlobalPages.add(new PageClass(myData["_id"], myData["Name"], false, myData["Module"]["name"]));
                    break;
                case "Module":
                    GlobalModules.set([...GlobalModules.get(), new ModuleClass(myData["Name"], false)]);
                    break;
                default:
                    break;
            }
            if (CallBacks.saveCallBack) CallBacks.saveCallBack(myData);
        }
    }

    async function deleteRecord(myData: Record<string, any>) {
        const payload: DeleteRecordPayload = {
            item_id: [myData?._id],
            module_id: GlobalModules.getActivated()?.name ?? "",
            page_id: context.page.page_id
        }
        const response: CreateRecordResponse = await DeleteRecordService(payload);
        if (response !== null) {
            toast(GlobalStrings.get("dashboard", "deleted"));
            switch (context.page.page_name) {
                case "Page Configuration":
                    if (myData?.["Page"]?.["name"] === "Page Configuration") {
                        const newKeys = GlobalKeys.get(context.page.page_id).filter(k => k.name !== myData?.["Name"]);
                        GlobalKeys.set(context.page.page_id, newKeys);
                        setKeys(newKeys);
                    }
                    if (context.parentPage?.page_id && myData?.["Page"]?.["_id"] === context.parentPage?.page_id) {
                        GlobalKeys.set(context.parentPage.page_id, GlobalKeys.get(context.page.page_id).filter(k => k.name !== myData?.["Name"]));
                    }
                    break;
                case "Pages":
                    GlobalPages.remove(myData?._id);
                    break;
                case "Module":
                    GlobalModules.set(GlobalModules.get().filter(m => m.name !== myData["Name"]));
                    break;
                default:
                    break;
            }
            if (CallBacks.deleteCallBack) CallBacks.deleteCallBack(myData?._id);
        }
    }

    return (
        <>
            <div className="grid gap-2 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-12 md:gap-3">
            { render && keys.map((k: KeyModel, i: number) => (
                (k.active === "Always"  || (k.active === "Conditionally" && isActiveKey(data, keys, i))) && (
                    <div key={i} className="col-span-2 sm:col-span-2 md:col-span-4">
                        <FieldSet>
                            <Label>
                                {k.name}
                            </Label>
                            { k.readable_dtype === 'Line' ? (
                                <Input.Line name={k.name} maxLength={k.max_length} defaultValue={data[k.name] ?? ''} required={k.required} onChange={updateData} />
                            ): k.readable_dtype === 'Multiline' ? (
                                <Input.Multiline name={k.name} maxLength={k.max_length} defaultValue={data[k.name] ?? ''} required={k.required} onChange={updateData} />
                            ): k.readable_dtype === 'Choice' ? (
                                <Input.Select name={k.name} value={data?.[k.name] ?? ""} required={k.required} onChange={updateData} options={k?.options && k.options.map(o => { return { value: o } }) || []} />
                            ): k.readable_dtype === "Multiple Choice" ? (
                                <Input.MultiSelect name={k.name} value={data?.[k.name] ?? ""} required={k.required} onChange={updateData} options={k?.options && k.options.map(o => { return { value: o } }) || []} />
                            ) : k.readable_dtype === 'Quantity' ? (
                                <Input.Quantity name={k.name} defaultValue={data[k.name] ?? ''} required={k.required} onChange={updateData} max={k.max} min={k.min} decimals={k.decimals} />
                            ): k.readable_dtype === 'Date & Time' ? (
                                <Input.DateTime name={k.name} defaultValue={data[k.name] ? formatDateTime(data[k.name]) : ''} required={k.required} disabled={k.name === "Created On" || k.name === "Updated On"} onChange={updateData} />
                            ): k.readable_dtype === 'Date' ? (
                                <Input.Date name={k.name} defaultValue={data[k.name] ? formatDate(data[k.name]) : ''} required={k.required} onChange={updateData} />
                            ) : k.readable_dtype === 'Percentage' ? (
                                <Input.Percent name={k.name} defaultValue={data[k.name] ?? ''} required={k.required} onChange={updateData} />
                            ): k.readable_dtype === 'Reference' ? (
                                <Input.Reference name={k.name} defaultValue={data?.[k.name] ?? new ReferenceClass()} page={k?.reference ?? new ReferenceClass()} placeholder={(k?.reference?._id ?? null) === context?.parentPage?.page_id ? new ReferenceClass(context?.parentPage?.page_id, context?.parentPage?.page_name) : new ReferenceClass()} required={k.required} disabled={k.name === "Created By" || k.name === "Updated By"} onChange={updateData} />
                            ): k.readable_dtype === 'True/False' ? (
                                <Input.Checkbox name={k.name} checked={data[k.name]} required={k.required} onChange={updateData} />
                            ): k.readable_dtype === 'Money' ? (
                                <Input.Money name={k.name} defaultValue={data[k.name] ?? ''} currency={k.currency ?? "USD"} required={k.required} onChange={updateData} max={k?.max} min={k?.min} decimals={k?.decimals} />
                            ): k.readable_dtype === 'Script' ? (
                                <Input.Script name={k.name} defaultValue={data?.[k.name]} standard={data?.Standard ?? false} required={k.required} onChange={updateData} />
                            ) : k.readable_dtype === 'URL' ? (
                                <Input.Line type="url" name={k.name} defaultValue={data[k.name] ?? ''} maxLength={k.max_length} required={k.required} onChange={updateData} />
                            ) : k.readable_dtype === 'List' ? (
                                <Input.List name={k.name} defaultValue={data[k.name] ?? ''} required={k.required} onChange={updateData} />
                            ) : k.readable_dtype === 'Conditions' ? (
                                <Input.Conditions name={k.name} defaultValue={data[k.name] ?? []} pageId={context.page.page_id} required={k.required} onChange={updateData} />
                            ) : k.readable_dtype === 'File' ? (
                                <Input.File name={k.name} maxLength={k.max_length} defaultValue={data[k.name]} required={k.required} onChange={updateData} preview size={k?.size} types={k?.types} />
                            ) : null
                        }
                        </FieldSet>
                    </div>
                )
            )) }
            </div>
            <div className='flex flex-row items-center justify-end mt-2 space-x-2'>
                <SeeAllButton />
                <SaveButton onSubmit={getData} data={data} />
                <DeleteButton onSubmit={getData} data={data} />
            </div>
        </>
    )
}

const SeeAllButton = () => {
    const { context, setContext } = useFormContext();
    const data = context.position !== undefined ? GlobalData.get(context.page.page_id)[context.position] : {};

    return validateString(data?._id) && (
        <div>
            <Button variant='outlined' onClick={() => 
                window.location.href = `?id=${context.page.page_id}&item=${data?._id}`
            }>
                {GlobalStrings.get("dashboard", "seeFull")}
            </Button>
        </div>
    );
}

const DeleteButton = ({
    data,
    onSubmit
}: {
    data: Record<string, any>;
    onSubmit: Function
}) => {
    const { context, setContext } = useFormContext();

    return hasRole("delete_role", context.page.page_name) && validateString(data?._id) && (
        <div>
            <Button variant='outlined' onClick={() => onSubmit("delete")} disabled={context.disabled}>
                {GlobalStrings.get("dashboard", "delete")}
            </Button>
        </div>
    );
}

const SaveButton = ({
    data,
    onSubmit
}: {
    data: Record<string, any>;
    onSubmit: Function
}) => {
    const { context, setContext } = useFormContext();

    return (
        <div>
            {
                validateString(data?._id) ? hasRole("update_role", context.page.page_name) && (
                    <Button variant='outlined' onClick={() => onSubmit("update")} disabled={context.disabled}>
                        {GlobalStrings.get("dashboard", "save")}
                    </Button>
                ): hasRole("create_role", context.page.page_name) && (
                    <Button variant='outlined' onClick={() => onSubmit("create")} disabled={context.disabled}>
                        {GlobalStrings.get("dashboard", "save")}
                    </Button>
                )
            }
        </div>
    );
}