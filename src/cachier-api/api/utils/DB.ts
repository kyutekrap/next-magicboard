"use client";

import { StoreConfig } from "./IndexedDBConfig";

export class GlobalDB {

    private static data: IDBDatabase | undefined;
    
    static async get(): Promise<IDBDatabase | undefined> {
        if (GlobalDB.data) return GlobalDB.data;
        await GlobalDB.set();
        return GlobalDB.data;
    }

    static async set(): Promise<void> {
        const { dbConfig } = require('./cachier.config.mjs');

        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open(dbConfig.dbName);
        
            request.onupgradeneeded = () => {
                const db = request.result;
        
                dbConfig.stores.forEach((storeConfig: StoreConfig) => {
                    if (!db.objectStoreNames.contains(storeConfig.name)) {
                            const store = db.createObjectStore(storeConfig.name, {
                                keyPath: storeConfig.keyPath,
                                autoIncrement: storeConfig.autoIncrement || false,
                        });
                        storeConfig.indices?.forEach((index) => {
                            store.createIndex(index.name, index.keyPath, {
                                unique: index.unique || false,
                            });
                        });
                    }
                });
            };
        
            request.onsuccess = (event) => {
                const dbRequest = event.target as IDBOpenDBRequest;
                GlobalDB.data = dbRequest.result;
                resolve();
            };
        
            request.onerror = (event) => {
                console.error('Error opening database:', (event.target as IDBOpenDBRequest).error);
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }    
}