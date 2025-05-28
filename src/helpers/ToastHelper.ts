import { useToast } from "vue-toastification";

export default class ToastHelper {
    private static readonly toast = useToast()

    static success(message: string) {
        this.toast.success(message)
    }

    static error(message: string) {
        this.toast.error(message)
    }

    static warning(message: string) {
        this.toast.warning(message)
    }
}