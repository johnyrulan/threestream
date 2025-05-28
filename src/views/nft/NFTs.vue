<template>
<header>
  <div class="container-fluid">
    <div class="pt-6">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0">
          <!-- Title -->
          <h1 class="h2 ls-tight mb-4">
            Your Digitals
          </h1>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- <div class="container-fluid mt-3 mb-4">
    <div class="row">
        <div class="card">
        <div class="card-body">
            <h4 class="text-danger mb-2">Digitals not loading?</h4>
            <p class="text-md text-muted">
                Please note: WAX Blockchain imposes rate limits on the number of that third party apps (like ours) are able to load at once. So if you're seeing   any of your NFTs loading blank, that is why. Rest assured, your NFTs are safe, and our team is hard at work coming up with ways to cache your NFT media and overcome these WAX rate limits.
            </p>
        </div>
        </div>
    </div>
</div> -->

<div class="row mx-1 gap-3 gap-sm-1 text-center "> 
    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-5 col-5 mb-3"  v-for="(sale, index) in salesWithAssets" :key="index">
        <NFTSaleProfileCard :asset="sale?.saleAssets[0]"/>
    </div>
    <h4 class="border-bottom pb-4" v-if="packs.length > 0">Packs</h4>
    <div         
        class="col-xl-2 col-lg-3 col-md-4 col-sm-5 col-5" v-for="(pack, index) in packs" :key="pack.id">
        <NFTRebreakPack :pack="pack" />
    </div>   
    <!-- <h4 class="border-bottom pb-4 mb-4 text-center" v-if="walletAssetsToShow.length > 0">
        <img
            :src="ImageHelper.getBlockchainLogo(Blockchain.Wax)"
        />    
        WAX NFTs
    </h4>  -->
    <div class="text-center mt-4">
        <button v-if="selectedNFTs.length > 0" 
            class="btn btn-primary ms-2" @click="() => { toggleModal('bulkTransferModal', 'show') }">Transfer {{ selectedNFTs.length }} NFT(s)</button>
    </div>        
    <h5 class="mt-2 mb-4 text-center" v-if="selectedNFTs.length > 0" >
        You can transfer upto {{ MAX_TRANSFER_COUNT }} NFTs at once
    </h5>      
    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-5 col-5" v-for="(asset, index) in walletAssetsToShow" :key="asset.id">
        <NFTProfileCard 
            :asset="asset" 
            :is-transfer-max-reached="isTransferMaxReached"
            @sale-cancelled="getUserAssets" 
            @select-nft="selectNFTsToTransfer"            
        />
    </div>
</div>

<div class="text-center border-bottom border-secondary mb-12 mt-6 pb-6">
    <button class="btn btn-large btn-secondary" @click="setNFTsForPageSize" v-if="currentWAXPageSize <= walletAssets.length">Load More</button>
</div>

