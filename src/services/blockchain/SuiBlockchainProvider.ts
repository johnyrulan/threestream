import IBlockchainProvider from "@/interfaces/IBlockchainProvider";
import NFTAsset from "@/models/NFTAsset";

export default class SuiBlockchainProvider implements IBlockchainProvider {
    getAssetsByOwner(address: string, page: number, limit: number, searchValue: string, collection: string): Promise<NFTAsset[]> {
        throw new Error("Method not implemented.");
    }

    async getAssetById(contractAddress: string, tokenId: string): Promise<NFTAsset> {
        const resp = await fetch(`https://fullnode.mainnet.sui.io/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // set content type to JSON
            },
            body: JSON.stringify({
                id: 4,
                jsonrpc: "2.0",
                method: "sui_getObject",
                params: [
                    contractAddress,
                    {
                        showContent: true,
                        showDisplay: true
                    }
                ]
            })
        })

        const respJson = await resp.json()    
        
        return NFTAsset.generateSuiAsset(respJson.result.data)
    }

}