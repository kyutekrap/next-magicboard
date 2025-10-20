"use client";

import { FlowModel, PageModel } from "@/model/types";
import { Button } from "../Button";
import { FieldSet } from "../FieldSet";
import { Input } from "../Input";
import { Label } from "../Label";
import { FlowClass, OptionClass } from "@/model/classes";
import { handleCustomButton, joinList } from "@/common";
import { GlobalStrings } from "@/model";
import { CircularProgress } from "../CircularProgress";
import { useState } from "react";

export const FlowSelection = ({
    flows,
    checkedData,
    page
}: {
    flows: FlowModel[],
    checkedData: Record<string, any>[],
    page: PageModel
}) => {
    const [status, setStatus] = useState<'default' | 'loading' | 'success' | 'fail'>('default');

    function runBulk(e: any) {
        e.preventDefault();
        setStatus('loading');
        const formData = new FormData(e.target);
        const flow = flows.find(f => f.name === formData.get("flow")) ?? new FlowClass();
        handleCustomButton(
            flow.flow_id,
            page,
            checkedData
        ).then(response => {
            if (response) setStatus("success");
            else setStatus("fail");
        });
    }

    return (
        <div className="flex flex-col space-y-2">
            <form onSubmit={runBulk}>
                <FieldSet direction="column">
                    <Label>{GlobalStrings.get("dashboard", "selectFlow")}:</Label>
                    <Input.Select options={flows.map(f => new OptionClass(f.flow_id, f.name))} name="flow" />
                </FieldSet>
                <FieldSet direction="column">
                    <Label>{checkedData.length} {GlobalStrings.get("dashboard", "recordsSelected")}</Label>
                    <Input.Multiline value={joinList(checkedData.map(c => c?.Name))} disabled />
                </FieldSet>
                <div className="pb-2">
                    { status === 'loading' ? (
                        <div className="w-full items-center">
                            <CircularProgress />
                        </div>
                    ): status === 'success' ? (
                        <span className="text-success">🥳 {GlobalStrings.get("dashboard", "successful")}</span>
                    ): status === 'fail' ? (
                        <span className="text-error">{GlobalStrings.get("error", "operationFailed")}</span>
                    ): null }
                </div>
                <Button type="submit" variant="contained" disabled={status === 'loading'}>
                    {GlobalStrings.get("dashboard", "run")}
                </Button>
            </form>
        </div>
    )
}