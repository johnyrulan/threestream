import IBlockchainProvider from "@/interfaces/IBlockchainProvider";
import NFTAsset from "@/models/NFTAsset";
import { Blockchain, BlockChainRequest } from "../api/models";
import { RestApi } from "../RestApi";

export default class EVMBlockchainProvider implements IBlockchainProvider {

    blockchain: Blockchain;

    constructor(blockchian: Blockchain) {
        this.blockchain = blockchian;        
    }

    async getAssetsByOwner(address: string, page: number, limit: number, searchValue: string | null): Promise<NFTAsset[]> {
        const apiAssets = await RestApi.Blockchain.getByOwnerId({
            blockchain: this.blockchain,
            ownerAddress: address,
            offset: (page - 1) * limit,
            limit: limit,
            searchValue: searchValue
        } as BlockChainRequest);

        return apiAssets.data.map(a => NFTAsset.generateEVMAsset(a));
    }
    
    async getAssetById(contractAddress: string, tokenId: string): Promise<NFTAsset> {
        const asset = await RestApi.Blockchain.getAssetById(this.blockchain, contractAddress, tokenId);

        return NFTAsset.generateEVMAsset(asset.data);
    }

}