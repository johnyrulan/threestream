import IBlockchainProvider from "@/interfaces/IBlockchainProvider";
import NFTAsset from "@/models/NFTAsset";
import { Blockchain } from "../api/models";
import { BlockChainRequest } from "../api/models/block-chain-request";
import { RestApi } from "../RestApi";

export default class SolanaBlockchainProvider implements IBlockchainProvider {

    async getAssetsByOwner(address: string, page: number, limit: number, searchValue: string | null): Promise<NFTAsset[]> {
        const apiAssets = await RestApi.Blockchain.getByOwnerId({
            blockchain: Blockchain.Solana,
            ownerAddress: address,
            offset: (page - 1) * limit,
            limit: limit,
            searchValue: searchValue
        } as BlockChainRequest);

        return apiAssets.data.map(a => NFTAsset.generateSolanaAsset(a));
    }

    async getAssetById(contractAddress: string, tokenId: string): Promise<NFTAsset> {
        const asset = await RestApi.Blockchain.getAssetById(Blockchain.Solana, contractAddress, tokenId);

        return NFTAsset.generateSolanaAsset(asset.data);
    }

}