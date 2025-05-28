import Wallet from "@/enums/Wallet";
import eventBus from "@/events/EventBus";
import ToastHelper from "@/helpers/ToastHelper";
import IWalletProvider from "@/interfaces/IWalletProvider";
import { Blockchain } from "../api/models";
import * as splToken from "@solana/spl-token";
import * as solanaWeb3 from '@solana/web3.js';

export default class PhantomWalletProvider implements IWalletProvider {
    wallet = Wallet.Phantom;
    connection = new solanaWeb3.Connection('https://solana-mainnet.g.alchemy.com/v2/6iIztvBzc0HejgqudWsQkVxHEePvPONy', "confirmed");

    getConnectedBlockchain(): Blockchain {
        return Blockchain.Solana;
    }

    private isPhantomInstalled(): boolean {
        return (window as any).phantom?.solana?.isPhantom;
    }

    private getProvider() {
        if (this.isPhantomInstalled()) return (window as any).phantom?.solana;
        else return null;
    }

    getConnectedWalletAddress(): string {
        const provider = this.getProvider();

        if (!provider) return '';

        return provider.publicKey.toString();
    }

    async connect() {
        const provider = this.getProvider();

        if (!provider) {
            ToastHelper.error('Phantom is not installed. Please install Phantom to continue.');
            return;
        }

        try {
            const response = await provider.connect();
            const publicKey = response.publicKey.toString();

            eventBus.emit("onAccountChanged", { wallet: Wallet.Phantom, blockchain: Blockchain.Solana, accountAddress: publicKey });
        }
        catch (err) {
            ToastHelper.error('Could not connect to Phantom. Please try again')
        }
    }

    async getOrCreateTokenAccount(mintAddress: solanaWeb3.PublicKey,
        ownerAddress: solanaWeb3.PublicKey,
        payerAddress: solanaWeb3.PublicKey) {
        const associatedToken = await splToken.getAssociatedTokenAddress(
            mintAddress,
            ownerAddress
        );

        // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
        // Sadly we can't do this atomically.
        let account: splToken.Account;
        try {
            account = await splToken.getAccount(this.connection, associatedToken);
        } catch (error: unknown) {
            // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
            // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
            // TokenInvalidAccountOwnerError in this code path.
            if (error instanceof splToken.TokenAccountNotFoundError || error instanceof splToken.TokenInvalidAccountOwnerError) {
                // As this isn't atomic, it's possible others can create associated accounts meanwhile.
                try {
                    const transaction = new solanaWeb3.Transaction().add(
                        splToken.createAssociatedTokenAccountInstruction(
                            payerAddress,
                            associatedToken,
                            ownerAddress,
                            mintAddress
                        )
                    );

                    const blockHash = await this.connection.getLatestBlockhash();
                    transaction.recentBlockhash = blockHash.blockhash;
                    transaction.feePayer = payerAddress;

                    const { signature } = await this.getProvider().signAndSendTransaction(transaction);
                    await this.connection.confirmTransaction({
                        blockhash: blockHash.blockhash,
                        lastValidBlockHeight: blockHash.lastValidBlockHeight,
                        signature: signature
                    });
                } catch (error: unknown) {
                    // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
                    // instruction error if the associated account exists already.
                }

                // Now this should always succeed
                account = await splToken.getAccount(this.connection, associatedToken, 'confirmed');
            } else {
                throw error;
            }
        }

        if (!account.mint.equals(mintAddress)) throw new splToken.TokenInvalidMintError();
        if (!account.owner.equals(ownerAddress)) throw new splToken.TokenInvalidOwnerError();

        return account;
    }


    async transferNFTs(nfts: { contractAddress: string, tokenId: string }[]): Promise<boolean> {
        const mintPublicKey = new solanaWeb3.PublicKey(nfts[0].contractAddress);
        const currentPublicKey = new solanaWeb3.PublicKey(this.getConnectedWalletAddress());
        const toWalletPublicKey = new solanaWeb3.PublicKey('Az4p83iGdxDx7AFoYVnQT6tnZy1ZGLpMjaBVkiifcDxE');

        const currentOwnerATA = await this.getOrCreateTokenAccount(
            mintPublicKey,
            currentPublicKey,
            currentPublicKey
        );

        const newOwnerATA = await this.getOrCreateTokenAccount(
            mintPublicKey,
            toWalletPublicKey,
            currentPublicKey
        );

        const tx = new solanaWeb3.Transaction().add(
            splToken.createTransferInstruction(
                currentOwnerATA.address,
                newOwnerATA.address,
                currentPublicKey,
                1
            )
        )

        const blockHash = await this.connection.getLatestBlockhash();
        tx.recentBlockhash = blockHash.blockhash;
        tx.feePayer = currentPublicKey;

        const { signature } = await this.getProvider().signAndSendTransaction(tx);
        await this.connection.confirmTransaction({
            blockhash: blockHash.blockhash,
            lastValidBlockHeight: blockHash.lastValidBlockHeight,
            signature: signature
        });

        return true;
    }
}