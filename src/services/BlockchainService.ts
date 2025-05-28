import IBlockchainProvider from "@/interfaces/IBlockchainProvider";
import { Blockchain } from "./api/models/blockchain";
import APIBlockchainProvider from "./blockchain/APIBlockchainProvider";
import EVMBlockchainProvider from "./blockchain/EVMBlockchainProvider";
import SolanaBlockchainProvider from "./blockchain/SolanaBlockchainProvider";
import WaxProvider from "./blockchain/WaxProvider";
import SuiBlockchainProvider from "./blockchain/SuiBlockchainProvider";

export default class BlockchainService {
    private static _waxProvider: IBlockchainProvider = new WaxProvider();
    private static _flowBlockchainProvider: IBlockchainProvider = new APIBlockchainProvider(Blockchain.Flow);
    private static _suiBlockchainProvider: IBlockchainProvider = new SuiBlockchainProvider();
    private static _solanaBlockchainProvider: IBlockchainProvider = new SolanaBlockchainProvider();
    private static _ethereumBlockchainProvider: IBlockchainProvider = new EVMBlockchainProvider(Blockchain.Ethereum);
    private static _polygonBlockchainProvider: IBlockchainProvider = new EVMBlockchainProvider(Blockchain.Polygon);
    private static _binanceBlockchainProvider: IBlockchainProvider = new EVMBlockchainProvider(Blockchain.BinanceSmartChain);

    static getInstance(blockchain: Blockchain): IBlockchainProvider {
        if (blockchain === Blockchain.Wax) return this._waxProvider;
        // if (blockchain === Blockchain.Flow) return this._flowBlockchainProvider;
        if (blockchain === Blockchain.Flow) return this._suiBlockchainProvider;
        if (blockchain === Blockchain.Solana) return this._solanaBlockchainProvider;
        if (blockchain === Blockchain.Ethereum) return this._ethereumBlockchainProvider;
        if (blockchain === Blockchain.Polygon) return this._polygonBlockchainProvider;
        if (blockchain === Blockchain.BinanceSmartChain) return this._binanceBlockchainProvider;

        return null as unknown as IBlockchainProvider;
    }

    static getBlockchainAsset(blockchain: Blockchain, contractAddress: string, tokenId: string) {
        return BlockchainService.getInstance(blockchain).getAssetById(contractAddress, tokenId);
    }
}