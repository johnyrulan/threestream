<template>
<div class="container">
    <div class="row">
        <div class="col-lg-10 mx-auto">
            <div class="card border-0 mb-6">
                <div class="card-body">
                    <div class="mb-7">
                        <h3 class="font-semibold mb-1">Create ReBreak Packs</h3>
                        <!-- <p class="text-sm text-muted">Create a new Live Show</p> -->
                    </div>

                    <div class="">
                        <label class="form-label" for="title">Name</label>
                        <input v-model="name" type="text" placeholder="Name of your Packs" class="form-control" id="title">
                    </div>

                    <div class="my-2">
                        <label class="form-label" for="title">Pack Type</label>
                        <div class="d-flex flex-row gap-3 justify-content-center">
                            <div class="form-item-checkable">
                                <input class="form-item-check pointer-cursor" type="radio" name="pack-type" id="standard-pack-type" checked="checked" 
                                v-model="packType"
                                :value="AssetPackType.Standard"
                                />
                                <label class="form-item pointer-cursor" for="standard-pack-type">
                                    <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-48 h-48 text-center text-muted p-0">
                                        <img src="@/assets/rebreaks/standard-rebreak.png">
                                    </span>
                                    <p class="text-center">Standard Pack</p>
                                </label>
                            </div>         
                            <div class="form-item-checkable">
                                <input class="form-item-check" type="radio" name="pack-type" id="premium-pack-type" 
                                v-model="packType"
                                :value="AssetPackType.Premium"                                
                                />
                                <label class="form-item pointer-cursor" for="premium-pack-type">
                                    <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-48 h-48 text-center text-muted p-0">
                                        <img src="@/assets/rebreaks/premium-rebreak.png">
                                    </span>
                                    <p class="text-center">Premium Pack</p>
                                </label>
                            </div>               
                            <div class="form-item-checkable">
                                <input class="form-item-check" type="radio" name="pack-type" id="pro-pack-type" 
                                v-model="packType"
                                :value="AssetPackType.Pro"                                
                                />
                                <label class="form-item pointer-cursor" for="pro-pack-type">
                                    <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-48 h-48 text-center text-muted p-0">
                                        <img src="@/assets/rebreaks/pro-rebreak.png">
                                    </span>
                                    <p class="text-center">Pro Pack</p>
                                </label>
                            </div>                                                         
                        </div>
                    </div>                    
                </div>
            </div>

            <div class="text-center mb-4">
                <button 
                    class="btn btn-info ms-2" 
                    @click="generatePacks(true)">Generate Packs
                </button>
                <button 
                    class="btn btn-info ms-2" 
                    @click="generatePacks(false)">Generate Old Packs
                </button>
            </div>   

            <div class="card">
                <div class="card-body">                    
                    <div>
                        <!-- <div class="input-group input-group-sm input-group-inline" @keyup.enter="getAssets">
                            <span class="input-group-text pe-2">
                                <i class="bi bi-search"></i>
                            </span>
                            <input v-model="searchValue" type="text" class="form-control" placeholder="Search" aria-label="Search" data-form-type="">
                            <button class="btn btn-sm btn-primary ps-3" @click="searchAssets">Search</button>
                        </div>
                        <div class="input-group input-group-sm input-group-inline mt-2" @keyup.enter="getAssets">
                            <span class="input-group-text pe-2">
                                <i class="bi bi-search"></i>
                            </span>
                            <input v-model="collection" type="text" class="form-control" placeholder="Search Collections" aria-label="Search" data-form-type="">
                            <button class="btn btn-sm btn-primary ps-3" @click="searchAssets">Search Collection</button>
                        </div>                     -->
                    </div>
                    <div class="text-center my-4">
                        <button v-if="selectedNFTs.length > 0" class="btn btn-primary ms-2" @click="() => {}">Selected {{ selectedNFTs.length }} NFT(s)</button>
                        <button v-if="selectedNFTs.length !== nfts.length" class="btn btn-primary ms-2" @click="selectAll">Select All</button>
                    </div> 
                    <p class="h4 text-warning mb-2">Selected NFTs</p>                 
                    <div class="d-flex flex-wrap my-3 gap-3 justify-content-center">
                        <NFTRebreakCard
                            style="max-width: 180px; flex-grow: 1"                                                
                            v-for="(nft, index) in selectedNFTs" :key="nft.walletAsset.id"
                            :wallet-asset="nft.walletAsset"
                            :nft-asset="nft.nftAsset"
                            :is-selected="true"
                            @select-nft-to-pack="selectNFTsToPack"
                        />
                    </div>
         

                    <p class="h4 text-warning mb-2">Your NFTs</p>

                    <div class="d-flex flex-wrap my-3 gap-3 justify-content-center">
                        <NFTRebreakCard
                            style="max-width: 180px; flex-grow: 1"                                                
                            v-for="(nft, index) in nfts" :key="nft.walletAsset.id"
                            :wallet-asset="nft.walletAsset"
                            :nft-asset="nft.nftAsset"
                            :is-selected="false"
                            @select-nft-to-pack="selectNFTsToPack"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { RestApi } from '@/services/RestApi';
