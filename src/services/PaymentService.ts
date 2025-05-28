import { Payment } from "./api/models";
import { RestApi } from "./RestApi";

export default class PaymentService {

    static async listCustomerCards(customerEmail: string) {
        return (await RestApi.Payment.listCustomerCards(customerEmail)).data;
    }

    static async saveCustomerPayment(payment: Payment) {
        return (await RestApi.Payment.saveCustomerPayment(payment)).data;
    }

    static async setDeafutlCustomerCard(customerId: string, cardId: string) {
        return (await RestApi.Payment.setDefautlCustomerCard(customerId, cardId)).data;
    }
}