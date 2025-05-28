<template>
<div class="card shadow-4-hover">
    <div class="p-2">
    <a href="#" class="d-block" v-if="nftAsset.mainVideoUrl">
        <video class="img-fluid rounded-2 h-52" playsinline loop muted alt="..." :src="ImageHelper.optimizeIPFSMedia(nftAsset.mainVideoUrl, 'video')" />
    </a>
    <a href="#" class="d-block" v-else>
        <img class="img-fluid rounded-2 h-52" :src="ImageHelper.optimizeIPFSMedia(nftAsset.mainImgUrl, 'image')" />
    </a>
    </div>
    <div class="my-2 text-center">
        <button v-if="!isSelected && !isTransferMaxReached" class="btn btn-success btn-sm" 
            @click="emit('selectNft', props.asset, nftAsset, true); isSelected = true">Select NFT</button>
        <button v-else-if="isSelected" class="btn btn-danger btn-sm" 
            @click="emit('selectNft', props.asset, nftAsset, false); isSelected = false">Unselect NFT</button>
    </div>        
    <div class="px-4 pt-2 pb-4">
        <h6 class="font-bold mb-2 text-black">{{ nftAsset.name }}</h6>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 me-2" v-if="nftAsset.rarity">Rarity: {{ nftAsset.rarity }}</span>
        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2" v-if="nftAsset.mintNumber && nftAsset.totalSupply">Mint {{ nftAsset.mintNumber }} of {{ nftAsset.totalSupply }}</span>
        <!-- <button disabled data-bs-toggle="modal" data-bs-target="#transferModal" class="btn btn-sm btn-warning rounded-pill">Transfer</button> -->
        <div class="mt-2" v-if="!isSelected">
            <div v-if="(asset.transferStatus === TransferStatus.TransferAvailable 
                        || asset.transferStatus === TransferStatus.ListedForSale)"
                class="mb-2">
                <button class="btn btn-sm btn-primary rounded-pill" @click="setProfilePic">Set As Profile Pic</button>                
            </div>
            <span v-if="asset.isTransferable 
                    && asset.transferStatus === TransferStatus.TransferAvailable 
                    && asset.redemptionStatus === RedemptionStatus.NotRedeemable" 
            class="d-inline-block mb-1" tabindex="0" data-bs-toggle="tooltip" data-bs-placement="top" :title="'You can request to transfer this NFT to your ' + asset.blockchain  + ' wallet. Once transferred, this NFT will no longer be available in JUNKIE'">
                <button class="btn btn-sm btn-warning rounded-pill" @click="openTransferModal">External Transfer</button>       
            </span>
            <span v-if="asset.isTransferable 
                    && asset.transferStatus === TransferStatus.TransferAvailable 
                    && asset.redemptionStatus === RedemptionStatus.NotRedeemable" 
            class="d-inline-block mb-1" tabindex="0" data-bs-toggle="tooltip" data-bs-placement="top" :title="'You can transfer this to another JUNKIE user'">
                <button class="btn btn-sm btn-info rounded-pill" @click="openJunkieTransferModal">Transfer to JUNKIE Wallet</button>       
            </span>            
            <div v-else-if="asset.transferStatus === TransferStatus.TransferPending" class="text-muted">
                Transfer requested to {{ asset.transferWalletAddress }}
            </div>
            <div v-else-if="asset.transferStatus === TransferStatus.Transferred" class="text-muted">
                Transferred to {{ asset.transferWalletAddress }}
            </div>
            <div v-else-if="asset.transferStatus === TransferStatus.TransferFailed" class="text-danger">
                There was an error transferrring this NFT to {{ asset.transferWalletAddress }}. 
                <div class="mt-1 font-italic">If problem persists, please contact support at info@junkieapp.xyz or DM an Admin on Discord to resolve this.</div>
                <button class="btn btn-sm btn-warning rounded-pill mt-2" @click="openTransferModal">Retry Transfer</button>
            </div>

            <span v-if="asset.redemptionStatus === RedemptionStatus.Redeemable" class="d-inline-block mx-1" tabindex="0" data-bs-toggle="tooltip" data-bs-placement="top" :title="'You can redeem this NFT. Once redeemed, this NFT will no longer be available in JUNKIE'">
                <button class="btn btn-sm btn-warning rounded-pill" @click="openRedeemModal">Redeem Asset</button>
            </span>
            <div v-else-if="asset.redemptionStatus === RedemptionStatus.Redeemed" class="text-muted">
                This asset has been redeemed. Please contact info@junkieapp.xyz with any questions.
            </div>

           <!-- <span class="d-inline-block" tabindex="0" v-if="asset.transferStatus === TransferStatus.TransferAvailable && asset.redemptionStatus !== RedemptionStatus.Redeemed">
                <div class="text-muted text-sm" v-if="salePrice > 0">Last Sale Price: ${{ salePrice }}</div>
                <button class="btn btn-sm btn-success rounded-pill" @click="openListForSaleModal">List for Sale</button>
           </span> -->
            <span class="d-inline-block mb-1" tabindex="0" v-else-if="asset.transferStatus === TransferStatus.ListedForSale">
                <button class="btn btn-sm btn-success rounded-pill" @click="viewSalePage">View Sale Page</button>
                <button class="btn btn-sm btn-success rounded-pill mt-2" @click.prevent="editSalePrice">Edit Sale Price</button>
                <button class="btn btn-sm btn-danger rounded-pill mt-2" @click.prevent="cancelSale">Cancel Sale</button>
           </span>
            <div v-else-if="asset.transferStatus === TransferStatus.Sold" class="text-muted">
                Sold on Marketplace
            </div>

            <div v-if="asset.redemptionStatus === RedemptionStatus.Redeemable" class="mt-2 font-bold font-sm text-success">
                This NFT will pay a 10% royalty when sold on the JUNKIE Marketplace
            </div>        
            <div v-else-if="asset.transferStatus === TransferStatus.ImportPending" class="text-warning">
                This NFT is still being imported. Please check again in a few minutes.
            </div>    
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import ErrorLogger from "@/helpers/ErrorLogger";
import ImageHelper from "@/helpers/ImageHelper";
import LoadingHelper from "@/helpers/LoadingHelper";
import NumberHelper from "@/helpers/NumberHelper";
import StringHelper from "@/helpers/StringHelper";
import ToastHelper from "@/helpers/ToastHelper";
import useEmitter from "@/helpers/useEmitter";
import { initializeTooltip } from "@/hooks/BootstrapHooks";
import NFTAsset from "@/models/NFTAsset";
import { Blockchain, Sale, SaleAsset, WalletAsset, TransferStatus, RedemptionStatus, UserAttributes, User } from "@/services/api/models";
import BlockchainService from "@/services/BlockchainService";
import SaleService from "@/services/domain/SaleService";
import { RestApi } from "@/services/RestApi";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
    asset: WalletAsset,
    isTransferMaxReached: boolean
}>();

