export function toTimestamp(dateStr: string) {
    // If the date string is in yyyy-mm-dd format, add the time component
    if (dateStr.length === 10) {
        dateStr += "T00:00:00";
    }

    const dateObject = new Date(dateStr);
    return isValidDate(dateObject) ? dateObject.getTime() : NaN;
}

function isValidDate(date: Date) {
    return !isNaN(date.getTime());
}