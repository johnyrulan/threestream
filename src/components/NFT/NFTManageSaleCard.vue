<template>
<div class="card shadow-4-hover">
    <div class="p-2">
    <!-- <a href="#" class="d-block">
        <img class="img-fluid rounded-2" alt="..." :src="asset.mainImgUrl" />
    </a> -->
    <a href="#" class="d-block" v-if="nftAsset.mainVideoUrl">
        <video class="img-fluid rounded-2" autoplay playsinline loop muted :src="nftAsset.mainVideoUrl" />
    </a>
    <a href="#" class="d-block" v-else>
        <img class="img-fluid rounded-2 w-full h-full" :src="nftAsset.mainImgUrl" />
    </a>
    </div>
    <div class="px-4 pt-2 pb-4">
        <h6 class="font-bold mb-2 text-black">{{ nftAsset.name }}</h6>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 d-block" v-if="nftAsset.rarity">Rarity: {{ nftAsset.rarity }}</span>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-2 shadow-2 d-block" v-if="nftAsset.mintNumber && nftAsset.totalSupply">Mint {{ nftAsset.mintNumber }} of {{ nftAsset.totalSupply }}</span>
        <div v-if="props.sale.saleStatus === SaleStatus.Unsold && props.sale.saleType !== SaleType.LiveGiveaway" class="my-2">
            <input class="form-control" placeholder="Price" aria-label="Price" v-model="props.sale.floorPrice">
        </div>

        <!-- <input class="form-check-input" type="radio" :value="SaleType.LiveSale" v-model="props.sale.saleType">Sale -->
        <div v-if="props.sale.saleStatus === SaleStatus.Unsold">
            <input class="form-check-input" type="radio" :value="SaleType.LiveAuction" v-model="props.sale.saleType"> Auction
            <input class="form-check-input" type="radio" :value="SaleType.LiveSale" v-model="props.sale.saleType"> Buy Now            
            <input class="form-check-input" type="radio" :value="SaleType.LiveGiveaway" v-model="props.sale.saleType"> Giveaway
        </div>
        <div v-else>
            {{ props.sale.saleStatus }}
        </div>

        <span class="d-block"></span>
    </div>
</div>
</template>

<script setup lang="ts">
import AssetHelper from "@/helpers/AssetHelper";
import NFTAsset from "@/models/NFTAsset";
import { Sale, SaleAsset, SaleStatus, SaleType, SaleWithAssets, UserRole } from "@/services/api/models";
import { useStore } from "@/store/main.store";
import { ref } from "@vue/reactivity";
import { storeToRefs } from "pinia";

const props = defineProps<{
    sale: Sale,
    nftAsset: NFTAsset
}>();


const store = useStore()
const { currentUser } = storeToRefs(store);

</script>

<style scoped>
</style>