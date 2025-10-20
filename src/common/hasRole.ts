import { GlobalRole } from "@/model/Role";
import { RoleKey } from "@/model/types";

export function hasRole(role: RoleKey, pageName: string): boolean {
    const pages = GlobalRole.getRole(role);

    return pages.includes("*") || pages.includes(pageName);
}