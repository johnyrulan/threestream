<template>
    <div class="card bg-jk-raffle border-2 j-border-primary">
        <div class="p-2">
        <a href="#" class="d-block" v-if="nftAsset.mainVideoUrl">
            <video class="img-fluid rounded-2" autoplay playsinline loop muted alt="..." :src="ImageHelper.optimizeIPFSMedia(nftAsset.mainVideoUrl, 'video')" />
        </a>
        <a href="#" class="d-block" v-else>
            <img class="img-fluid rounded-2 w-full h-full" :src="ImageHelper.optimizeIPFSMedia(nftAsset.mainImgUrl, 'image')" />
        </a>
        </div>
        <div class="px-4 pt-2 pb-4">
            <h6 class="font-bold mb-2">{{ nftAsset.name }}</h6>
            <div data-bs-toggle="tooltip" data-placement="top" :title="nftAsset.blockChain" class="avatar avatar-sm rounded-circle shadow-1" :class="{ 'rounded-circle': nftAsset.blockChain !== Blockchain.Solana }">
                <img :src="ImageHelper.getBlockchainLogo(nftAsset.blockChain)">
            </div>
            <div class="mt-2">
                <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 me-2" v-if="nftAsset.rarity">Rarity: {{ nftAsset.rarity }}</span>
                <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2" v-if="nftAsset.mintNumber && nftAsset.totalSupply">Mint {{ nftAsset.mintNumber }} of {{ nftAsset.totalSupply }}</span>
            </div>            
        </div>
    </div>
    </template>
    
    <script setup lang="ts">
    import ErrorLogger from "@/helpers/ErrorLogger";
    import ImageHelper from "@/helpers/ImageHelper";
    import LoadingHelper from "@/helpers/LoadingHelper";
    import NumberHelper from "@/helpers/NumberHelper";
    import ToastHelper from "@/helpers/ToastHelper";
    import useEmitter from "@/helpers/useEmitter";
    import { initializeTooltip } from "@/hooks/BootstrapHooks";
    import NFTAsset from "@/models/NFTAsset";
    import { Blockchain, Sale, SaleAsset, WalletAsset, TransferStatus, RedemptionStatus } from "@/services/api/models";
    import BlockchainService from "@/services/BlockchainService";
    import SaleService from "@/services/domain/SaleService";
    import { RestApi } from "@/services/RestApi";
    import { ref } from "@vue/reactivity";
    import { onMounted } from "@vue/runtime-core";
    import { useRoute, useRouter } from "vue-router";
    
    const props = defineProps<{
        asset: WalletAsset
    }>();
    
    const emit = defineEmits<{
        (e: 'saleCancelled', saleId: string): void
    }>();
    
    const emitter = useEmitter();
    const router = useRouter();
    
    const nftAsset = ref(new NFTAsset());
    const salePrice = ref(0)
    
    onMounted(async () => {
        await getBlockchainAsset();
        await getSalePrice();
        initializeTooltip()
    });
    
    async function getSalePrice() {
        try {
            const saleHistories = (await RestApi.Asset
                .getAssetHistory(nftAsset.value.blockChain, nftAsset.value.contractAddress, nftAsset.value.tokenId)).data;
    
            if (saleHistories && saleHistories.length > 0) salePrice.value = NumberHelper.normalizeCurrencyFromAPI(saleHistories[0].saleAmount);
        } catch (err) {
            salePrice.value = 0;
            await ErrorLogger.logApiError(err);
        }
    }
    
    async function editSalePrice () {
        const saleWithAssets = await SaleService.getById(props.asset.saleId);
        emitter.emit('OpenEditSalePriceModal', { asset: nftAsset.value, saleId: saleWithAssets.sale.id, price: saleWithAssets.sale.floorPrice });
    }
    
    async function getBlockchainAsset() {
        nftAsset.value = await BlockchainService.getBlockchainAsset(props.asset.blockchain, props.asset.contractAddress, props.asset.tokenId)
    }
    
    async function cancelSale() {
        const loader = LoadingHelper.showLoader();
    
        try {
            await SaleService.cancelSale(props.asset.id);
            ToastHelper.success('The sale has been cancelled');
            emit('saleCancelled', props.asset.id);
        } catch (err) {
            ToastHelper.error('There was an error cancelling the sale');
        }
    
        LoadingHelper.hideLoader(loader);
    }
    
    function openTransferModal () {
        emitter.emit('OpenTransferModal', { asset: nftAsset.value, assetId: props.asset.id });
    }
    
    function openListForSaleModal () {
        emitter.emit('OpenListForSaleModal', { asset: nftAsset.value, assetId: props.asset.id });
    }
    
    function openRedeemModal() {
        emitter.emit('OpenRedeemNFTModal', { asset: nftAsset.value, assetId: props.asset.id });
    }
    
    function viewSalePage () {
         router.push({ name: 'MarketplaceSale', params: { id: props.asset.saleId }});
    }
    
    </script>