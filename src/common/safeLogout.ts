import { GlobalPages } from "@/model";
import { LogoutService } from "@/service";

export function safeLogout(fallback?: Function) {
    LogoutService().then(() => {
        sessionStorage.clear();
        localStorage.clear();
        Promise.all([
            GlobalPages.clear()
        ]).then(_ => {
            window.location.href = "/";
        }).catch(_ => {
            if (fallback) fallback();
        });
    });
}