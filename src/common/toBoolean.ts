export function toBoolean(str: string | undefined): boolean {
    if (str !== undefined) {
        switch(str.toLowerCase().trim()) {
            case "true": 
            case "1": 
                return true;
            case "false": 
            case "0": 
            case null: 
            case undefined:
            case "":
                return false;
            default: 
                return Boolean(str);
        }
    }
    return false
}