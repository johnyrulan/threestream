import { Blockchain, TransferWallet, WalletAsset } from "../api/models";
import { RestApi } from "../RestApi";

export default class WalletAssetService {
    static async getByUserId(userId: string): Promise<WalletAsset[]> {
        return (await RestApi.Wallet.getByUserId(userId)).data;
    }

    static async getById(id: string): Promise<WalletAsset> {
        return (await RestApi.Wallet.getById(id)).data;
    }

    static async saveWalletAsset(walletAsset: WalletAsset) {
        await RestApi.Wallet.saveWalletAsset(walletAsset);
    }

    static async requestTransfer(assetId: string, transferAddress: string, blockchain: Blockchain, wallet: TransferWallet) {
        await RestApi.Wallet.requestTransfer(assetId, transferAddress, blockchain, wallet);
    }

    static async completeTransfer(assetId: string) {
        await RestApi.Wallet.completeTransfer(assetId);
    }
}