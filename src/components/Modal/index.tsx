"use client";

import { Paper } from "../Paper";
import IconButton from "../IconButton";
import { hide } from "@/common";

export const Modal = () => {
    return (
        <>
            <div id="__backdrop__" className="hidden z-20 bg-foreground bg-opacity-50 fixed w-screen top-0 bottom-0" />
            <div id="__backdrop_container__" className="z-20 hidden fixed inset-0 flex justify-center items-center w-full h-full">
                <div id="__backdrop_container_child__" className="w-11/12 z-30 max-h-[90vh] overflow-y-auto pr-4 scrollbar-hide">
                    <Paper>
                        <div className="p-4">
                            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
                                <IconButton onClick={hide}>
                                    <img src="/icons/close.svg" width={20} height={20} className="dark:invert" />
                                </IconButton>
                            </div>
                            <div id="__backdrop_container_node__" />
                        </div>
                    </Paper>
                </div>
            </div>
        </>
    );
}