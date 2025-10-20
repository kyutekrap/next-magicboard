'use client';

import { validateAllKeys, toBoolean, toNumber, toTimestamp, toast, hide } from "@/common";
import { GlobalKeys, GlobalStrings } from "@/model";
import { Input, Paragraph, Button } from "@/components";
import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { ConditionModel, KeyModel, OptionModel } from "@/model/types";
import { GlobalFilter } from "@/model/Filter";
import List from "../List";
import IconButton from "../IconButton";
import { OptionClass } from "@/model/classes";

interface context_tp {
    pageId: string
    conditions: ConditionModel[]
    key: string
    operator: string
    value: string
}

interface filterContext_tp {
    context: context_tp;
    setContext: React.Dispatch<React.SetStateAction<context_tp>>;
}

const FilterContext = createContext<filterContext_tp | undefined>(undefined);
const useFilterContext = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};

const operators: Record<string, string[]> = {
    "Date & Time": ["<=", ">=", "<", ">", "=", "!="],
    "Date": ["<=", ">=", "<", ">", "=", "!="],
    "Line": ["is", "is not", "like"],
    "Multiline": ["is", "is not", "like"],
    "True/False": ["is"],
    "Reference": ["is", "is not"],
    "Choice": ["is", "is not"],
    "Multiple Choice": ["is", "is not", "has"],
    "Quantity": ["<=", ">=", "<", ">", "=", "!="],
    "Money": ["<=", ">=", "<", ">", "=", "!="],
    "Conditions": ["like"],
    "URL": ["is", "is not", "like"],
    "List": ["like"],
    "Percentage": ["<=", ">=", "<", ">", "=", "!="],
    "Script": ["like"]
}

const Key = ({ keys, context, setContext }: { keys: KeyModel[]; context: context_tp, setContext: Function }) => {
    const handleChange = React.useCallback((event: Record<string, string>) => {
        const [[, value]] = Object.entries(event);
        setContext({...context, key: value, operator: "", value: ""});
    }, [keys, context, setContext]);

    const [options, setOptions] = useState<OptionModel[]>([]);

    useEffect(() => {
        const newOptions: OptionModel[] = [];
        keys.map(k => {
            newOptions.push(new OptionClass(k.name));
        });
        setOptions(newOptions);
    }, []);

    return (
        <div className="flex flex-col flex-1 space-y-1">
            <Input.Select onChange={handleChange} name="Key" options={options} />
            <small style={{ textAlign: 'center' }}>{GlobalStrings.get("dashboard", "key")}</small>
        </div>
    );
};

const Operator = ({
    keys, context, setContext
}: {
    keys: KeyModel[], context: context_tp, setContext: Function
}) => {    
    const type = keys.find(k => k.name === context.key)?.readable_dtype ?? "";

    function handleChange(e: Record<string, string>) {
        const [[, value]] = Object.entries(e);
        setContext({...context, operator: value});
    }

    return (
        <div className="flex flex-col flex-1 space-y-1">
            <Input.Select onChange={handleChange} textAlign="center" options={(operators?.[type] || []).map((o: string) => { return { value: o } } )} />
            <small style={{textAlign: 'center'}}>{GlobalStrings.get("dashboard", "operator")}</small>
        </div>
    );
};

const Value = ({
    keys, context, setContext
}: {
    keys: KeyModel[], context: context_tp, setContext: Function
}) => {
    const key: KeyModel = keys.find(k => k.name === context.key) ?? {} as KeyModel;
    const type = key?.readable_dtype ?? "";

    function handleChange(e: Record<string, any>) {
        const [[, value]] = Object.entries(e);
        setContext({...context, value: value});
    }

    return (
        <div className="flex flex-col flex-1 space-y-1">
            { type === "Line" ? (
                <Input.Line onChange={handleChange} />
            ): type === "Multiline" ? (
                <Input.Line onChange={handleChange} />
            ): type === "Choice" ? (
                <Input.Select onChange={handleChange} options={(key?.options || []).map(o => { return { value: o }; })} />
            ): type === "Multiple Choice" ? (
                <Input.MultiSelect onChange={handleChange} options={(key?.options || []).map(o => { return { value: o }; })} />
            ): type === "Quantity" ? (
                <Input.DateTime onChange={handleChange} />
            ): type === "Date & Time" ? (
                <Input.DateTime onChange={handleChange} />
            ): type === "Date" ? (
                <Input.Date onChange={handleChange} />
            ): type === "Percentage" ? (
                <Input.Percent onChange={handleChange} />
            ): type === "Reference" ? (
                <Input.Line onChange={handleChange} />
            ): type === "True/False" ? (
                <Input.Select onChange={handleChange} options={[{value: "True"}, {value: "False"}]} />
            ): type === "Money" ? (
                <Input.Money currency={key?.currency ?? 'USD'} onChange={handleChange} />
            ): type === "Script" ? (
                <Input.Line onChange={handleChange} />
            ): type === "URL" ? (
                <Input.Line type="url" onChange={handleChange} />
            ): type === "List" ? (
                <Input.Line onChange={handleChange} />
            ): type ==="Conditions" ? (
                <Input.Line onChange={handleChange} />
            ): type === "File" ? (
                <Input.Line onChange={handleChange} />
            ): <Input.Line /> }
            <small style={{textAlign: 'center'}}>{GlobalStrings.get("dashboard", "value")}</small>
        </div>
    );
};

