import Wallet from "@/enums/Wallet";
import eventBus from "@/events/EventBus";
import IWalletProvider from "@/interfaces/IWalletProvider";
import { TransferAsset } from "./api/models";
import { Blockchain } from "./api/models/blockchain";
import { RestApi } from "./RestApi";
import DapperWalletProvider from "./wallet/DapperWalletProvider";
import FlowWalletProvider from "./wallet/FlowWalletProvider";
import MetamaskWalletProvider from "./wallet/MetamaskWalletProvider";
import PhantomWalletProvider from "./wallet/PhantomWalletProvider";
import WaxCloudWalletProvider from "./wallet/WaxCloudWalletProvider";
import { useBlockchainStore } from "@/store/blockchain.store";

export default class WalletService {
    private static _waxCloudWalletProvider: IWalletProvider = new WaxCloudWalletProvider();
    private static _flowPortWalletProvider: IWalletProvider = new FlowWalletProvider();
    private static _dapperWalletProvider: IWalletProvider = new DapperWalletProvider();
    private static _phantomWalletProvider: IWalletProvider = new PhantomWalletProvider();
    private static _metamaskWalletProvider: IWalletProvider = new MetamaskWalletProvider();


    static getInstance(wallet: Wallet): IWalletProvider {
        if (wallet === Wallet.WaxCloudWallet) return this._waxCloudWalletProvider;
        if (wallet === Wallet.Blocto) return this._flowPortWalletProvider;
        if (wallet === Wallet.Dapper) return this._dapperWalletProvider;
        if (wallet === Wallet.Phantom) return this._phantomWalletProvider;
        if (wallet === Wallet.MetaMask) return this._metamaskWalletProvider;

        return null as unknown as IWalletProvider;
    }

    static async setWalletInfo(info: { wallet: Wallet, blockchain: Blockchain, accountAddress: string }) {
        const blockchainStore = useBlockchainStore();

        blockchainStore.resetUserAccounts();
        blockchainStore.setCurrentBlockchainUser(info);
    }

    static getCurrentWalletProvider(): IWalletProvider | null {
        const blockchainStore = useBlockchainStore();

        if (blockchainStore.currentWaxUser) return this.getInstance(Wallet.WaxCloudWallet);
        else if (blockchainStore.currentBloctoUser) return this.getInstance(Wallet.Blocto);
        else if (blockchainStore.currentDapperUser) return this.getInstance(Wallet.Dapper);
        else if (blockchainStore.currentPhantomUser) return this.getInstance(Wallet.Phantom);
        else if (blockchainStore.currentMetamaskUser) return this.getInstance(Wallet.MetaMask);

        return null;
    }

    static async resetWallets() {
        const blockchainStore = useBlockchainStore();

        blockchainStore.resetUserAccounts();
    }

    private static _setupEvents() {
        eventBus.on('onAccountChanged', this.setWalletInfo);
    }

    static async initialize() {
        const blockchainStore = useBlockchainStore();

        blockchainStore.resetUserAccounts();
        this._setupEvents();
    }

    static async connectDapperWallet() {
        const dapperWallet: IWalletProvider = WalletService.getInstance(Wallet.Dapper);
        await dapperWallet.connect();
    }

    static async connectWallet(wallet: Wallet) {
        const walletProvider: IWalletProvider = WalletService.getInstance(wallet);
        await walletProvider.connect();
    }

    static async transferToWallet(walletAddress: string, assetId: string) {
        const transferAsset: TransferAsset = {
            walletAddress,
            saleAssetId: assetId
        }

        return (await RestApi.Wallet.transferToWallet(transferAsset))?.data;
    }
}