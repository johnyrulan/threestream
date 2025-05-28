import CommonHelper from "@/helpers/CommonHelper";
import ImageHelper from "@/helpers/ImageHelper";
import { Blockchain, BlockchainAssetMetadata, SaleAsset, SaleType } from "@/services/api/models";
import { RestApi } from "@/services/RestApi";
import { toAttributeMap } from "atomicassets/build/Actions/Generator";
import { IAsset } from "atomicassets/build/API/Explorer/Objects";

export default class NFTAsset {
    name: string = '';

    mainImgUrl: string = '';

    mainVideoUrl: string = '';

    ownerAddress: string = '';

    contractAddress: string = '';

    tokenId: string = '';

    blockChain: Blockchain = Blockchain.Wax;

    rarity = '';

    mintNumber = '';

    totalSupply = '';

    attributes = {} as any;

    isIPFSAsset = true;

    walletAssetId = ''

    static generateNFTAsset(asset: any, blockchain: Blockchain) {
        if (blockchain === Blockchain.Wax) return NFTAsset.generateFromWaxAsset(asset);
        else if (blockchain === Blockchain.Solana) return NFTAsset.generateSolanaAsset({ data: asset });
        else if (blockchain === Blockchain.Ethereum || blockchain === Blockchain.Polygon || blockchain === Blockchain.BinanceSmartChain) 
            return NFTAsset.generateEVMAsset(asset);
        
        return NFTAsset.generateFromAPIAsset(asset);
    }

    static generateFromWaxAsset(waxAsset: IAsset) {
        const nftAsset = new NFTAsset();
        nftAsset.ownerAddress = waxAsset.owner ?? '';
        nftAsset.contractAddress = waxAsset.asset_id;
        nftAsset.name = waxAsset.name;
        nftAsset.mainImgUrl = ImageHelper.getIPFSCacheUrl(waxAsset.data.img);
        nftAsset.mainVideoUrl = ImageHelper.getIPFSCacheUrl(waxAsset.data.video);
        nftAsset.rarity = waxAsset.data.rarity;
        nftAsset.mintNumber = waxAsset.template_mint ?? '';
        nftAsset.totalSupply = waxAsset.template?.issued_supply ?? '';
        nftAsset.attributes = CommonHelper.deepCopy(waxAsset.data);

        // if (nftAsset.mainVideoUrl) {
        //     await RestApi.Blockchain.processIPFSCache(nftAsset.mainVideoUrl);
        // } else {
        //     await RestApi.Blockchain.processIPFSCache(nftAsset.mainImgUrl);
        // }

        delete nftAsset.attributes.img;
        delete nftAsset.attributes.backimg;
        delete nftAsset.attributes.description;
        delete nftAsset.attributes.video;

        return nftAsset;
    }

    static generateFromAPIAsset(asset: BlockchainAssetMetadata) {
        const nftAsset = new NFTAsset();
        nftAsset.blockChain = asset.blockchain;
        nftAsset.ownerAddress = asset.ownerAddress ?? '';
        nftAsset.contractAddress = asset.contractAddress;
        nftAsset.tokenId = asset.tokenId;
        nftAsset.name = asset.name;
        nftAsset.mainImgUrl = asset.imageUrl ?? '';
        nftAsset.mainVideoUrl = asset.videoUrl ?? '';
        nftAsset.rarity = asset.rarity ?? '';
        nftAsset.mintNumber = asset.mintNumber ?? '';
        nftAsset.totalSupply = asset.totalSupply ?? '';
        //nftAsset.attributes = asset.attributes;

        return nftAsset;
    }

    static generateSolanaAsset(asset: BlockchainAssetMetadata) {
        const nftAsset = new NFTAsset();
    
        const nftData = asset.data;

        nftAsset.blockChain = asset.blockchain;
        nftAsset.ownerAddress = asset.ownerAddress;
        nftAsset.contractAddress = asset.contractAddress;
        nftAsset.tokenId = asset.tokenId;

        nftAsset.name = nftData.name;
        nftAsset.mainImgUrl = ImageHelper.tryIPFSMedia(nftData.image);
        nftAsset.mainVideoUrl = ImageHelper.tryIPFSMedia(nftData.animation_url);

        if (nftData.attributes)  {
            const attributes = CommonHelper.deepCopy(nftData.attributes);
            nftAsset.attributes = {};

            attributes.forEach((d: any) => { 
                const trait = d["trait_type"]; 
                const value = d["value"];
                
                nftAsset.attributes[trait] = value;
            });
        }

        nftAsset.isIPFSAsset = false;

        return nftAsset;
    }

    static generateEVMAsset(asset: BlockchainAssetMetadata) {        
        const nftAsset = new NFTAsset();

        if (!asset.data.metadata) return nftAsset;
    
        const nftData = asset.data.metadata;

        nftAsset.blockChain = asset.blockchain;
        nftAsset.ownerAddress = asset.ownerAddress;
        nftAsset.contractAddress = asset.contractAddress;
        nftAsset.tokenId = asset.tokenId;

        nftAsset.name = nftData.name;
        nftAsset.mainImgUrl = ImageHelper.tryIPFSMedia(nftData.image);        
        nftAsset.mainVideoUrl = ImageHelper.tryIPFSMedia(nftData.animation_url);                
        
        // if (nftData.attributes) nftAsset.attributes = CommonHelper.deepCopy(nftData.attributes);
        nftAsset.attributes.description = nftData.description;        

        return nftAsset;
    }

    static generateSuiAsset(data: any) {
        const nftAsset = new NFTAsset()

        nftAsset.blockChain = Blockchain.Flow;
        nftAsset.contractAddress = data.objectId;
        nftAsset.name = data.display.data.name;
        nftAsset.mainImgUrl = ImageHelper.tryIPFSMedia(data.display.data.image_url);
        nftAsset.attributes.description = data.display.data.description;

        return nftAsset;
    }
}