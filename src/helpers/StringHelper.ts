export default class StringHelper {
    static isNullOrEmpty(string: string | null | undefined): boolean {
        if (!string) return true;

        return string.trim().length === 0;
    }

    static getFirst(string: string) {
        return string?.charAt(0) ?? '';
    }
}