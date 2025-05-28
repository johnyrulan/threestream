import Wallet from "@/enums/Wallet";
import eventBus from "@/events/EventBus";
import ToastHelper from "@/helpers/ToastHelper";
import IWalletProvider from "@/interfaces/IWalletProvider";
import { Blockchain } from "../api/models";

export default class MetamaskWalletProvider implements IWalletProvider {
    transferNFTs(nfts: { contractAddress: string; tokenId: string; }[]): boolean | Promise<boolean> {
        throw new Error("Method not implemented.");
    }


    private getProvider() {
        return (window as any).ethereum;
    }

    async getConnectedBlockchain() {
        const provider = this.getProvider();

        if (!provider) return Blockchain.Ethereum;

        try {
            const chainId = await provider.request({ method: 'eth_chainId' });

            if (chainId === "0x1") return Blockchain.Ethereum;
            if (chainId === "0x38") return Blockchain.BinanceSmartChain;
            if (chainId === "0x89") return Blockchain.Polygon;

        } catch (err) {

        }

        return Blockchain.Ethereum;
    }

    getConnectedWalletAddress(): string | Promise<string> {
        throw new Error("Method not implemented.");
    }

    onAccountChanged(accounts: any[]) {
        eventBus.emit("onAccountChanged", { wallet: Wallet.MetaMask, blockchain: Blockchain.Ethereum, accountAddress: accounts[0] });
    }

    onBlockchainChanged(chainId: any) {
        window.location.reload();
    }

    async connect() {
        const provider = this.getProvider();

        if (!provider) {
            ToastHelper.error("MetaMask is not installed. Please install MetaMask to connect your wallet!")
            return;
        }

        try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            this.onAccountChanged(accounts);

            provider.on('accountsChanged', this.onAccountChanged);
            provider.on('chainChanged', this.onBlockchainChanged);
        } catch (err) {
            ToastHelper.error('Could not connect to MetaMask. Please try again!')
        }
    }

}