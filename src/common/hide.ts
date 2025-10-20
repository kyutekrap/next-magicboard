export function hide() {
    const container = document.getElementById("__backdrop_container__")?.classList;
    container?.remove("block");
    container?.add("hidden");
    const backdrop = document.getElementById("__backdrop__")?.classList;
    backdrop?.remove("block");
    backdrop?.add("hidden");
}