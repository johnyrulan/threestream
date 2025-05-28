import IBlockchainProvider from "@/interfaces/IBlockchainProvider";
import NFTAsset from "@/models/NFTAsset";
import { ExplorerApi } from "atomicassets";
import { IAsset } from "atomicassets/build/API/Explorer/Objects";
import { Blockchain, BlockchainAssetMetadata } from "../api/models";
import { RestApi } from "../RestApi";

export default class WaxProvider implements IBlockchainProvider {

    api = new ExplorerApi(import.meta.env.VITE_WAX_EXPLORER_ENDPOINT, "atomicassets", {})

    assetCache: any = {};

    async getAssetsByOwner(address: string, page: number, limit: number, searchValue: null | string, collection: null | string): Promise<NFTAsset[]> {
        const waxAssets = await this.api.getAssets({
            owner: address,
            is_transferable: true,
            match: searchValue ?? '',
            collection_name: collection ?? ''            
        }, page, limit)

        // let nftAssets:NFTAsset[] = [];

        // waxAssets.forEach(async (waxAsset) => nftAssets.push(await NFTAsset.generateFromWaxAsset(waxAsset)));

        // return Promise.resolve(nftAssets);

        const nftAssets = waxAssets.map((waxAsset) => NFTAsset.generateFromWaxAsset(waxAsset))

        return nftAssets;
    }

    async getAssetById(contractAddress: string, tokenId: string): Promise<NFTAsset> {
        let waxAsset = this.assetCache[contractAddress];

        if (!waxAsset) {
            // waxAsset = await this.api.getAsset(contractAddress);
            const asset: BlockchainAssetMetadata = (await RestApi.Blockchain.getAssetById(Blockchain.Wax, contractAddress, tokenId)).data;

            if (!asset) return new NFTAsset();

            waxAsset = asset.data;

            this.assetCache[contractAddress] = waxAsset;
        }

        return NFTAsset.generateFromWaxAsset(waxAsset);
    }

}