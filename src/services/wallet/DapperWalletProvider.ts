import FlowWalletProvider from "./FlowWalletProvider";
// @ts-ignore
import * as fcl from "@onflow/fcl";
import Wallet from "@/enums/Wallet";

export default class DapperWalletProvider extends FlowWalletProvider {

    constructor() {
        super();
        super.wallet = Wallet.Dapper;
    }

    async connect(): Promise<void> {
        fcl.config().put('discovery.wallet', "https://accounts.meetdapper.com/fcl/authn-restricted");
        super.connect();
    }
}