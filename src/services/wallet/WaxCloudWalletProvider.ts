window.global ||= window;

import Wallet from "@/enums/Wallet";
import eventBus from "@/events/EventBus";
import ToastHelper from "@/helpers/ToastHelper";
import IWalletProvider from "@/interfaces/IWalletProvider";
import * as waxjs from '@waxio/waxjs/dist';
import { Blockchain } from "../api/models/blockchain";

export default class WaxCloudWalletProvider implements IWalletProvider {

    transferWallet = import.meta.env.VITE_WAX_WALLET;

    // wax = new waxjs.WaxJS({
    //     freeBandwidth: true,
    //     rpcEndpoint: import.meta.env.VITE_WAX_ENDPOINT as string,
    //     tryAutoLogin: true
    // });

    wax = {}

    getConnectedBlockchain(): Blockchain {
        return Blockchain.Wax;
    }

    getConnectedWalletAddress(): string {
        return this.wax.userAccount;
    }

    async connect(): Promise<void> {
        try {
            const userAddress = await this.wax.login();
            eventBus.emit("onAccountChanged", { wallet: Wallet.WaxCloudWallet, blockchain: Blockchain.Wax, accountAddress: userAddress });
        } catch (err) {
            ToastHelper.error('Could not connect to WAX Cloud Wallet. Please try again.')
        }
    }

    async transferNFTs(nfts: { contractAddress: string, tokenId: string }[]): Promise<boolean> {
        try {
            const result = await this.wax.api.transact({
                actions: [{
                    account: 'atomicassets',
                    name: 'transfer',
                    authorization: [{
                        actor: this.wax.userAccount,
                        permission: 'active'
                    }],
                    data: {
                        from: this.wax.userAccount,
                        to: this.transferWallet,
                        asset_ids: nfts.map(nft => nft.contractAddress),
                        memo: 'JUNKIE Transfer'
                    }
                }],

            }, {
                blocksBehind: 3,
                expireSeconds: 1200
            });

            ToastHelper.success('Your NFT is successfully being imported. Please wait for 5 minutes to see your NFTs.')
            return true;
        }
        catch (err) {
            ToastHelper.error('There was an error with your import. Please try again.')
        }

        return false;
    }
}