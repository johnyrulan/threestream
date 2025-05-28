<template>
<div class="card border">
    <div class="p-2">
        <a href="#" class="d-block" v-if="nftAsset.mainVideoUrl">
            <video class="img-fluid rounded-2" playsinline muted alt="..." :src="nftAsset.mainVideoUrl" />
        </a>
        <a href="#" class="d-block" v-else>
            <img class="img-fluid rounded-2 w-full h-full" alt="..." :src="nftAsset.mainImgUrl" />
        </a>
    </div>
    <div class="px-4 pt-2 pb-4">
        <h6 class="font-bold mb-2 text-black">{{ nftAsset.name }}</h6>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 d-block text-wrap" v-if="nftAsset.rarity">Rarity: {{ nftAsset.rarity }}</span>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-2 shadow-2 d-block text-wrap" v-if="nftAsset.mintNumber && nftAsset.totalSupply">Mint {{ nftAsset.mintNumber }} of {{ nftAsset.totalSupply }}</span>
        <div class="my-2">
            <button v-if="!isSelected" class="btn btn-success btn-sm" 
                @click="emit('selectNftToImport', nftAsset, true); isSelected = true">Select NFT</button>
            <button v-else class="btn btn-danger btn-sm" 
                @click="emit('selectNftToImport', nftAsset, false); isSelected = false">Unselect NFT</button>
        </div>
        <span class="d-block"></span>
    </div>
</div>
</template>

<script setup lang="ts">
import Wallet from "@/enums/Wallet";
import AssetHelper from "@/helpers/AssetHelper";
import ToastHelper from "@/helpers/ToastHelper";
import NFTAsset from "@/models/NFTAsset";
import { Sale, SaleType, SaleWithAssets } from "@/services/api/models";
import WalletService from "@/services/WalletService";
import { ref } from "vue";

const emit = defineEmits<{
    (e: 'selectNftToImport', nftAsset: NFTAsset, isSelected: boolean): void    
}>();

const props = defineProps<{
    nftAsset: NFTAsset
}>();

const isSelected = ref(false)

</script>

<style scoped>

</style>