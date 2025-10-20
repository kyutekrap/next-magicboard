"use client";

import IndexedDBUtility from "../utils/IndexedDBUtility";
import { CachierType } from "../types";

export function getter(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    try {
        const originalMethod = descriptor.value;
        const cachier: CachierType = target.__cachier__;
        switch(cachier) {
            case "session": 
                descriptor.value = function (...args: any[]) {
                    let result = originalMethod.apply(this, args);
                    if (!result) {
                        result = sessionStorage.getItem(target.__name__);
                        if (result) result = JSON.parse(result);
                    }
                    return result;
                }
                break;
            case "local":
                descriptor.value = function (...args: any[]) {
                    let result = originalMethod.apply(this, args);
                    if (!result) {
                        result = localStorage.getItem(target.__name__);
                        if (result) result = JSON.parse(result);
                    }
                    return result;
                }
                break;
            case "indexedDB":
                descriptor.value = async function (...args: any[]) {
                    let result = await originalMethod.apply(this, args);
                    if (!result) {
                        const db = new IndexedDBUtility();
                        result = db.getAll(target.__name__).then(response => response);
                    }
                    return result;
                }
                break;
            default:
                descriptor.value = function (...args: any[]) {
                    let result = originalMethod.apply(this, args);
                    return result;
                }
                break;
        }
    } catch (e) {
        console.error(e);
    }
}