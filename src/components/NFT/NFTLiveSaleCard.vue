<template>
<div class="card bg-jk-raffle border-0">
    <div class="p-2" v-if="isNFTAsset">
        <video v-if="nftAsset.mainVideoUrl" muted :src="nftAsset.mainVideoUrl" class="rounded-2"></video>
        <img v-else-if="nftAsset.mainImgUrl" class="w-full h-full rounded-2" :src="nftAsset.mainImgUrl" />
    </div>
    <div class="p-2" v-else>
        <img class="w-full h-full" :src="ImageHelper.getRebreakImage(pack.assetPackType)" />
    </div>    
    <div class="px-2 pt-2 pb-4">
        <div v-if="isNFTAsset">
            <h6 class="font-semibold mb-2 text-white">{{ nftAsset.name }}</h6>
            <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 d-block" v-if="nftAsset.rarity">Rarity: {{ nftAsset.rarity }}</span>
            <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 d-block" v-if="nftAsset.mintNumber && nftAsset.totalSupply">Mint {{ nftAsset.mintNumber }} of {{ nftAsset.totalSupply }}</span>
        </div>
        <div v-else>
            <h6 class="font-semibold mb-2 text-dark">{{ pack.name + ' #' + pack.number }}</h6>
        </div>

        <div>
            <div v-if="sale.saleType === SaleType.LiveGiveaway">
                <div v-if="winningBuyOrder.id" class="text-xs text-success font-semibold mt-2">
                    <span v-if="!StringHelper.isNullOrEmpty(airdropGiveAwayUserName)">Given to {{ airdropGiveAwayUserName }}</span>
                </div>
                <div v-else class="text-xs text-white font-semibold mt-2">
                    Giveaway
                </div>
            </div>
            <div v-else-if="sale.saleType === SaleType.LiveAuction || sale.saleType === SaleType.LiveSale" class="d-flex align-items-center mt-2">
                <div v-if="!winningBuyOrder.id">
                    <div class="text-xs text-white" v-if="sale.floorPrice > 0">
                        Starting Bid:
                    </div>
                    <div class="text-xs text-white ms-auto" v-if="sale.floorPrice > 0">${{ sale.floorPrice }}</div>
                </div>
                <div v-else>
                    <div class="text-xs text-success font-semibold">
                        Sold for ${{winningBuyOrder.amount}} to {{ buyer?.name ?? '' }}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="mode === 'host' && !winningBuyOrder.id">
            <div v-if="sale.saleType === SaleType.LiveGiveaway">
                <button @click.prevent="openGiveAwayModal()"
                    class="w-full badge rounded-pill bg-gradient bg-success">Giveaway
                </button>
                <button @click.prevent="startGiveaway"
                    class="w-full badge rounded-pill bg-gradient bg-success mt-2">Start Giveaway
                </button>  
                <button @click.prevent="editSalePrice" class="w-full badge rounded-pill bg-gradient bg-success">Edit</button>
            </div>
            <div v-else-if="sale.saleType === SaleType.LiveAuction">
                <div class="text-xs text-white font-semibold mt-2">
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
                    <button @click.prevent="editSalePrice" class="w-full badge rounded-pill bg-gradient bg-success">Edit</button>
                </div>
            </div>
            <div class="mt-2" v-else-if="sale.saleType === SaleType.LiveSale">
                <button @click.prevent="editSalePrice" class="w-full badge rounded-pill bg-gradient bg-success">Edit</button>
            </div>            
        </div>
        <div v-if="isRedeemable" class="my-1">
            <span class="badge badge-pill gradient-right start-indigo-500 end-red-500 w-full shadow-2">
                🎁 Redeemable
            </span>
        </div>
        <div v-else-if="mode === 'buyer' && currentUser && !StringHelper.isNullOrEmpty(currentUser.id)">
            <div v-if="sale.saleType === SaleType.LiveGiveaway"></div>
            <div v-else-if="sale.saleType === SaleType.LiveAuction">
                <button v-if="!winningBuyOrder.id" @click.prevent="requestAuction" class="mt-2 w-full badge rounded-pill bg-gradient bg-success">Request</button>
            </div>
            <div v-else-if="sale.saleType === SaleType.LiveSale">
                <button v-if="!winningBuyOrder.id" @click.prevent="purchaseDirectSale" class="mt-2 w-full badge rounded-pill bg-gradient bg-success">Buy Now</button>
            </div>            
        </div>  
        <div class="text-xs text-white font-semibold mt-2" v-if="!isNFTAsset && pack.isOpened">
            Pack is Opened
        </div>          
        <div v-if="mode === 'host' && !isNFTAsset && winningBuyOrder.id">
            <button 
                @click.prevent="openPack" 
                class="mt-2 w-full badge rounded-pill bg-gradient bg-purple-500">
                Break Pack
            </button>
        </div>                  
    </div>
