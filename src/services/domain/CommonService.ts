import ErrorLogger from "@/helpers/ErrorLogger";
import { TYPE, useToast } from "vue-toastification";
import { ApiErrorResponse } from "../api/models";

export default class CommonService {
    private static readonly toast = useToast();

    static async showError(err: any) {
        const apiErrors: ApiErrorResponse = await ErrorLogger.logApiError(err as any);
        apiErrors.errors?.forEach((err: any) => this.toast(err, { type: TYPE.ERROR }));
    }
}