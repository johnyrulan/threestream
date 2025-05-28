import Wallet from "@/enums/Wallet";
import { Blockchain } from "@/services/api/models";
import { defineStore } from "pinia";

export const useBlockchainStore = defineStore('blockchainStore', {
    state: () => {
        return {
            currentWaxUser: null,
            currentBloctoUser: null,
            currentDapperUser: null,
            currentPhantomUser: null,
            currentMetamaskUser: null,
            isWalletConnected: false
        };
    },
    actions: {
        setCurrentBlockchainUser(data: { wallet: Wallet, blockchain: Blockchain, accountAddress: string }) {
            if (data.wallet === Wallet.WaxCloudWallet) this.currentWaxUser = data.accountAddress;
            if (data.wallet === Wallet.Blocto) this.currentBloctoUser = data.accountAddress;
            if (data.wallet === Wallet.Dapper) this.currentDapperUser = data.accountAddress;
            if (data.wallet === Wallet.Phantom) this.currentPhantomUser = data.accountAddress;
            if (data.wallet === Wallet.MetaMask) this.currentMetamaskUser = data.accountAddress;

            this.isWalletConnected = true;
        },
        resetUserAccounts() {
            this.currentWaxUser = null;
            this.currentBloctoUser = null;
            this.currentDapperUser = null;
            this.currentPhantomUser = null;
            this.currentMetamaskUser = null;
            this.isWalletConnected = false;
        }
    }
})