const Controls = ({context, setContext}: {context: context_tp, setContext: Function}) => {
    const keys = GlobalKeys.get(context.pageId);

    return (
        <div className="flex flex-col sm:flex-row gap-1">
            <Key keys={keys} context={context} setContext={setContext} />
            <Operator keys={keys} context={context} setContext={setContext} />
            <Value keys={keys} context={context} setContext={setContext} />
        </div>
    );
}

export const Filter = ({
    children,
    pageId,
    defaultValue
}: {
    children: React.ReactNode,
    pageId: string,
    defaultValue?: ConditionModel[]
}) => {
    const [context, setContext] = useState<context_tp>({conditions: defaultValue ?? [], key: "", operator: "", value: "", pageId: pageId});

    return (
        <FilterContext.Provider value={{ context, setContext }}>
            <div className="h-96 flex flex-col">
                <Controls context={context} setContext={setContext} />
                <div className="mt-auto">
                    {children}
                </div>
            </div>
        </FilterContext.Provider>
    )
}

Filter.Preview = ({
    editable
}: {
    editable?: boolean
}) => {
    const { context, setContext } = useFilterContext();

    function removeCondition(i: number) {
        setContext({...context, conditions: context.conditions.filter((_, idx) => idx !== i)});
    }

    return (
        <div className="flex flex-row justify-between mt-4 items-end">
            <List>
            { context.conditions.map((c: ConditionModel, i: number) => (
                <div className="flex flex-row space-x-2 items-center">
                    { (editable === undefined || editable) && (
                        <IconButton onClick={() => removeCondition(i)}>
                            <img src="/icons/close.svg" width={12} height={12} className="dark:invert" />
                        </IconButton>
                    ) }
                    <Paragraph>{`${c.key} ${c.operator} ${typeof c.value === 'string' ? c.value : c.value?.name}`}</Paragraph>
                </div>
            )) }
            </List>
        </div>
    )
}

Filter.ButtonGroup = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex flex-row space-x-2 justify-end">
            {children}
        </div>
    )
}

Filter.Add = () => {
    let max = 5;
    const { context, setContext } = useFilterContext();

    function addCondition() {
        if (context.conditions.length === max) {
            toast(GlobalStrings.get("dashboard", "maxConditions"));
            return;
        }
        const condition: ConditionModel = {
            key: context.key,
            operator: context.operator,
            value: context.value
        }
        if (validateAllKeys(condition)) setContext({...context, conditions: [...context.conditions, condition]});
    }

    return (
        <div className="relative">
            <Button onClick={() => addCondition()}>{GlobalStrings.get("dashboard", "add")}</Button>
        </div>
    )
}

Filter.Run = () => {
    const { context, setContext } = useFilterContext();

    async function runCondition() {
        const newConditions: ConditionModel[] = context.conditions.map((c) => {
            const type = GlobalKeys.get(context.pageId).find(k => k.name === c.key)?.readable_dtype;
            if (type === "Date" || type === "Date & Time") return {...c, value: toTimestamp(c.value as string)}
            else if (type === "True/False") return {...c, value: toBoolean(c.value as string)}
            else if (type === "Quantity" || type === "Money" || type === "Percentage") return {...c, value: toNumber(c.value as string)}
            else return c
        });
        GlobalFilter.set({[context.pageId]: newConditions});
        hide();
        location.reload();
    }
    
    return (
        <div className="relative">
            <Button variant='contained' onClick={() => runCondition()}>
                {GlobalStrings.get("dashboard", "run")}
            </Button>
        </div>
    )
}

Filter.Save = ({
    onClick
}: {
    onClick: Function
}) => {
    const { context, setContext } = useFilterContext();

    function saveCondition() { 
        onClick(context.conditions); 
        hide();
    }

    return (
        <div>
            <Button variant='contained' onClick={() => saveCondition()}>
                {GlobalStrings.get("dashboard", "save")}
            </Button>
        </div>
    );
}