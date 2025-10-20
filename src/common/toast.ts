export function toast(message: string) {
    const snackbar = document.getElementById("__snackbar__")?.classList;
    const content = document.getElementById("__snackbar_message__") as HTMLSpanElement;
    if (content) {
        content.innerText = message;
    }
    snackbar?.remove("hidden");
    snackbar?.add("block");
}