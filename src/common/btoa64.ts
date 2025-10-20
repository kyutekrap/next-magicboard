export function btoa64(str: string) {
    // Convert string to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(str);
    // Convert to Base64 string
    return btoa(String.fromCharCode(...utf8Bytes));
}