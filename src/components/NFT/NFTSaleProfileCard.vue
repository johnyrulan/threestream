<template>
<div class="card shadow-4-hover">
    <div class="p-2">
    <a href="#" class="d-block" v-if="nftAsset.mainVideoUrl">
        <video class="img-fluid rounded-2" autoplay playsinline loop muted alt="..." :src="nftAsset.mainVideoUrl" />
    </a>
    <a href="#" class="d-block" v-else>
        <img class="img-fluid rounded-2 w-full h-full" :src="nftAsset.mainImgUrl" />
    </a>
    </div>
    <div class="px-4 pt-2 pb-4">
        <h6 class="font-bold mb-2">{{ nftAsset.name }}</h6>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 me-2" v-if="nftAsset.rarity">Rarity: {{ nftAsset.rarity }}</span>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2" v-if="nftAsset.mintNumber && nftAsset.totalSupply">Mint {{ nftAsset.mintNumber }} of {{ nftAsset.totalSupply }}</span>
    </div>
</div>
</template>

<script setup lang="ts">
import useEmitter from "@/helpers/useEmitter";
import { initializeTooltip } from "@/hooks/BootstrapHooks";
import NFTAsset from "@/models/NFTAsset";
import { Blockchain, SaleAsset } from "@/services/api/models";
import BlockchainService from "@/services/BlockchainService";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import ImageHelper from "@/helpers/ImageHelper";

const props = defineProps<{
    asset: SaleAsset
}>();

const emitter = useEmitter();

let nftAsset = ref(new NFTAsset());

onMounted(async () => {
    await getWaxAsset();
    initializeTooltip()
});

async function getWaxAsset() {
    if (!props.asset) return;

    nftAsset.value = await BlockchainService.getInstance(props.asset.blockchain)
                                            .getAssetById(props.asset.contractAddress, props.asset.tokenId);
}

</script>