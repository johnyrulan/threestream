export default class NumberHelper {
    static normalizeCurrencyToSave(val: number) {
        return val * 100;
    }

    static normalizeCurrencyFromAPI(val: number) {
        return val / 100;
    }

    static calculateRoyalty(val: number) {
        return (val) + (val * .1);
    }
}