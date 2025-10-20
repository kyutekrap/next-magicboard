// /** @type {import('cachier-api').IndexedDBConfig} */
export const dbConfig = {
    dbName: 'MagicBoard',
    version: 1,
    stores: [
        {
            name: 'GlobalPages',
            keyPath: 'page_id',
            autoIncrement: false,
        },
        {
            name: 'GlobalNotifications',
            keyPath: 'notification_id',
            autoIncrement: false
        }
    ]
};