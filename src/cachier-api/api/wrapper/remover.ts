"use client";

import { CachierType } from "../types";
import IndexedDBUtility from "../utils/IndexedDBUtility";

export function remover(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    try {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const cachier: CachierType = target.__cachier__;
            switch (cachier) {
                case "indexedDB":
                    const db = new IndexedDBUtility();
                    db.deleteItem(target.__name__, args?.[0]).then(() => {
                        return;
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