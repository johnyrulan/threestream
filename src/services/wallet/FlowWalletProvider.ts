import Wallet from "@/enums/Wallet";
import eventBus from "@/events/EventBus";
import IWalletProvider from "@/interfaces/IWalletProvider";
// @ts-ignore
import * as fcl from "@onflow/fcl";
import { Blockchain } from "../api/models";

export default class FlowWalletProvider implements IWalletProvider {

    wallet: Wallet = Wallet.Blocto;

    constructor() {
        fcl.config({
            'discovery.wallet': "https://fcl-discovery.onflow.org/authn",
            'discovery.wallet.method': "POP/RPC",
            'accessNode.api': "https://access-mainnet.onflow.org",
            'app.detail.title': "JUNKIE | Buy, Sell, & Trade Popular NFTs",
            'app.detail.icon': "https://uploads-ssl.webflow.com/61ba399fca605b9eb8bd60eb/62a0f18db8e7c66dbb023b6a_junkie-icon-web-500.png"
        })
    }
    transferNFTs(nfts: { contractAddress: string; tokenId: string; }[]): boolean | Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getConnectedBlockchain(): Blockchain {
        return Blockchain.Flow;
    }

    async getConnectedWalletAddress(): Promise<string> {
        const currentUser = await fcl.currentUser.snapshot();
        return currentUser.addr;
    }

    async connect(): Promise<void> {

        if (this.wallet === Wallet.Blocto) fcl.config().put('discovery.wallet', "https://fcl-discovery.onflow.org/authn");

        await fcl.reauthenticate();

        const accountAddress = await this.getConnectedWalletAddress();

        eventBus.emit("onAccountChanged", { wallet: this.wallet, blockchain: Blockchain.Flow, accountAddress: accountAddress });
    }

}