<template>
<div class="card bg-jk-raffle border-0">
    <div class="p-2">
        <a href="#" class="d-block" v-if="nftAsset.mainVideoUrl">
            <video class="img-fluid rounded-2" muted alt="..." :src="nftAsset.mainVideoUrl" />
        </a>
        <a href="#" class="d-block" v-else>
            <img class="img-fluid rounded-2 w-full h-full" alt="..." :src="nftAsset.mainImgUrl" />
        </a> 
    </div>
    <div class="px-4 pt-2 pb-4">
        <h6 class="font-bold mb-2">{{ nftAsset.name }}</h6>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 d-block" v-if="nftAsset.rarity">Rarity: {{ nftAsset.rarity }}</span>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-2 shadow-2 d-block" v-if="nftAsset.mintNumber && nftAsset.totalSupply">Mint {{ nftAsset.mintNumber }} of {{ nftAsset.totalSupply }}</span>
        <div class="text-white">
            <input class="form-check-input" type="radio" :value="SaleType.LiveAuction" v-model="selectedSaleType"> Auction
            <br/>
            <input class="form-check-input" type="radio" :value="SaleType.LiveSale" v-model="selectedSaleType"> Buy Now  
            <br/>          
            <input class="form-check-input" type="radio" :value="SaleType.LiveGiveaway" v-model="selectedSaleType"> Giveaway
        </div>     
        <div v-if="selectedSaleType !== SaleType.LiveGiveaway" class="my-2">
            <input class="form-control" placeholder="Price" aria-label="Price" v-model="floorPrice">
        </div>           
        <div class="my-2">
            <button class="btn btn-success btn-sm" @click="createSale">Add NFT</button>
        </div>
        <span class="d-block"></span>
    </div>
</div>
</template>

<script setup lang="ts">
import AssetHelper from "@/helpers/AssetHelper";
import NumberHelper from "@/helpers/NumberHelper";
import ToastHelper from "@/helpers/ToastHelper";
import NFTAsset from "@/models/NFTAsset";
import { RestApi } from "@/services/RestApi";
import { RedemptionStatus, Sale, SaleAsset, SaleAssetType, SaleStatus, SaleType, SaleWithAssets } from "@/services/api/models";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const emit = defineEmits<{
    (e: 'featureAsset', nftAsset: NFTAsset): void
}>();

const props = defineProps<{
    nftAsset: NFTAsset,
    livestreamId: string
}>();

const store = useStore()
const { currentUser } = storeToRefs(store);

const selectedSaleType = ref(SaleType.LiveSale)
const floorPrice = ref(0)

function featureAsset() {
    emit("featureAsset", props.nftAsset);
}

async function createSale() {
    try {
        const saleWithAssets: SaleWithAssets = {
            sale: {
                livestreamId: props.livestreamId,
                saleType: selectedSaleType.value,
                saleStatus: selectedSaleType.value === SaleType.LiveGiveaway ? SaleStatus.Available : SaleStatus.Unsold,
                saleAssetType: SaleAssetType.NFT,
                floorPrice: NumberHelper.normalizeCurrencyToSave(floorPrice.value),
                quantity: 1,
                sellerUserId: currentUser.value.id
            } as Sale,
            saleAssets: [{
                blockchain: props.nftAsset.blockChain,
                contractAddress: props.nftAsset.contractAddress,
                tokenId: props.nftAsset.tokenId,
                walletAssetId: props.nftAsset.walletAssetId,
                ownerAddress: props.nftAsset.ownerAddress,
                redemptionStatus: RedemptionStatus.NotRedeemable
            }] as SaleAsset[]
        }

        await RestApi.Sales.saveSale(saleWithAssets)
        featureAsset()

        ToastHelper.success('NFT Successfully added')
    } catch (err) {
        ToastHelper.error('There was an error adding the NFT')
    }
}

</script>

<style scoped>

</style>