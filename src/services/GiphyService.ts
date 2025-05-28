import { GiphyFetch } from "@giphy/js-fetch-api";

export default class GiphyService {
    static gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY)

    static async getTrendingGIFs(offset: number , limit: number = 10) {
        const fetchGifs = await this.gf.trending({ offset, limit })

        return fetchGifs;
    }

    static async searchGIFs(searchValue: string, offset: number, limit: number = 10) {
        const fetchGifs = await this.gf.search(searchValue, { offset, limit });

        return fetchGifs;
    }
}