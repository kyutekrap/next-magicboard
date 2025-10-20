"use client";

import { useEffect } from "react";
import IconButton from "../IconButton";

export const Snackbar = () => {
    function closeSnackbar() {
        const classes = document.getElementById("__snackbar__")?.classList;
        classes?.remove("block");
        classes?.add("hidden");
    }

    useEffect(() => {setTimeout(() => closeSnackbar(), 5000);}, []);

    return (
        <div id="__snackbar__"
        className={`hidden fixed flex items-center w-full max-w-xs px-4 py-2 space-x-4 bottom-5 left-5 text-foreground bg-background
            rounded-lg shadow dark:text-background dark:bg-foreground transition-all duration-500 ease-in-out z-20`}>
            <span id="__snackbar_message__" className="text-sm flex-1"></span>
            <IconButton onClick={() => closeSnackbar()}>
                <img src="/icons/close.svg" width={16} height={166} />
            </IconButton>
        </div>
    );
}