import NFTAsset from "@/models/NFTAsset";

export default interface IBlockchainProvider {
    getAssetsByOwner(address: string, page: number, limit: number, searchValue: null | string, collection: null | string): Promise<NFTAsset[]>;

    getAssetById(contractAddress: string, tokenId: string): Promise<NFTAsset>;
}