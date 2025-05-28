import { Address } from "@/services/api/models";

export default class FormatHelper {
    static convertAddressToString(address: Address) {
        if (!address || !address.street1) return '';

        return `${address.street1}, ${address.city}, ${address.state}, ${address.country}, ${address.zip}`;        
    }
}