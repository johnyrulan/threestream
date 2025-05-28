<template>
<div class="card border">
    <div class="p-2">
        <a href="#" class="d-block" v-if="props.nftAsset.mainVideoUrl">
            <video class="img-fluid rounded-2" playsinline muted alt="..." :src="props.nftAsset.mainVideoUrl" />
        </a>
        <a href="#" class="d-block" v-else>
            <img class="img-fluid rounded-2 w-full h-full" alt="..." :src="props.nftAsset.mainImgUrl" />
        </a>
    </div>
    <div class="px-4 pt-2 pb-4">
        <h6 class="font-bold mb-2 text-black">{{ props.nftAsset.name }}</h6>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 d-block text-wrap" v-if="nftAsset.rarity">Rarity: {{ props.nftAsset.rarity }}</span>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-2 shadow-2 d-block text-wrap" v-if="nftAsset.mintNumber && nftAsset.totalSupply">Mint {{ props.nftAsset.mintNumber }} of {{ props.nftAsset.totalSupply }}</span>
        <div class="my-2">
            <button v-if="!isSelected" class="btn btn-success btn-sm" 
                @click="emit('selectNftToPack', props.walletAsset, props.nftAsset, true); isSelected = true">Select NFT</button>
            <button v-else class="btn btn-danger btn-sm" 
                @click="emit('selectNftToPack', props.walletAsset, props.nftAsset, false); isSelected = false">Unselect NFT</button>
        </div>
        <span class="d-block"></span>
    </div>
</div>
</template>

<script setup lang="ts">
import ErrorLogger from "@/helpers/ErrorLogger";
import NFTAsset from "@/models/NFTAsset";
import { WalletAsset } from "@/services/api/models";
import BlockchainService from "@/services/BlockchainService";
import { onMounted, ref } from "vue";

const emit = defineEmits<{
    (e: 'selectNftToPack', walletAsset: WalletAsset, nftAsset: NFTAsset, isSelected: boolean): void    
}>();

const props = defineProps<{
    walletAsset : WalletAsset,
    nftAsset: NFTAsset,
    isSelected: boolean
}>();

const nftAsset = ref({} as NFTAsset)

const isSelected = ref(props.isSelected)
</script>

<style scoped>

</style>