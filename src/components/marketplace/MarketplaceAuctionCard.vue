<template>
<div class="card transition-shadow pointer-cursor border-2 j-border-primary shadow-primary card-width bg-jk-auction-card py-3"
    :class="{ 'shadow-flow': nftAsset.blockChain === Blockchain.Flow }">
<div class="py-2 px-4 d-flex flex-column flex-xl-row">
    <div class="d-flex flex-column">
        <div class="text-white" v-if="winningBuyer.buyOrder">Current Bid</div>
        <h3 v-if="winningBuyer.buyOrder" style="color: #15BFFD !important;">${{ winningBuyer.buyOrder?.amount ?? 0 }} USD</h3>
        <div v-if="!winningBuyer.buyOrder" class="text-white">Starting Price</div>
        <h3 v-if="!winningBuyer.buyOrder" style="color: #15BFFD !important;">${{ NumberHelper.normalizeCurrencyFromAPI(props.sale.floorPrice ?? 0) }} USD</h3>
    </div>
    <div class="ms-xl-auto mt-3">
        <button
            v-if="(props.sale.saleType === SaleType.DirectAuction)"
            @click="navigateToSalePage" class="btn btn-sm btn-primary rounded-pill text-xs w-full">Place Bid</button>
    </div>
</div>
<div class="p-2" @click="navigateToSalePage">
    <div class="d-flex text-center rounded-2 asset-container-size bg-jk-raffle justify-content-center mx-auto">
        <video :id="props.sale.id + 'asset'" v-if="nftAsset.mainVideoUrl"
            class="m-asset-size object-contain h-full my-auto rounded-2 bg-loading" autoplay muted loop playsinline
            :src="nftAsset.isIPFSAsset ? ImageHelper.optimizeIPFSMedia(nftAsset.mainVideoUrl, 'video') : nftAsset.mainVideoUrl"
            :style="{ backgroundImage: 'url(' + require('@/assets/loading.svg') + ')' }"
            @load="CommonHelper.removeBg('asset')"></video>
        <img :id="props.sale.id + 'asset'" v-else class="img-fluid rounded-2 m-asset-size object-contain w-full h-full my-auto bg-loading" alt="..."
            :src="nftAsset.isIPFSAsset ? ImageHelper.optimizeIPFSMedia(nftAsset.mainImgUrl, 'image') : nftAsset.mainImgUrl"
            :style="{ backgroundImage: 'url(' + require('@/assets/loading.svg') + ')' }"
            @load="CommonHelper.removeBg(props.sale.id + 'asset')"/>
    </div>
</div>
<div class="px-4 mt-2">
    <div @click="navigateToSalePage" class="h5 font-semibold mb-2 text-overflow-ellipsis overflow-hidden text-nowrap text-white">{{ nftAsset.name }} <span v-if="nftAsset.mintNumber">#{{ nftAsset.mintNumber }}</span></div>
    <div class="d-flex flex-wrap gap-3">
        <div class="d-flex align-items-center">
            <button @click="navigateToSalePage" data-bs-toggle="tooltip" data-placement="top" :title="`Sold By ${props.sale.sellerName}`" class="avatar avatar-sm bg-info rounded-circle text-white text-capitalize">{{ StringHelper.getFirst(props.sale.sellerName) }}</button>
            <div @click="navigateToSalePage" data-bs-toggle="tooltip" data-placement="top" :title="nftAsset.blockChain" class="avatar avatar-sm rounded-circle shadow-1" :class="{ 'rounded-circle': nftAsset.blockChain !== Blockchain.Solana }">
                <img :src="ImageHelper.getBlockchainLogo(nftAsset.blockChain)">
            </div>
            <!-- <h2 @click="{ getAssetOffers(); toggleModal('offersModal', 'show'); }">💰</h2>({{ assetOffers.length }}) -->
        </div>
        <div class="w-full text-center text-warning font-semibold">
            <vue-countdown :time="remainingTime" v-slot="{ days, hours, minutes, seconds }">
                <div class="timer-content">
                    <div>
                        <div>Auction Ending in</div>
                        {{ days }} days {{ hours }} hours {{ minutes }} min {{ seconds }} seconds
                    </div>
                </div>
            </vue-countdown>
        </div>
    </div>
    <span class="d-block"></span>
</div>
</div>
</template>

