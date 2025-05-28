<template>
<div class="card shadow-4-hover">
    <div class="p-2">
    <a href="#" class="d-block">
        <img class="img-fluid rounded-2 w-full h-full" :src="ImageHelper.getRebreakImage(props.assetPack?.assetPackType)" />
    </a>
    </div>
    <div class="px-4 pt-2 pb-4">
        <h6 class="font-bold mb-2 text-black">{{ props.assetPack.name }} #{{ props.assetPack.number }}</h6>

        <div v-if="props.sale.saleStatus === SaleStatus.Unsold && props.sale.saleType !== SaleType.LiveGiveaway" class="my-2">
            <input class="form-control" placeholder="Price" aria-label="Price" v-model="props.sale.floorPrice">
        </div>
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
import { AssetPack, Sale, SaleStatus, SaleType } from "@/services/api/models";
import ImageHelper from "@/helpers/ImageHelper";

const props = defineProps<{
    sale: Sale,
    assetPack: AssetPack
}>();

</script>

<style scoped>
</style>