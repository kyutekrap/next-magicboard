"use client";

import IndexedDBUtility from "../utils/IndexedDBUtility";
import { CachierType } from "../types";

export function setter(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    try {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const cachier: CachierType = target.__cachier__;
            switch (cachier) {
                case "session":
                    sessionStorage.setItem(target.__name__, JSON.stringify(args?.[0]));
                    break;
                case "local":
                    localStorage.setItem(target.__name__, JSON.stringify(args?.[0]));
                    break;
                case "indexedDB":
                    const db = new IndexedDBUtility();
                    db.clearStore(target.__name__).then(() => {
                        db.addData(target.__name__, args?.[0]).then(() => {
                            return;
                        });
                    });
                    break;
                default:
                    break;
            }
            originalMethod.apply(this, args);
        };
    } catch (e) {
        console.error(e);
    }
}