import { AxiosResponse } from "axios";

export default class ErrorLogger {

    static async logApiError(error: any, displayNotification = true): Promise<any> {
        console.log(error)
        const axiosErrors = error?.response?.data?.errors;

        const processingError = 'There was an error processing your request. Please contact support if the error persists at info@junkieapp.xyz';

        if (!axiosErrors || error.status === 500) return [processingError];

        // TODO: Perform error logging & toast notification

        return axiosErrors;
    }
}