import { AssetPackAttributes, AssetPackType, CreateAssetPackRequestModel, TransferStatus, WalletAsset } from '@/services/api/models';
import BlockchainService from '@/services/BlockchainService';
import ToastHelper from '@/helpers/ToastHelper';
import ErrorLogger from '@/helpers/ErrorLogger';
import LoadingHelper from '@/helpers/LoadingHelper';
import NFTRebreakCard from '@/components/NFT/Rebreaks/NFTRebreakCard.vue';
import { useRouter } from 'vue-router';
import NFTAsset from '@/models/NFTAsset';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia'
import { Toast } from 'bootstrap';
import StringHelper from '@/helpers/StringHelper';

const store = useStore()

const { currentUser } = storeToRefs(store);

interface RebreakAsset {
    walletAsset: WalletAsset, 
    nftAsset: NFTAsset 
}

const name = ref('')
const nfts = ref([] as RebreakAsset[])
const selectedNFTs = ref([] as RebreakAsset[])
const packType = ref(AssetPackType.Standard)

const router = useRouter()

function selectAll() {
    for (let i = 0; i < nfts.value.length; ++i) {
        const asset = nfts.value[i]
        selectedNFTs.value.push({ walletAsset: asset.walletAsset, nftAsset: asset.nftAsset })
    }

    const selectedWallets = selectedNFTs.value.map(w => w.walletAsset?.id);
    nfts.value = nfts.value.filter(n => !selectedWallets.includes(n.walletAsset.id))        
}

function selectNFTsToPack(walletAsset: WalletAsset, nftAsset: NFTAsset, isSelected: boolean) {
    if (isSelected) {
        selectedNFTs.value.push({ walletAsset, nftAsset })
        const selectedWallets = selectedNFTs.value.map(w => w.walletAsset?.id);
        nfts.value = nfts.value.filter(n => !selectedWallets.includes(n.walletAsset.id))        
        return
    }

    selectedNFTs.value = selectedNFTs.value.filter(nft => (nft.walletAsset.id !== walletAsset.id))

    nfts.value.push({ walletAsset, nftAsset })        
}

async function getUserAssets () {
    const loader = LoadingHelper.showLoader();

    try {
        const allWalletAssets = (await RestApi.Asset.getByUserId(currentUser.value.id)).data ?? [];

        const currentNFTs = (allWalletAssets.filter(w => w.transferStatus === TransferStatus.TransferAvailable));

        const assets: RebreakAsset[] = [];

        for (let i = 0; i < currentNFTs.length; ++i) {
            const currentWalletAsset: WalletAsset = currentNFTs[i]
            const asset = await BlockchainService.getBlockchainAsset(currentWalletAsset.blockchain, currentWalletAsset.contractAddress, currentWalletAsset.tokenId)
            assets.push({ walletAsset: currentWalletAsset, nftAsset: asset } as RebreakAsset)
        }

        nfts.value = assets;
    } catch (err) {
        ToastHelper.error('There was an retrieving your NFTs. Please try again later.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}

function generateAssetPackAttributes() {
    const commonCount = selectedNFTs.value.filter(n => n.nftAsset.rarity?.toLowerCase() === 'common').length;
    const uncommonCount = selectedNFTs.value.filter(n => n.nftAsset.rarity?.toLowerCase() === 'uncommon').length;
    const rareCount = selectedNFTs.value.filter(n => n.nftAsset.rarity?.toLowerCase() === 'rare').length;
    const epicCount = selectedNFTs.value.filter(n => n.nftAsset.rarity?.toLowerCase() === 'epic').length;
    const legendaryCount = selectedNFTs.value.filter(n => n.nftAsset.rarity?.toLowerCase() === 'legendary').length;
    const grailCount = selectedNFTs.value.filter(n => n.nftAsset.rarity?.toLowerCase() === 'grail').length;
    const otherCount = selectedNFTs.value.length - (commonCount + uncommonCount + rareCount + epicCount + legendaryCount + grailCount);

    return {
        commonCount,
        uncommonCount,
        rareCount,
        epicCount,
        legendaryCount,
        grailCount,
        otherCount
    } as AssetPackAttributes
}

async function generatePacks(isRandom: boolean) {
    const loader = LoadingHelper.showLoader();        

    if (StringHelper.isNullOrEmpty(name.value)) {
        ToastHelper.error('Please enter a name for the ReBreaks')
        return
    }

    try {
        await RestApi.Asset.createAssetPacks({
            name: name.value,
            assetPackType: packType.value,
            walletAssetIds: selectedNFTs.value.map(w => w.walletAsset.id),
            assetPackAttributes: generateAssetPackAttributes(),
            randomizePacks: isRandom
        } as CreateAssetPackRequestModel);

        router.push({ name: 'NFTs' });

        ToastHelper.success('Success! Your packs have been created!')
    } catch (err) {
        ToastHelper.error('There was an error creating your packs. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}

onMounted(async () => {
    await getUserAssets()
})

</script>

<style scoped>
h1, h2, h3, h4, h5, h6, label {
    color: black !important;
}
</style>