<div class="modal fade" id="transferConfirmationModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="transferConfirmationModal" style="display: none" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <h2>Before you transfer...</h2>
                <div>
                    <p class="mt-2 mb-3">
                        In case you missed our announcement, <strong>we've launched the JUNKIE NFT Marketplace:</strong> a cross-chain, Opensea-like platform where you can sell your NFTs, right here on JUNKIE.
                    </p>
                    <div class="marketgif text-center">
                        <img  src="@/assets/marketplace-outline.gif" class="rounded"/>
                    </div>

                    <p class="mt-4">
                        Selling on the <strong>JUNKIE Marketplace</strong> will have a number of benefits:
                        <ul>
                            <li>🚀 Sell your NFTs for more $, using our new video selling feature</li>
                            <li>📈 Get in on the ground floor as one of the very first sellers</li>
                            <li>🌱 More eyes on your NFTs, thanks to our launch campaign + PR push</li>
                        </ul>
                    </p>

                    <p class="my-2">
                      Unfortunately, during the launch period, you'll only be able to list NFTs that are in your account at that time. <strong><u>So if you transfer this NFT now, you won't be able to list it on the Marketplace at launch!</u></strong>
                    </p>

                    <a target="_blank" href="https://www.junkieapp.xyz/announcements/announcing-the-junkie-nft-marketplace"><u>Read the full announcement</u></a>
                </div>
            </div>
            <div class="modal-footer d-block">
                <div>
                    <p class="my-2">
                      Are you sure you still want to transfer your NFT?
                    </p>
                </div>
                 <div class="d-flex justify-content-end">
                      <button  type="button" class="btn btn-sm btn-neutral me-2" @click="openTransferModal">
                    Yes, Transfer
                </button>
                <button  type="button" class="btn btn-sm btn-neutral"
                    data-bs-dismiss="modal">
                    No, Cancel
                </button>
                 </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="transferModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="transferModal" style="display: none" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <h2>Transfer Your NFT</h2>

                <div v-if="currentAsset.blockChain === Blockchain.Wax">
                    <div>
                        <p class="mt-2">
                            This NFT is minted on <a href="https://on.wax.io/wax-io/" target="_blank">WAX Blockchain</a>, an eco-friendly blockchain built for NFTs. <b>Only send this NFT to a WAX wallet address.</b> Sending to an address for a different blockchain may result in the loss of your NFT.
                        </p>

                        <p class="mt-2">
                            You can create a WAX Cloud wallet <a href="https://all-access.wax.io/" target="_blank">here on wax.io</a>. If it asks for an initial deposit of WAXP coins, free to email our team at info@junkieapp.xyz for assistance.
                        </p>

                        <button class="btn btn-success mt-3 text-break w-full" v-if="connectedWAXWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="@/assets/blockchains/wax-logo.svg" style="width: 24px; height: 24px;" />
                            </span>
                            {{ connectedWAXWallet }}
                        </button>
                        <button :disabled="!StringHelper.isNullOrEmpty(droppWallet)" class="btn btn-neutral mt-3" v-else @click="connectWaxWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="@/assets/blockchains/wax-logo.svg" style="width: 24px; height: 24px;" />
                            </span>
                            WAX Cloud Wallet
                        </button>

                        <div class="input-group mt-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text p-1" id="dropp-logo">
                                    <img src="@/assets/blockchains/droppp-logo.png" style="height: 45px;">
                                </span>
                            </div>
                            <input :disabled="connectedWAXWallet" v-model="droppWallet" type="text" class="form-control" placeholder="funko.dp" aria-label="dropp-address" aria-describedby="dropp-logo">
                        </div>       
                        <p class="text-warning mt-2">
                            Please note: Sending to the wallet is irreversible. Please make sure you are sending to the right address!                            
                        </p>                 
                        <p class="my-2">Transfer Time: Instant</p>
                    </div>
                </div>
                <div v-if="currentAsset.blockChain === Blockchain.Flow">
                    <!-- <p class="mt-2">
                        This NFT is minted on <a href="https://www.onflow.org/" target="_blank">Flow Blockchain</a>, an eco-friendly blockchain built for NFTs. JUNKIE currently support transfers to Dapper Wallet, a cloud-based Flow wallet linked to Flow collections like NBA Topshot.
                        If you have an NBA Topshot account, then you also already have a Dapper Wallet under the same email address. If necessary, you can create a new Dapper wallet <a href="https://accounts.meetdapper.com/" target="_blank">here</a>.
                    </p>

                    <p class="mt-2">
                        Click below to connect your Dapper wallet. After you have connected your Dapper wallet, you will see the underlying Flow address appear, starting with “0x...”. At that point, you can click the button to transfer.
                    </p> -->

                    <p class="mt-2">
                        This NFT is minted on <a href="https://www.onflow.org/" target="_blank">Sui Blockchain</a>, a scalable & secure blockchain built for NFTs.
                    </p>

                    <div class="mt-4 font-semibold">Connect Wallet</div>
                    <button class="btn btn-success mt-1" v-if="connectedDapperWallet">
                        <span class="icon icon-sm pe-2">
                            <img src="https://lh3.googleusercontent.com/GQe5kyPVPTuSCHNwAaUNbgo7s4IiooDCaXNn6-xMeELBuBRLWwYX2rY2eLKmRUPHTwAtchGgHpGoTVFM-y3dtuOIpw=s60" style="width: 24px; height: 24px;" />
                        </span>
                        {{ connectedDapperWallet }}
                    </button>
                    <button class="btn btn-neutral mt-1" @click="WalletService.connectDapperWallet()" v-else>
                        <span class="icon icon-sm pe-2">
                            <img src="https://lh3.googleusercontent.com/GQe5kyPVPTuSCHNwAaUNbgo7s4IiooDCaXNn6-xMeELBuBRLWwYX2rY2eLKmRUPHTwAtchGgHpGoTVFM-y3dtuOIpw=s60" style="width: 24px; height: 24px;" />
                        </span>
                        Slush
                    </button>


                    
                </div>
                <div v-if="currentAsset.blockChain === Blockchain.Solana">
                    <div>
                        <p class="mt-2 mb-4">
                            This NFT is minted on <a href="https://solana.com/" target="_blank">Solana Blockchain</a>, an eco-friendly blockchain built for NFTs. <b>Only send this NFT to a Solana wallet address.</b> Sending to an address for a different blockchain may result in the loss of your NFT.
                        </p>

                        <!-- <p class="mt-2">
                            You can create a WAX Cloud wallet <a href="https://all-access.wax.io/" target="_blank">here on wax.io</a>. If it asks for an initial deposit of WAXP coins, free to email our team at info@junkieapp.xyz for assistance.
                        </p> -->

                        <!-- <p class="my-2">
                            Alternatively, you can keep your NFT here on JUNKIE and list it for sale on our marketplace.
                        </p> -->
                        <button class="btn btn-success text-break w-full" v-if="connectedPhantomWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F3632261023-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MVOiF6Zqit57q_hxJYp%252Favatar-1615495356537.png%3Fgeneration%3D1615495356841399%26alt%3Dmedia" style="width: 24px; height: 24px;" />
                            </span>
                            {{ connectedPhantomWallet }}
                        </button>
                        <button class="btn btn-neutral" v-else @click="connectPhantomWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F3632261023-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MVOiF6Zqit57q_hxJYp%252Favatar-1615495356537.png%3Fgeneration%3D1615495356841399%26alt%3Dmedia" style="width: 24px; height: 24px;" />
                            </span>
                            Phantom
                        </button>
                        <p class="my-2">Transfer Time: Instant</p>
                    </div>
                </div>
                <div v-if="currentAsset.blockChain === Blockchain.Polygon">
                    <div>
                        <p class="mt-2 mb-4">
                            This NFT is minted on <a href="https://polygon.technology/" target="_blank">Polygon Blockchain</a>, an eco-friendly blockchain built for NFTs. <b>Only send this NFT to a Polygon wallet address.</b> Sending to an address for a different blockchain may result in the loss of your NFT.
                        </p>

                        <!-- <p class="mt-2">
                            You can create a WAX Cloud wallet <a href="https://all-access.wax.io/" target="_blank">here on wax.io</a>. If it asks for an initial deposit of WAXP coins, free to email our team at info@junkieapp.xyz for assistance.
                        </p> -->

                        <!-- <p class="my-2">
                            Alternatively, you can keep your NFT here on JUNKIE and list it for sale on our marketplace.
                        </p> -->
                        <button class="btn btn-success text-break w-full" v-if="connectedMetaMaskWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="https://docs.metamask.io/metamask-fox.svg" style="width: 24px; height: 24px;" />
                            </span>
                            {{ connectedMetaMaskWallet }}
                        </button>
                        <button class="btn btn-neutral" v-else @click="connectMetamaskWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="https://docs.metamask.io/metamask-fox.svg" style="width: 24px; height: 24px;" />
                            </span>
                            MetaMask
                        </button>
                        <p class="my-2">Transfer Time: 1-2 days</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-neutral" :class="{'disabled': !connectedDapperWallet && !connectedWAXWallet && !connectedPhantomWallet && !connectedMetaMaskWallet && StringHelper.isNullOrEmpty(droppWallet)}"
                    @click.prevent="transferToWallet">
                    Transfer
                </button>
                <button  type="button" class="btn btn-sm btn-neutral"
                    data-bs-dismiss="modal">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="bulkTransferModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="bulkTransferModal" style="display: none" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <h2>Transfer Your NFTs</h2>

                <div>
                    <p class="mt-2">
                        This NFT is minted on <a href="https://on.wax.io/wax-io/" target="_blank">WAX Blockchain</a>, an eco-friendly blockchain built for NFTs. <b>Only send this NFT to a WAX wallet address.</b> Sending to an address for a different blockchain may result in the loss of your NFT.
                    </p>

                    <p class="mt-2">
                        You can create a WAX Cloud wallet <a href="https://all-access.wax.io/" target="_blank">here on wax.io</a>. If it asks for an initial deposit of WAXP coins, free to email our team at info@junkieapp.xyz for assistance.
                    </p>

                    <button class="btn btn-success mt-3 text-break w-full" v-if="connectedWAXWallet">
                        <span class="icon icon-sm pe-2">
                            <img src="@/assets/blockchains/wax-logo.svg" style="width: 24px; height: 24px;" />
                        </span>
                        {{ connectedWAXWallet }}
                    </button>
                    <button :disabled="!StringHelper.isNullOrEmpty(droppWallet)" class="btn btn-neutral mt-3" v-else @click="connectWaxWallet">
                        <span class="icon icon-sm pe-2">
                            <img src="@/assets/blockchains/wax-logo.svg" style="width: 24px; height: 24px;" />
                        </span>
                        WAX Cloud Wallet
                    </button>

                    <div class="input-group mt-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text p-1" id="dropp-logo">
                                <img src="@/assets/blockchains/droppp-logo.png" style="height: 45px;">
                            </span>
                        </div>
                        <input :disabled="connectedWAXWallet" v-model="droppWallet" type="text" class="form-control" placeholder="funko.dp" aria-label="dropp-address" aria-describedby="dropp-logo">
                    </div>       
                    <p class="text-warning mt-2">
                        Please note: Sending to the wallet is irreversible. Please make sure you are sending to the right address!                            
                    </p>                 
                    <p class="my-2">Transfer Time: Instant</p>

                </div>
                </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-neutral" :class="{'disabled': !connectedDapperWallet 
                && !connectedWAXWallet 
                && !connectedPhantomWallet 
                && !connectedMetaMaskWallet 
                && StringHelper.isNullOrEmpty(droppWallet)}"
                    @click.prevent="bulkTransferToWallet">
                    Transfer
                </button>
                <button  type="button" class="btn btn-sm btn-neutral"
                    data-bs-dismiss="modal">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>

