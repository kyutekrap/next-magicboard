export const prepareFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // Ensure it reads as Data URL (string)
        reader.onload = () => {
            const result = reader.result; // result can be string | ArrayBuffer
            if (typeof result === "string") {
                resolve(result.split(",")[1]); // Safely split the base64 string
            } else {
                reject(new Error("Unexpected FileReader result type."));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};