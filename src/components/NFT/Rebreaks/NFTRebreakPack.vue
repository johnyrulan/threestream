<template>
<div class="card shadow-4-hover">
    <div class="p-2">
    <a href="#" class="d-block">
        <img class="img-fluid rounded-2 w-full h-full" :src="ImageHelper.getRebreakImage(props.pack.assetPackType)" />
    </a>
    </div>
    <div class="px-4 pt-2 pb-4">
        <h6 class="font-bold mb-2 text-black">{{ props.pack.name }} #{{ props.pack.number }}</h6>
        <div class="mt-2">
            <span 
            class="d-inline-block mb-1" tabindex="0" data-bs-toggle="tooltip" data-bs-placement="top" :title="'You can open this pack here'">
                <button class="btn btn-sm btn-info rounded-pill" @click="openPack">
                    Open Pack
                </button>       
            </span>            
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import ImageHelper from "@/helpers/ImageHelper";
import ToastHelper from "@/helpers/ToastHelper";
import useEmitter from "@/helpers/useEmitter";
import { initializeTooltip } from "@/hooks/BootstrapHooks";
import NFTAsset from "@/models/NFTAsset";
import { RestApi } from "@/services/RestApi";
import { AssetPack } from "@/services/api/models";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";

const props = defineProps<{
    pack: AssetPack
}>();

const emitter = useEmitter();
const router = useRouter();

const nftAsset = ref(new NFTAsset());

onMounted(async () => {
    initializeTooltip()
});


async function openPack() {
    try {
        await RestApi.Asset.openPack(props.pack.id, '');
        ToastHelper.success('Pack is opened')
        emitter.emit('OpenPack')
    } catch (err) {
        ToastHelper.error('There was an error opening your pack')
    }
}

// function openTransferModal () {
//     emitter.emit('OpenTransferModal', { asset: nftAsset.value, assetId: props.asset.id });
// }

// function openJunkieTransferModal() {
//     emitter.emit('TransferJunkieAsset', { walletAssetId: props.asset.id });
// }

// function openListForSaleModal () {
//     emitter.emit('OpenListForSaleModal', { asset: nftAsset.value, assetId: props.asset.id });
// }

// function openRedeemModal() {
//     emitter.emit('OpenRedeemNFTModal', { asset: nftAsset.value, assetId: props.asset.id });
// }

// function viewSalePage () {
//         router.push({ name: 'MarketplaceSale', params: { id: props.asset.saleId }});
// }

</script>