</div>
</template>

<script setup lang="ts">
import NFTAsset from "@/models/NFTAsset";
import { Blockchain, BuyOrder, RedemptionStatus, Sale, SaleAsset, SaleStatus, SaleType, SaleWithAssets, WalletAsset, SaleAssetType, AssetPack, OrderType } from "@/services/api/models";
import BlockchainService from "@/services/BlockchainService";
import { computed, onMounted, ref } from "vue";
import eventBus from "@/events/EventBus";
import SaleService from "@/services/domain/SaleService";
import ToastHelper from "@/helpers/ToastHelper";
import ErrorLogger from "@/helpers/ErrorLogger";
import LoadingHelper from "@/helpers/LoadingHelper";
import useEmitter from "@/helpers/useEmitter";
import UserService from "@/services/domain/UserService";
import StringHelper from '@/helpers/StringHelper';
import { RestApi } from "@/services/RestApi";
import User from "@/models/User";
import ImageHelper from "@/helpers/ImageHelper";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";
import NumberHelper from "@/helpers/NumberHelper";
import { Toast } from "bootstrap";
import { toggleOffCanvas } from "@/hooks/BootstrapHooks";

const store = useStore()

const { currentUser } = storeToRefs(store);
const emitter = useEmitter();

const props = defineProps<{
    saleWithAsset: SaleWithAssets,
    mode: 'host' | 'buyer',
    currentPage: number,
    creditBalance: number,
}>();

const nftAsset = ref({} as NFTAsset);
const buyer = ref({} as User)
const saleAsset = props.saleWithAsset.saleAssets[0] as SaleAsset;
const sale = ref(props.saleWithAsset.sale as Sale);
const winningBuyOrder = ref({} as BuyOrder);
let airdropGiveAwayUserName = ref('');

const isNFTAsset = ref(sale.value.saleAssetType === SaleAssetType.NFT)

const isRedeemable = ref(false)
const pack = ref({} as AssetPack)


function editSalePrice () {
    emitter.emit('OpenEditSalePriceModal', { 
        asset: nftAsset.value, 
        saleId: props.saleWithAsset.sale.id, 
        price: sale.value.floorPrice,
        saleType: sale.value.saleType
    });
}

function requestAuction () {
    const name = (isNFTAsset.value) ? nftAsset.value.name : pack.value.name;
    emitter.emit('RequestAuction', { name: name, mintNumber: nftAsset.value.mintNumber, page: props.currentPage });
}

function openPack() {
    emitter.emit('onOpenPack', pack.value)
    toggleOffCanvas('offCanvasStore', 'hide')        
}

emitter.on('SalePriceUpdated', (value: { saleId: string, newPrice: number}) => {
    if (sale.value.id === value.saleId)
        sale.value.floorPrice = value.newPrice;
});

emitter.on('NftIsGivenAway', async (value: {saleId: string }) => {
    if (sale.value.id === value.saleId) {
        await getAsset();
        await getWinningBuyOrder();
    }
});

emitter.on('PackOpened', async (value: { packId: string }) => {
    if (pack.value.id === value.packId) {
        await getAsset();
    }
})

