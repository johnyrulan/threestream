<template>
<div class="card bg-jk-raffle border-0">
    <div class="p-2">
        <a href="#" class="d-block">
            <img class="img-fluid rounded-2 w-full h-full" alt="..." :src="ImageHelper.getRebreakImage(props.packs[0].assetPackType)" />
        </a> 
    </div>
    <div class="px-4 pt-2 pb-4">
        <!-- <h6 class="font-bold mb-2">{{ props.packs[0].name }} #{{ props.pack.number }}</h6> -->
        <h6 class="font-bold mb-2">{{ props.packs[0].name }} {{ Math.min(getPackNumbers()) }} - {{ Math.max(getPackNumbers()) }}</h6>
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
            <button class="btn btn-success btn-sm" @click="createSales">Add Packs</button>
        </div>        
    </div>
</div>
</template>

<script setup lang="ts">
import AssetHelper from "@/helpers/AssetHelper";
import NFTAsset from "@/models/NFTAsset";
import { AssetPack, Sale, SaleAssetType, SaleStatus, SaleType, SaleWithAssets } from "@/services/api/models";
import ImageHelper from "@/helpers/ImageHelper";
import { onMounted, ref } from "vue";
import NumberHelper from "@/helpers/NumberHelper";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";
import ToastHelper from "@/helpers/ToastHelper";
import { RestApi } from "@/services/RestApi";

const emit = defineEmits<{
    (e: 'featurePack', pack: AssetPack): void
}>();

const props = defineProps<{
    packs: AssetPack[],
    livestreamId: string
}>();

const selectedSaleType = ref(SaleType.LiveSale)
const floorPrice = ref(0)

const store = useStore()
const { currentUser } = storeToRefs(store);

function featurePack() {
    emit("featurePack", props.packs[0]?.groupId);
}

function getPackNumbers() {
    return props.packs?.map(p => p.number) ?? []
}

async function createSales() {
    try {
        const sales = props.packs.map(p => {
            return {
                livestreamId: props.livestreamId,
                saleType: selectedSaleType.value,
                saleStatus: selectedSaleType.value === SaleType.LiveGiveaway ? SaleStatus.Available : SaleStatus.Unsold,
                saleAssetType: SaleAssetType.AssetPack,
                floorPrice: NumberHelper.normalizeCurrencyToSave(floorPrice.value),
                quantity: 1,
                sellerUserId: currentUser.value.id,
                assetPackId: p.id
            } as Sale
        });

        await RestApi.Sales.bulkCreate(sales)
        featurePack()

        ToastHelper.success('Packs Successfully added')
    } catch (err) {
        ToastHelper.error('There was an error adding the Packs')
    }
}

</script>

<style scoped>

</style>