<ListNFTForSaleModal/>
<EditSalePriceModal/>
<RedeemNFTModal/>
<TransferJunkieWalletModal/>
</template>

<script setup lang="ts">
import { AssetPack, SaleWithAssets, TransferStatus, TransferWallet, WalletAsset, UserRole, WalletTransferRequest } from "@/services/api/models";
import SaleService from "@/services/domain/SaleService";
import { onMounted } from "@vue/runtime-core";
import { computed, ref } from "vue";
import NFTProfileCard from "@/components/NFT/NFTProfileCard.vue";
import NFTSaleProfileCard from "@/components/NFT/NFTSaleProfileCard.vue";
import useEmitter from "@/helpers/useEmitter";
import ErrorLogger from "@/helpers/ErrorLogger";
import ToastHelper from "@/helpers/ToastHelper";
import LoadingHelper from "@/helpers/LoadingHelper";
import axios from "axios";
import { toggleModal } from "@/hooks/BootstrapHooks";
import NFTAsset from "@/models/NFTAsset";
import { RestApi } from "@/services/RestApi";
import WalletAssetService from "@/services/domain/WalletAssetService";
import { Blockchain } from "@/services/api/models";
import WalletService from "@/services/WalletService";
import ListNFTForSaleModal from "@/components/modals/ListNFTForSaleModal.vue";
import EditSalePriceModal from "@/components/sale/EditSalePriceModal.vue";
import IWalletProvider from "@/interfaces/IWalletProvider";
import Wallet from "@/enums/Wallet";
import RedeemNFTModal from "@/components/modals/RedeemNFTModal.vue";
import TransferJunkieWalletModal from '@/components/modals/TransferJunkieWalletModal.vue';
import eventBus from "@/events/EventBus";
import StringHelper from "@/helpers/StringHelper";
import NFTRebreakPack from "@/components/NFT/Rebreaks/NFTRebreakPack.vue";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";
import { useBlockchainStore } from "@/store/blockchain.store";
import ImageHelper from "@/helpers/ImageHelper";

