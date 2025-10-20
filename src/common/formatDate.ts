export const formatDate = (timestamp: number): string => {
    if (timestamp !== undefined) {
        // Check if the timestamp is in seconds or milliseconds
        const isMilliseconds = timestamp > 9999999999;
        const date = new Date(isMilliseconds ? timestamp : timestamp * 1000);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    } else return '';
};