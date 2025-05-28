import { Blockchain } from "@/services/api/models";

export default interface IWalletProvider {
    getConnectedBlockchain(): Blockchain | Promise<Blockchain>;
    getConnectedWalletAddress(): string | Promise<string>;
    connect(): void | Promise<void>;
    transferNFTs(nfts: { contractAddress: string, tokenId: string }[]): boolean | Promise<boolean>;
}