<script lang="ts" setup>
import ErrorLogger from '@/helpers/ErrorLogger';
import ImageHelper from '@/helpers/ImageHelper';
import NumberHelper from '@/helpers/NumberHelper';
import StringHelper from '@/helpers/StringHelper';
import CommonHelper from '@/helpers/CommonHelper';
import { initializeTooltip, toggleModal } from '@/hooks/BootstrapHooks';
import NFTAsset from '@/models/NFTAsset';
import User from '@/models/User';
import { SaleAsset, SaleWithAssets, Blockchain, SaleAssetWithMetadata, Sale,
    MarketplaceSale, BuyOrderOffer, OrderType, SaleType, BuyOrder
} from '@/services/api/models';
import BlockchainService from '@/services/BlockchainService';
import UserService from '@/services/domain/UserService';
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import SaleService from '@/services/domain/SaleService';
import LoadingHelper from '@/helpers/LoadingHelper';
import ToastHelper from '@/helpers/ToastHelper';
import useEmitter from '@/helpers/useEmitter';
import { prop } from 'vue-class-component';
import { DateTime } from 'luxon';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';

const props = defineProps<{
    sale: MarketplaceSale,
    saleAssets: SaleAssetWithMetadata[]
}>();

const emit = defineEmits<{
    (e: 'nftLoaded', nftAsset: NFTAsset): void
}>();

const router = useRouter();
const nftAsset = ref({} as NFTAsset);
const seller = ref({} as User);
const assetOffers = ref([] as BuyOrderOffer[]);
let offerAmount = ref(0);
let counterOfferUserId = ref('');

const store = useStore()

const { currentUser } = storeToRefs(store);;

const emitter = useEmitter();

const remainingTime = ref(0)

function calculateRemainingTime() {
    if (props.sale.saleType !== SaleType.DirectAuction) return;

    const utcNow = DateTime.now().toUTC();
    const endTime = DateTime.fromISO(props.sale.endTime)
    const remainingDiff = endTime.diff(utcNow);
    remainingTime.value = remainingDiff.milliseconds;
}

function navigateToSalePage() {
    router.push({ name: 'MarketplaceSale', params: { id: props.sale.id } })
}

async function getBlockchainAsset() {
    const asset = props.saleAssets[0] as SaleAsset;
    nftAsset.value = await BlockchainService.getBlockchainAsset(asset.blockchain, asset.contractAddress, asset.tokenId);
}

interface WinningBuyer {
    buyOrder: BuyOrder,
    name: string
}

const winningBuyer = ref({} as WinningBuyer)

async function getWinningBuyOrder() {
    const buyOrder = await SaleService.getWinningBuyOrder(props.sale.id)

    if (buyOrder) {
        const user = await UserService.getUserById(buyOrder.userId);

        winningBuyer.value = {
        buyOrder,
        name: user?.name
        }
    }
    else {
        winningBuyer.value = {
        } as any
    }

}

onMounted(async () => {
    await getBlockchainAsset();
    // await getAssetOffers();

    calculateRemainingTime();
    await getWinningBuyOrder();

    initializeTooltip();
})

</script>

<style scoped>
.avatar-sm {
    height: 30px;
    width: 30px;
}


/* CSS */

.shadow-primary {
    box-shadow: 0 0 10px 2px rgba(227, 20, 227, 0.084);
}

.shadow-primary:hover {
    /* box-shadow: 0 0 12px 5px rgba(134, 20, 227, 0.54); */
    box-shadow:
    rgba(240, 46, 170, 0.4) 5px 5px,
    rgba(240, 46, 170, 0.3) 10px 10px,
    rgba(240, 46, 170, 0.2) 15px 15px,
    rgba(240, 46, 170, 0.1) 20px 20px,
    rgba(240, 46, 170, 0.05) 25px 25px;
}

.shadow-flow {
    box-shadow: 0 0 10px 2px rgba(48, 227, 20, 0.084);
}

.shadow-flow:hover {
    /* box-shadow: 0 0 12px 5px rgba(134, 20, 227, 0.54); */
    box-shadow:
    rgba(0,239,139, 0.4) 5px 5px,
    rgba(0,239,139, 0.3) 10px 10px,
    rgba(0,239,139, 0.2) 15px 15px,
    rgba(0,239,139, 0.1) 20px 20px,
    rgba(0,239,139, 0.05) 25px 25px;
}

@media (min-width: 645px) {
    .card-width {
        width: 280px !important;
        border-bottom-right-radius: 90px;
    }

    .asset-container-size {
        height: 275px !important;
    }

    .m-asset-size {
        max-height: 275px !important;
    }
}

@media (max-width: 644px) {
    .card-width {
        width: 45% !important;
    }

    .asset-container-size {
        height: 230px !important;
    }

    .btn-purchase {
        width: 100% !important;
    }
}

@media (max-width: 450px) {

    .asset-container-size {
        height: 190px !important;
    }

    .m-asset-size {
        max-height: 190px !important;
    }
}


</style>