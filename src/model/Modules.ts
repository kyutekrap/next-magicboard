"use client";

import { ModuleModel } from "@/model/types";
import { getter, LocalBank, setter } from "@/cachier-api";


export class GlobalModules extends LocalBank {

    private static data: ModuleModel[];
    protected static __name__ = "GlobalModules";

    @setter
    static set(modules: ModuleModel[]): void {
        GlobalModules.data = modules;
    }

    @getter
    static get(): ModuleModel[] {
        return GlobalModules?.data;
    }

    static getActivated(): null | ModuleModel {
        const modules = GlobalModules.get();
        return modules.length > 0 ? modules.find((m: ModuleModel) => m.activated) ?? modules[0] : null;
    }
}