function openGiveAwayModal() {
    emitter.emit('onOpenGiveAwayModal', { sale: sale.value , nftAsset: nftAsset.value });
}

async function getAsset() {    
    if (isNFTAsset.value) {
        nftAsset.value = await BlockchainService.getInstance(saleAsset.blockchain)
                                                .getAssetById(saleAsset.contractAddress, saleAsset.tokenId);
    
        isRedeemable.value = props.saleWithAsset.saleAssets[0].redemptionStatus === RedemptionStatus.Redeemable;
    }

    else {
        pack.value = (await RestApi.Asset.getAssetPackById(sale.value.assetPackId)).data;
    }    
}

async function getWinningBuyOrder () {
    const currentSale = (await RestApi.Sales.getById(sale.value.id)).data;

    if (currentSale.sale.saleStatus === SaleStatus.Sold || currentSale.sale.saleStatus === SaleStatus.Delivered) {
        if (currentSale.sale.saleType === SaleType.LiveAuction) {
            winningBuyOrder.value = await SaleService.getWinningBuyOrder(sale.value.id) ?? {};
        } else {
            const buyOrder = (await RestApi.Sales.getBuyOrderById(currentSale.sale?.winningBuyOrderId)).data
            buyOrder.amount = NumberHelper.normalizeCurrencyFromAPI(buyOrder?.amount ?? 0)
            winningBuyOrder.value = buyOrder
        }
    }    

    if (sale.value.saleType === SaleType.LiveGiveaway) {
        airdropGiveAwayUserName.value = (await UserService.getUserById(winningBuyOrder.value.userId))?.name;
    }

    if (winningBuyOrder.value && !StringHelper.isNullOrEmpty(winningBuyOrder.value.userId)) {
        buyer.value = (await RestApi.User.getUserById(winningBuyOrder.value.userId)).data;
    }
}

async function startAuction(auctionEndSeconds: number) {
    // const loader = LoadingHelper.showLoader();

    try {
        await SaleService.startAuction(sale.value.id, auctionEndSeconds);
        toggleOffCanvas('offCanvasStore', 'hide')
    } catch (err) {
        ToastHelper.error('There was an error starting the auction')
        await ErrorLogger.logApiError(err)
    }

    // LoadingHelper.hideLoader(loader);
}

async function startGiveaway() {
    try {
        await RestApi.Sales.startGiveaway(sale.value.id);
        ToastHelper.success('Giveaway started')
        toggleOffCanvas('offCanvasStore', 'hide')        
    } catch (err) {
        ToastHelper.error('There was an error starting the giveaway')
        await ErrorLogger.logApiError(err)
    }
}

async function purchaseDirectSale() {
    if (sale.value.saleType !== SaleType.LiveSale) {
        return;
    }

    if (props.creditBalance < sale.value.floorPrice) {
        ToastHelper.warning('Insufficient credits to purchase')
        return;
    }

    try {
        await RestApi.Sales.endLiveSale(sale.value.id, sale.value.livestreamId)
        await getWinningBuyOrder()
        ToastHelper.success('Congrats! successfully purchased ' + nftAsset.value.name + ' ' + nftAsset.value.mintNumber)
        emitter.emit('SalePurchased')
        emitter.emit('AuctionWon', { userName: buyer.value.name, productName: nftAsset.value.name + ' ' + nftAsset.value.mintNumber })
    } catch (err) {
        const error = await ErrorLogger.logApiError(err)
        ToastHelper.error(error[0]);
    }
}

emitter.on('LiveSaleEnded', async (value: { saleId: string }) => {
    if (sale.value.id === value.saleId) {
        await getWinningBuyOrder();
    }
})


eventBus.on('onAuctionEnded', async (value: { sale: Sale, asset: NFTAsset }) => {
    if (sale.value.id === props.saleWithAsset.sale.id) await getWinningBuyOrder();
})

onMounted(async () => {
    await getAsset();
    await getWinningBuyOrder();
})

</script>

<style scoped>

</style>