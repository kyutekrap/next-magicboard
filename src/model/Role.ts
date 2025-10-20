"use client";

import type { RoleKey, RoleModel } from "@/model/types";
import { getter, LocalBank, setter } from "@/cachier-api";


export class GlobalRole extends LocalBank {

    private static data: RoleModel;
    protected static __name__ = "GlobalRole";

    @setter
    static set(data: RoleModel): void {
        GlobalRole.data = data;
    }

    @getter
    static get(): RoleModel {
        return GlobalRole?.data;
    }

    static getRole(role: RoleKey): string[] {
        const roles = GlobalRole.get();
        return roles?.[role] ?? [];
    }
}