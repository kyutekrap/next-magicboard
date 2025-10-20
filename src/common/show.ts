"use client";

import ReactDOM from 'react-dom/client';

export function show(children: any, size: 'small' | 'medium' | 'big' = 'small') {
    const node = document.getElementById("__backdrop_container_node__") as HTMLDivElement;
    if (node) {
        const root = ReactDOM.createRoot(node);
        root.render(children);
    }
    const container = document.getElementById("__backdrop_container__")?.classList;
    container?.remove("hidden");
    container?.add("block");
    const child = document.getElementById("__backdrop_container_child__")?.classList;
    if (size === "small") {
        child?.remove("md:w-6/12");
        child?.add("md:w-4/12");
    } else if (size === "medium") {
        child?.remove("md:w-4/12");
        child?.add("md:w-6/12");
    }
    const backdrop = document.getElementById("__backdrop__")?.classList;
    backdrop?.remove("hidden");
    backdrop?.remove("block");
}