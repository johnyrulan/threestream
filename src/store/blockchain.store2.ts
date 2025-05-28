import Wallet from "@/enums/Wallet";
import { Blockchain } from "@/services/api/models/blockchain";
import { Module } from "vuex";

const blockchainModule: Module<any, any> = {
    namespaced: true,
    state: {
        currentWaxUser: null,
        currentBloctoUser: null,
        currentDapperUser: null,
        currentPhantomUser: null,
        currentMetamaskUser: null,
        isWalletConnected: false
    },
    mutations: {
        setCurrentBlockchainUser(state: any, data: { wallet: Wallet, blockchain: Blockchain, accountAddress: string }) {
            if (data.wallet === Wallet.WaxCloudWallet) state.currentWaxUser = data.accountAddress;
            if (data.wallet === Wallet.Blocto) state.currentBloctoUser = data.accountAddress;
            if (data.wallet === Wallet.Dapper) state.currentDapperUser = data.accountAddress;
            if (data.wallet === Wallet.Phantom) state.currentPhantomUser = data.accountAddress;
            if (data.wallet === Wallet.MetaMask) state.currentMetamaskUser = data.accountAddress;

            state.isWalletConnected = true;
        },
        resetUserAccounts(state: any) {
            state.currentWaxUser = null;
            state.currentBloctoUser = null;
            state.currentDapperUser = null;
            state.currentPhantomUser = null;
            state.currentMetamaskUser = null;

            state.isWalletConnected = false;
        }
    }
}

export default blockchainModule;