const emit = defineEmits<{
    (e: 'saleCancelled', saleId: string): void,
    (e: 'selectNft', walletAsset: WalletAsset, nftAsset: NFTAsset, isSelected: boolean): void    
}>();

const emitter = useEmitter();
const router = useRouter();

const nftAsset = ref(new NFTAsset());
const salePrice = ref(0)
const isSelected = ref(false)

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

async function setProfilePic() {
    const loader = LoadingHelper.showLoader();

    try {
        const isVideo = !StringHelper.isNullOrEmpty(nftAsset.value.mainVideoUrl);

        const profilePicUrl = isVideo ? nftAsset.value.mainVideoUrl : nftAsset.value.mainImgUrl;

        const userAttributes = currentUser.value.userAttributes as UserAttributes ?? {};

        userAttributes.profilePicUrl = profilePicUrl;
        userAttributes.isProfilePicVideo = isVideo;

        const user = currentUser.value as User;
        user.userAttributes = userAttributes;
        
        await RestApi.User.saveUser(user);

        ToastHelper.success('Profile Pic successfully updated');
    } catch (err) {
        ToastHelper.error('There was an error updating the profile pic');
    }

    LoadingHelper.hideLoader(loader);
}

function openTransferModal () {
    emitter.emit('OpenTransferModal', { asset: nftAsset.value, assetId: props.asset.id });
}

function openJunkieTransferModal() {
    emitter.emit('TransferJunkieAsset', { walletAssetId: props.asset.id });
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