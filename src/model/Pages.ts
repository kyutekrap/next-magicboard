"use client";

import type { PageModel } from "@/model/types";
import { setter, getter, collector, finder, IndexedDB, adder, remover } from "@/cachier-api";


export class GlobalPages extends IndexedDB {

    private static data: PageModel[] | undefined;
    protected static __name__ = "GlobalPages";

    @setter
    static async set(pages: PageModel[]): Promise<void> {
        GlobalPages.data = pages;
    }

    @finder
    static async get(page_id: string): Promise<PageModel | undefined> {
        return GlobalPages.data?.find(d => d.page_id === page_id);
    }

    @getter
    static async getAll(): Promise<PageModel[] | undefined> {
        return GlobalPages.data;
    }

    @collector
    static async clear(): Promise<void> {
        GlobalPages.data = undefined;
    }

    @adder
    static async add(page: PageModel): Promise<void> {
        if (GlobalPages.data) GlobalPages.data.push(page);
    }

    @adder
    static async update(page: PageModel): Promise<void> {
        if (GlobalPages.data) {
            GlobalPages.data = GlobalPages.data.map(p => {
                if (p.page_id === page.page_id) return page;
                else return p;
            })
        }
    }

    @remover
    static async remove(page_id: string): Promise<void> {
        if (GlobalPages.data) GlobalPages.data.filter(d => d.page_id !== page_id);
    }
}