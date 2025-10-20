"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@/components";
import { GlobalStrings } from "@/model";
import { CodeCompilerService } from "@/service";
import { CodeCompilerPayload, CodeCompilerResponse } from "@/service/types";
import { Editor as RealEditor, EditorProps } from "@monaco-editor/react";
import { hide, toast } from "@/common";

const MonacoEditor = (props: EditorProps) => {
    const [editorTheme, setEditorTheme] = useState(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light'
    );

    useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Handler to update theme dynamically
    const handleThemeChange = (e: { matches: any; }) => {
        setEditorTheme(e.matches ? 'vs-dark' : 'vs-light');
    };

    // Add listener for changes
    mediaQuery.addEventListener('change', handleThemeChange);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }, []);

    return (
        <RealEditor
            {...props}
            height='100%'
            defaultLanguage="python"
            options={{
                scrollBeyondLastLine: false,
                minimap: { enabled: false },
                smoothScrolling: true,
                scrollbar: { verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
            }}
            theme={editorTheme}
            loading={
                <CircularProgress />
            }
        />
    )
};

export const Editor = ({
    value,
    setValue
}: {
    value?: string,
    setValue?: Function
}) => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string | null>();
    const [strings, setStrings] = useState<Record<string, string>>({});
    const [disabled, setDisabled] = useState(false);
    const [showOutput, setShowOutput] = useState(false);

    useEffect(() => {
        setStrings(GlobalStrings.getAll("dashboard"));
        setInput(value ? value : GlobalStrings.get("dashboard", 'initialInput'));
    }, []);

    function onRun() {
        if (!input) {
            toast(strings?.emptyMessage);
            return;
        }
        setDisabled(true);
        const payload: CodeCompilerPayload = {
            code_block: input
        }
        CodeCompilerService(payload).then((response: CodeCompilerResponse) => {
            if (response !== null) {
                setOutput(response.output);
                setShowOutput(true);
            }
        }).finally(() => {
            setDisabled(false);
        });
    };

    function onSave() {
        hide();
        if (setValue) setValue(input);
    }
    
    return (
        <div className="flex flex-col gap-2 h-[80vh] w-full relative">
            <div className="flex flex-row gap-2">
                <div>
                    <Button variant="outlined" onClick={onRun} disabled={disabled}>
                        {strings?.run}
                    </Button>
                </div>
                <div>
                    <Button variant="contained" onClick={onSave}>
                        {strings?.save}
                    </Button>
                </div>
            </div>
            <div className="border border-neutral h-full">
                <MonacoEditor onChange={(value) => setInput(value ?? '')} value={input} />
            </div>

            {/* Toggle Output Section */}
            <div
                className={`absolute bottom-0 w-full bg-background dark:bg-foreground border-t border-neutral transition-all duration-300 ease-in-out ${
                showOutput ? 'h-[250px] p-2.5 opacity-100' : 'h-[0px] p-0 opacity-0'
                } overflow-auto whitespace-pre-line`}
            >
                {showOutput && (output !== null ? output : strings?.executionResult)}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setShowOutput(!showOutput)}
                className={`${showOutput ? "block": "hidden"}
                    absolute bottom-[260px] right-4 bg-neutral rounded-full p-2 transition-all duration-300 ease-in-out`}
            >
                <img src="/icons/close.svg" width={12} height={12} />
            </button>
        </div>
    );
}