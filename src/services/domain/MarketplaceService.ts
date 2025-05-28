import { RestApi } from "../RestApi";
import { Blockchain, MarketplaceCollectionResponseModel, MarketplaceFilterRequest, MarketplaceResponseModel } from "../api/models";

export default class MarketplaceService {

    static async getSales(filters: MarketplaceFilterRequest): Promise<MarketplaceResponseModel> {
        if (!filters.blockchain || filters.blockchain === 'All') filters.blockchain = '';
        return (await RestApi.Marketplace.getSales(filters)).data;
    }

    static async getCollections (blockchain: Blockchain): Promise<MarketplaceCollectionResponseModel[]> {
        return (await (RestApi.Marketplace.getCollections(blockchain))).data;
    }
}