"use client";

import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeProps {
    code: string;
    width?: string;
    height?: string;
}

export const Code: React.FC<CodeProps> = (
    { code, width = "400px", height = "200px" }
) => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
        <MonacoEditor
        width={width}
        height={height}
        language="python"
        value={code}
        options={{
            readOnly: true,
            automaticLayout: true,
        }}
        theme={isDarkMode ? 'vs-dark' : 'light'}
        />
    );
};