const store = useStore()
const emitter = useEmitter()

const NFT_PAGE_SIZE = 10;

let salesWithAssets = ref(new Array<SaleWithAssets>());
const walletAssets = ref([] as WalletAsset[])
const walletAssetsToShow = ref([] as WalletAsset[])
const currentWAXPageSize = ref(0)
const currentAsset = ref({} as NFTAsset);
const packs = ref([] as AssetPack[])
const currentSale = ref({} as SaleWithAssets);
const currentAssetId = ref('');
const isDapperSelected = ref(true);
const { currentUser } = storeToRefs(store);

const selectedNFTs = ref([] as { walletAsset: WalletAsset, nftAsset: NFTAsset }[])

const blockchainStore = useBlockchainStore();

const connectedDapperWallet = computed(() => blockchainStore.currentDapperUser)
const connectedPhantomWallet = computed(() => blockchainStore.currentPhantomUser)
const connectedWAXWallet = computed(() => blockchainStore.currentWaxUser)
const connectedMetaMaskWallet = computed(() => blockchainStore.currentMetamaskUser)

const droppWallet = ref('')

const MAX_TRANSFER_COUNT = 10;

const isTransferMaxReached = ref(false)

async function getUserAssets () {
    const loader = LoadingHelper.showLoader();

    try {
        salesWithAssets.value = await SaleService.getUserAssets();
        walletAssets.value = (await RestApi.Asset.getByUserId(currentUser.value.id)).data ?? [];

        walletAssets.value = walletAssets.value.filter(w => showAsset(w));
        packs.value = (await RestApi.Asset.getAssetPacksByUserId(currentUser.value.id)).data;      
        setNFTsForPageSize();  
    } catch (err) {
        ToastHelper.error('There was an retrieving your NFTs. Please try again later.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}

function setNFTsForPageSize() {
    if (currentWAXPageSize.value >= walletAssets.value.length) return;

    currentWAXPageSize.value = currentWAXPageSize.value + NFT_PAGE_SIZE;    
    walletAssetsToShow.value = walletAssets.value.slice(0, currentWAXPageSize.value);    
}

function selectNFTsToTransfer(walletAsset: WalletAsset, nftAsset: NFTAsset, isSelected: boolean) {
    if (isSelected) {
        selectedNFTs.value.push({ walletAsset, nftAsset })        
    } else {
        selectedNFTs.value = selectedNFTs.value.filter(nft => (nft.walletAsset.id !== walletAsset.id))
    }

    isTransferMaxReached.value = selectedNFTs.value.length >= MAX_TRANSFER_COUNT;
}

function showAsset(asset: WalletAsset) {
    return asset.transferStatus === TransferStatus.TransferAvailable
        || asset.transferStatus === TransferStatus.ImportPending
        || asset.transferStatus === TransferStatus.ListedForSale
        || asset.transferStatus === TransferStatus.TransferPending
        || asset.transferStatus === TransferStatus.TransferFailed;
}

function openTransferModal() {
    // toggleModal('transferConfirmationModal', 'hide')
    toggleModal('transferModal', 'show')
}

emitter.on('OpenPack', async () => {
    await getUserAssets();
})

emitter.on('OpenTransferModal', async (value: { asset: NFTAsset, assetId: string }) => {
    currentAsset.value = value.asset;
    currentAssetId.value = value.assetId;
    openTransferModal()
    // toggleModal('transferConfirmationModal', 'show')
})

emitter.on('OpenListForSaleModal', async (value: { asset: NFTAsset, assetId: string }) => {
    currentAsset.value = value.asset;
    currentAssetId.value = value.assetId;
    toggleModal('listForSaleModal', 'show');
})

// emitter.on('OpenRedeemNFTModal', async (value: { asset: NFTAsset, assetId: string }) => {
//     currentAsset.value = value.asset;
//     currentAssetId.value = value.assetId;
//     toggleModal('redeemNFTModal', 'show');
// })

emitter.on('EditDirectSale', async (value: { asset: NFTAsset, assetId: string, saleId: string }) => {
    await getDirectSale(value.saleId);
    currentAsset.value = value.asset;
    currentAssetId.value = value.assetId;
    toggleModal('listForSaleModal', 'show');
})

emitter.on('TransferJunkieAsset', (value: { walletAssetId: string }) => {    
    eventBus.emit('onTransferJunkieAsset', { walletAssetId: value.walletAssetId })
})

async function getDirectSale (saleId: string) {
    try {
        currentSale.value = await SaleService.getById(saleId);
    } catch (err) {
        console.error(err)
        ToastHelper.error('There was an error retrieving your sale. Please try again later');
    }
}

async function transferWaxNFTOld() {
    const obj = {
        email: currentUser.value.email,
        name: currentUser.value.name,
        nftId: currentAsset.value.contractAddress,
        nftName: currentAsset.value.name,
        // toAddress: walletAddress.value
    };

    try {
        // await WalletAssetService.requestTransfer(currentAssetId.value, walletAddress.value, Blockchain.Wax, TransferWallet.WAX);
        await axios.get('https://hooks.zapier.com/hooks/catch/7852240/b8au2n7/', { params: obj })
        ToastHelper.success('Transfer successfully sent! We will review & send your NFT to your requested wallet address');
    } catch (err) {
        console.error(err)
        ToastHelper.error('There was an error submitting your NFT transfer request. Please try again later');
    }
}

async function transferFlowNFT() {
    const obj = {
        junkieAccountEmail: currentUser.value.email,
        junkieUsername: currentUser.value.name,
        nftBlockchain: Blockchain.Flow,
        dapperAccountProvided: connectedDapperWallet.value,
        title: currentAsset.value.name,
        tokenId: currentAsset.value.tokenId,
        serialNumber: currentAsset.value.attributes['serialNumber'],
        playCtegory: currentAsset.value.attributes['playCategory'],
        dateOfMoment: currentAsset.value.attributes['dateOfMoment']
    };

    try {
        await WalletAssetService.requestTransfer(currentAssetId.value, connectedDapperWallet.value, Blockchain.Flow, TransferWallet.Dapper);
        await axios.get('https://hooks.zapier.com/hooks/catch/7852240/baplvq6/', { params: obj })
        ToastHelper.success('Transfer successfully sent! We will review & send your NFT to your requested wallet address');
    } catch (err) {
        console.error(err)
        ToastHelper.error('There was an error submitting your NFT transfer request. Please try again later');
    }
}

async function transferWaxNFT() {
    const waxWallet: string = !StringHelper.isNullOrEmpty(connectedWAXWallet.value) ? connectedWAXWallet.value : droppWallet.value;

    if (StringHelper.isNullOrEmpty(waxWallet)) {
        ToastHelper.warning('Please connect your WAX wallet or enter a valid Dropp wallet to transfer this NFT');
        return;
    }

    try {
        await WalletAssetService.requestTransfer(currentAssetId.value, waxWallet.toLowerCase(), Blockchain.Wax, TransferWallet.WAX);
        ToastHelper.success(`Transfer successfully sent! Your NFT will be sent to ${waxWallet}`);
    } catch (err) {
        console.error(err)
        ToastHelper.error('There was an error submitting your NFT transfer request. Please try again later');
    }
}

async function transferSolanaNFT() {
    try {
        await WalletAssetService.requestTransfer(currentAssetId.value, connectedPhantomWallet.value, Blockchain.Solana, TransferWallet.Phantom);
        ToastHelper.success('Transfer successfully sent! We will review & send your NFT to your requested wallet address');
    } catch (err) {
        console.error(err)
        ToastHelper.error('There was an error submitting your NFT transfer request. Please try again later');
    }
}

async function transferPolygonNFT() {
    try {
        await WalletAssetService.requestTransfer(currentAssetId.value, connectedMetaMaskWallet.value, Blockchain.Polygon, TransferWallet.MetaMask);
        ToastHelper.success('Transfer successfully sent! We will review & send your NFT to your requested wallet address');
    } catch (err) {
        console.error(err)
        ToastHelper.error('There was an error submitting your NFT transfer request. Please try again later');
    }
}

async function connectPhantomWallet() {
    const phantomWallet: IWalletProvider = WalletService.getInstance(Wallet.Phantom);
    await phantomWallet.connect();
}

async function connectWaxWallet() {
    const waxCloudWallet: IWalletProvider = WalletService.getInstance(Wallet.WaxCloudWallet);
    await waxCloudWallet.connect();
}

async function connectMetamaskWallet() {
    const metamaskWallet: IWalletProvider = WalletService.getInstance(Wallet.MetaMask);
    await metamaskWallet.connect();
}

async function transferToWallet () {
    if (!connectedWAXWallet.value && !connectedDapperWallet.value
        && !connectedPhantomWallet.value && !connectedMetaMaskWallet.value
        && StringHelper.isNullOrEmpty(droppWallet.value)) {
        ToastHelper.error('Please enter the wallet address');
        return;
    }

    if (connectedMetaMaskWallet.value) {
        const metamaskWallet: IWalletProvider = WalletService.getInstance(Wallet.MetaMask);
        const connectedBlockchain = await metamaskWallet.getConnectedBlockchain();

        if (connectedBlockchain != currentAsset.value.blockChain) {
            ToastHelper.error(`Your wallet is connected to the ${metamaskWallet.getConnectedBlockchain()} blockchain. Please connect it to the ${currentAsset.value.blockChain} blockchain and try again.`);
            return;
        }
    }

    if (currentAsset.value.blockChain === Blockchain.Wax) await transferWaxNFT();
    else if (currentAsset.value.blockChain === Blockchain.Flow) await transferFlowNFT();
    else if (currentAsset.value.blockChain === Blockchain.Solana) await transferSolanaNFT();
    else if (currentAsset.value.blockChain === Blockchain.Polygon) await transferPolygonNFT();

    toggleModal('transferModal', 'hide')

    await getUserAssets();
}


async function bulkTransferToWallet () {
    if (!connectedWAXWallet.value && !connectedDapperWallet.value
        && !connectedPhantomWallet.value && !connectedMetaMaskWallet.value
        && StringHelper.isNullOrEmpty(droppWallet.value)) {
        ToastHelper.error('Please enter the wallet address');
        return;
    }
    const waxWallet: string = !StringHelper.isNullOrEmpty(connectedWAXWallet.value) ? connectedWAXWallet.value : droppWallet.value;

    if (StringHelper.isNullOrEmpty(waxWallet)) {
        ToastHelper.warning('Please connect your WAX wallet or enter a valid Dropp wallet to transfer this NFT');
        return;
    }

    const transferAssets: WalletTransferRequest[] = selectedNFTs.value.map(n => {
        return {
            walletAssetId: n.walletAsset?.id,
            transferWalletAddress: waxWallet.toLowerCase(),
            blockchain: Blockchain.Wax,
            wallet: TransferWallet.WAX
        } as WalletTransferRequest
    })

    try {
        await RestApi.Wallet.bulkRequestTransfer(transferAssets);
        ToastHelper.success(`Transfer successfully sent! Your NFTs will be sent to ${waxWallet}`);
    } catch (err) {
        console.error(err)
        ToastHelper.error('There was an error submitting your NFT transfer request. Please try again later');
    }

    toggleModal('bulkTransferModal', 'hide')

    window.location.reload();
}

onMounted(async () => {
    await getUserAssets();    
});
</script>

<style scoped>
.marketgif img{
    max-width : 70% ;
    width :100%;
}
.card-bg{
    border: 1px solid #E7EAF0;
    box-shadow: none;
}
.card-selected{
     border:2px solid #bbb4b4dd;
     box-shadow: 0px 0px 9px 5px #0000001a;
}
.card-body img{
     height: 30px;
     border-radius: 6px;
}
.listforsale-modal{
    max-width: 380px;
}
</style>