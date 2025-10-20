"use client";

import IndexedDBUtility from "../utils/IndexedDBUtility";
import { CachierType } from "../types";

export function finder(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    try {
        const originalMethod = descriptor.value;
        const cachier: CachierType = target.__cachier__;
        switch(cachier) {
            case "session":
                descriptor.value = function (...args: any[]) {
                    let result = originalMethod.apply(this, args);
                    if (!result) {
                        result = sessionStorage.getItem(target.__name__);
                        if (result) {
                            result = JSON.parse(result);
                            result = args.reduce((accumulator: { [x: string]: any; }, key: string | number) => {
                                return accumulator && accumulator[key];
                            }, result);
                        }
                    }
                    return result;
                }
                break;
            case "local":
                descriptor.value = function (...args: any[]) {
                    let result = originalMethod.apply(this, args);
                    if (!result) {
                        result = localStorage.getItem(target.__name__);
                        if (result) {
                            result = JSON.parse(result);
                            result = args.reduce((accumulator: { [x: string]: any; }, key: string | number) => {
                                return accumulator && accumulator[key];
                            }, result);
                        }
                    }
                    return result;
                }
                break;
            case "indexedDB":
                descriptor.value = async function (...args: any[]) {
                    let result = await originalMethod.apply(this, args);
                    if (!result) {
                        const db = new IndexedDBUtility();
                        result = db.get(target.__name__, args?.[0] ?? "").then(response => response);
                    }
                    return result;
                }
                break;
            default:
                break;
        }
    } catch (e) {
        console.error(e);
    }
}