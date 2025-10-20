"use client";

import { formatBoolean, formatDate, joinList, stringifyConditions } from "@/common";
import { GlobalData, GlobalKeys, GlobalStrings } from "@/model";
import { Button, Header, Paragraph } from "@/components";
import { useState } from "react";

export const Export = ({
    pageId
}: {
    pageId: string
}) => {
    const keys = GlobalKeys.get(pageId);
    const records = GlobalData.get(pageId).slice(0, 200);
    const [disabled, setDisabled] = useState(false);

    function escapeCsvValue(value: any): string {
        if (typeof value === 'string') {
            // Escape double quotes
            value = value.replace(/"/g, '""');
            // Wrap in double quotes if it contains a comma or double quote
            if (value.includes(',') || value.includes('"')) {
                return `"${value}"`;
            }
        }
        return value !== undefined && value !== null ? value.toString() : '';
    }

    function exportData() {
        setDisabled(true);

        // The csv in list
        var dataList: string[] = [];

        // Headers in first row
        var headers: string[] = [];
        keys.map(k => headers.push(k.name));
        dataList.push(headers.join(',') + '\n');

        // Each row of records
        records.map(d => {
            var data: string[] = []
            keys.map(k => {
                var value = null
                switch (k.readable_dtype) {
                    case 'Date & Time':
                        value = formatDate(d[k.name]);
                        break;
                    case 'Date':
                        value = formatDate(d[k.name]);
                        break;
                    case 'Reference':
                        value = d[k.name] ? `${d[k.name]?.name}(${d[k.name]?._id})` : '';
                        break;
                    case 'True/False':
                        value = formatBoolean(d[k.name]);
                        break;
                    case 'Conditions':
                        value = stringifyConditions(d[k.name]).replace("\n", "");
                        break;
                    case 'List':
                        value = joinList(d[k.name]);
                        break;
                    default:
                        value = value ?? d[k.name] ?? '';
                }
                data.push(escapeCsvValue(value));
            });
            dataList.push(data.join(',') + '\n');
        });

        // Download file
        const blob = new Blob(dataList, { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();

        setDisabled(false);
    }
    
    return (
        <div>
            <Header>{GlobalStrings.get("dashboard", "export")}</Header>
            <Paragraph textAlign="center">{GlobalStrings.get("dashboard", "maxRecords")}</Paragraph>
            <div className="mt-4">
                <Button disabled={disabled} variant="contained" onClick={() => exportData()}>{GlobalStrings.get("dashboard", "download")}</Button>
            </div>
        </div>
    );
}