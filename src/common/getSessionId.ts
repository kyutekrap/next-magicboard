import { validateString } from "./validateString";
import { GlobalAuth, GlobalToken } from "@/model";

export function getSessionId(): string {
    let apiKey: string = GlobalAuth.get();
    if (!validateString(apiKey)) apiKey = GlobalToken.get();
    return apiKey;
}