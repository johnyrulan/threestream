import NFTAsset from "@/models/NFTAsset"
import { Livestream, SaleAsset, SaleType } from "@/services/api/models";

export default class AssetHelper {
    static transformAssets(nftAssets: NFTAsset[]): SaleAsset[] {
        const assets: SaleAsset[] = nftAssets.map(nft => {
            return {
                contractAddress: nft.contractAddress,
                tokenId: nft.tokenId,
                ownerAddress: nft.ownerAddress,
                blockchain: nft.blockChain,
            }
        })

        return assets;
    }
}