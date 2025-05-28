<template>
<div class="card shadow-4-hover"  v-if="props.saleWithPhysicalAsset.physicalAsset">
<div class="p-2">
    <!-- <video v-if="nftAsset.mainVideoUrl" autoplay playsinline loop muted :src="nftAsset.mainVideoUrl"></video> -->
    <!-- <img v-if="" class="w-full h-full" :src="nftAsset.mainImgUrl" /> -->
</div>
<div class="px-2 pt-2 pb-4">
    <h6 class="font-semibold mb-2 text-dark text-uppercase">{{ props.saleWithPhysicalAsset.physicalAsset.name }}</h6>
    <img 
        v-if="props.saleWithPhysicalAsset.physicalAsset"
        class="w-full rounded-2 max-h-32"
        :src="ImageHelper.getAssetByType(props.saleWithPhysicalAsset.physicalAsset.physicalAssetAttributes?.images[0], 
            FileRequestType.PhysicalAssetImage)" 
        alt="">
    <p class="my-2">{{ props.saleWithPhysicalAsset.physicalAsset.description }}</p>
    <div>
        <div v-if="props.saleWithPhysicalAsset.sale.saleType === SaleType.LiveGiveaway">
            <div v-if="winningBuyOrder.id" class="text-xs text-muted font-semibold mt-2">
                <span v-if="!StringHelper.isNullOrEmpty(airdropGiveAwayUserName)">Given to {{ airdropGiveAwayUserName }}</span>
            </div>
            <div v-else class="text-xs text-muted font-semibold mt-2">
                Giveaway
            </div>
        </div>
        <div v-else-if="props.saleWithPhysicalAsset.sale.saleType === SaleType.LiveAuction" class="d-flex align-items-center mt-2">
            <div v-if="!winningBuyOrder.id">
                <div class="text-xs text-muted">
                    Quantity: {{ props.saleWithPhysicalAsset.sale?.quantity }}
                </div>                
                <div class="text-xs text-muted" v-if="props.saleWithPhysicalAsset.sale.floorPrice > 0">
                    Starting Bid:
                </div>
                <div class="text-xs text-muted ms-auto" v-if="props.saleWithPhysicalAsset.sale.floorPrice > 0">
                    ${{ NumberHelper.normalizeCurrencyFromAPI(props.saleWithPhysicalAsset.sale.floorPrice) }}
                </div>
            </div>
            <div v-else>
                <div class="text-xs text-muted font-semibold">
                    Sold for ${{winningBuyOrder.amount}}
                </div>
            </div>
        </div>
    </div>

    <div v-if="mode === 'host' && !winningBuyOrder.id">
        <div v-if="props.saleWithPhysicalAsset.sale.saleType === SaleType.LiveGiveaway">
            <button @click.prevent="startGiveaway"
                class="w-full badge rounded-pill bg-gradient bg-success mt-2">Start Giveaway
            </button>   
        </div>
        <div v-if="props.saleWithPhysicalAsset.sale.saleType === SaleType.LiveAuction">
            <div class="text-xs text-muted font-semibold mt-2">
                Start Auction With:
            </div>
            <div class="gap-2">
                <button @click.prevent="startAuction(60)" class="badge rounded-pill bg-primary px-3 me-2">1min</button>
                <button @click.prevent="startAuction(45)" class="badge rounded-pill bg-primary px-3 me-2">45s</button>
                <button @click.prevent="startAuction(30)" class="badge rounded-pill bg-primary px-3 me-2">30s</button>
                <button @click.prevent="startAuction(15)" class="badge rounded-pill bg-primary px-3 me-2">15s</button>
                <button @click.prevent="startAuction(3600)" class="badge rounded-pill bg-primary px-3 me-2">1hr</button>
            </div>
            <div class="mt-2">
                <button @click.prevent="editProduct" class="w-full badge rounded-pill bg-gradient bg-success">Edit Product</button>
            </div>
        </div>
    </div>
    <div v-else-if="mode === 'buyer' && currentUser && !StringHelper.isNullOrEmpty(currentUser.id)">
        <div v-if="props.saleWithPhysicalAsset.sale.saleType === SaleType.LiveGiveaway"></div>
        <div v-else-if="props.saleWithPhysicalAsset.sale.saleType === SaleType.LiveAuction">
            <button v-if="!winningBuyOrder.id" @click.prevent="requestAsset" class="mt-2 w-full badge rounded-pill bg-gradient bg-success">Request</button>
        </div>
    </div>            
</div>
</div>
</template>

<script lang="ts" setup>
import { SaleWithPhysicalAsset, SaleType, BuyOrder, Sale, FileRequestType } from '@/services/api/models';
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@/store/main.store';
import StringHelper from '@/helpers/StringHelper';
import LoadingHelper from '@/helpers/LoadingHelper';
import SaleService from '@/services/domain/SaleService';
import ToastHelper from '@/helpers/ToastHelper';
import ErrorLogger from '@/helpers/ErrorLogger';
import useEmitter from '@/helpers/useEmitter';
import eventBus from '@/events/EventBus';
import UserService from '@/services/domain/UserService';
import NumberHelper from '@/helpers/NumberHelper';
import ImageHelper from '@/helpers/ImageHelper';
import { storeToRefs } from 'pinia';
import { toggleOffCanvas } from '@/hooks/BootstrapHooks';
import { RestApi } from '@/services/RestApi';

const store = useStore()
const emitter = useEmitter();

const props = defineProps<{
    saleWithPhysicalAsset: SaleWithPhysicalAsset,
    mode: 'host' | 'buyer'
}>();

const { currentUser } = storeToRefs(store);

const winningBuyOrder = ref({} as BuyOrder);

function editProduct () {
    // emitter.emit('OpenEditSalePriceModal', { 
    //     asset: nftAsset.value, 
    //     saleId: props.saleWithAsset.sale.id, 
    //     price: sale.value.floorPrice 
    // });

    eventBus.emit('onEditPhysicalAsset', {
        saleWithPhysicalAsset: props.saleWithPhysicalAsset
    })
}

function requestAsset() {
    emitter.emit('RequestAuction', { name: props.saleWithPhysicalAsset.physicalAsset.name, mintNumber: null, page: 1 });
}

async function startAuction(auctionEndSeconds: number) {
    const loader = LoadingHelper.showLoader();

    try {
        await SaleService.startAuction(props.saleWithPhysicalAsset.sale.id, auctionEndSeconds);
        toggleOffCanvas('offCanvasStore', 'hide')        
    } catch (err) {
        ToastHelper.error('There was an error starting the auction')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}

async function getWinningBuyOrder () {
    winningBuyOrder.value = await SaleService.getWinningBuyOrder(props.saleWithPhysicalAsset.sale.id) ?? {};
}

async function startGiveaway() {
    try {
        await RestApi.Sales.startGiveaway(props.saleWithPhysicalAsset.sale.id);
        ToastHelper.success('Giveaway started')
        toggleOffCanvas('offCanvasStore', 'hide')        
    } catch (err) {
        ToastHelper.error('There was an error starting the giveaway')
        await ErrorLogger.logApiError(err)
    }
}

eventBus.on('onAuctionEnded', async (value: { sale: Sale }) => {
    if (value.sale.id === props.saleWithPhysicalAsset.sale.id) await getWinningBuyOrder();
})

onMounted(async () => {
    await getWinningBuyOrder();
})

</script>

<style scoped>

</style>