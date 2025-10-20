import { Roles } from "./Roles";
import { Pages } from "./Pages";
import { DefaultResponse } from "./DefaultResponse";
import { LanguageKey } from "@/asset/language";

export interface LoginResponse extends DefaultResponse {
    access: string;
    modules: string[];
    roles: Roles;
    pages: Pages[];
    name: string;
    nms: boolean;
    language: LanguageKey;
}