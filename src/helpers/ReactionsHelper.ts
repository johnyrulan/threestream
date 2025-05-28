import GiphyService from "@/services/GiphyService";

export default class ReactionsHelper {
    static reactions = [
        'https://junkieprodstorage.blob.core.windows.net/reaction/dog-pumpkin.webp',
        'https://junkieprodstorage.blob.core.windows.net/reaction/ghost-flying.webp',
        'https://junkieprodstorage.blob.core.windows.net/reaction/pumpkin-boo.webp',
        'https://junkieprodstorage.blob.core.windows.net/reaction/pumpkin-bounce.webp',
        'https://junkieprodstorage.blob.core.windows.net/reaction/pumpkin-dancing.webp',
        'https://junkieprodstorage.blob.core.windows.net/reaction/pumpkin-hands.webp',
        'https://junkieprodstorage.blob.core.windows.net/reaction/pumpkin-kid-dance.webp',
        'https://junkieprodstorage.blob.core.windows.net/reaction/pumpkin-skeleton-dance.gif',
        'https://junkieprodstorage.blob.core.windows.net/reaction/skeleton-dance.webp',
        'https://junkieprodstorage.blob.core.windows.net/reaction/skeleton-shake.webp',
        'https://junkieprodstorage.blob.core.windows.net/reaction/where-ghouls-at.gif',
        'https://junkieprodstorage.blob.core.windows.net/reaction/pumpkin-man-dance.gif',
    ];

    static isReaction(text: string): boolean {
        return text.startsWith('https://')
            && (text.includes('.gif') || text.includes('.webp'))
            // && this.reactions.includes(text)
    }

}