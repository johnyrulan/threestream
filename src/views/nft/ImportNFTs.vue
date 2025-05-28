<template>
<header>
  <div class="container-fluid">
    <div class="pt-6">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0">
          <!-- Title -->
          <h1 class="h2 ls-tight">
            Import NFTs
          </h1>
        </div>
      </div>
    </div>
  </div>
</header>

<div class="container-fluid mt-3 mb-4">
    <div class="row">
        <div class="card">
        <div class="card-body">
            <h4 class="text-danger mb-2">NFTs not loading?</h4>
            <p class="text-md text-muted">
                Please note: This is an alpha feature so it might take a couple of retries to load all of your NFTs. 
            </p>
        </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="card">
            <div class="card-body">
                <!-- <h4 class="text-warning mb-2">Select a Blockchain & Connect your Wallet</h4>
                <div class="mt-2">
                    <label class="form-label" for="blockchain">Blockchain</label>
                    <div class="hstack gap-3 flex-wrap">
                        <div class="form-item-checkable" data-bs-trigger="hover focus" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Polygon">
                            <input disabled class="form-item-check" type="radio" name="blockchain" id="blockchain-polygon">
                            <label class="form-item pointer-cursor" for="blockchain-polygon">
                                <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-24 h-24 text-center text-muted">
                                    <img src="https://cryptologos.cc/logos/polygon-matic-logo.svg?v=021" />
                                </span>
                            </label>
                        </div>
                        <div class="form-item-checkable" data-bs-trigger="hover focus" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Flow">
                        <input disabled class="form-item-check" type="radio" name="blockchain" id="blockchain-flow">
                        <label class="form-item pointer-cursor" for="blockchain-flow">
                            <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-24 h-24 text-center text-muted">
                                <img src="https://cryptologos.cc/logos/flow-flow-logo.svg?v=021" />
                            </span>
                        </label>
                        </div>
                        <div class="form-item-checkable" data-bs-trigger="hover focus" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Solana">
                        <input disabled class="form-item-check" type="radio" name="blockchain" id="blockchain-solana">
                        <label class="form-item pointer-cursor" for="blockchain-solana">
                            <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-24 h-24 text-center text-muted">
                                <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=021" />
                            </span>
                        </label>
                        </div>
                        <div class="form-item-checkable" data-bs-trigger="hover focus" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="WAX">
                        <input class="form-item-check" type="radio" name="blockchain" id="blockchain-wax" checked>
                        <label class="form-item pointer-cursor" for="blockchain-wax">
                            <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-24 h-24 text-center text-muted">
                                <img src="https://cryptologos.cc/logos/wax-waxp-logo.svg?v=021" />
                            </span>
                        </label>
                        </div>
                        <div class="form-item-checkable" data-bs-trigger="hover focus" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Binance Smart Chain">
                        <input disabled class="form-item-check" type="radio" name="blockchain" id="blockchain-binance">
                        <label class="form-item pointer-cursor" for="blockchain-binance">
                            <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-24 h-24 text-center text-muted">
                                <img src="https://cryptologos.cc/logos/binance-usd-busd-logo.svg?v=021" />
                            </span>
                        </label>
                        </div>
                        <div class="form-item-checkable" data-bs-trigger="hover focus" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Ethereum">
                        <input disabled class="form-item-check" type="radio" name="blockchain" id="blockchain-ethereum">
                        <label class="form-item pointer-cursor" for="blockchain-ethereum">
                            <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-24 h-24 text-center text-muted">
                                <img style="max-height: 100%" src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=021" />
                            </span>
                        </label>
                        </div>
                    </div>
                </div> -->
                <div class="my-2">
                    <label class="form-label text-black" for="formInputExample">Connect Wallet</label>
                    <div class="hstack gap-3 d-flex flex-wrap">
                        <button class="btn btn-success" v-if="connectedDapperWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="https://lh3.googleusercontent.com/GQe5kyPVPTuSCHNwAaUNbgo7s4IiooDCaXNn6-xMeELBuBRLWwYX2rY2eLKmRUPHTwAtchGgHpGoTVFM-y3dtuOIpw=s60" style="width: 24px; height: 24px;" />
                            </span>
                            {{ connectedDapperWallet }}
                        </button>
                        <button class="btn btn-neutral" @click="connectDapperWallet" v-else>
                            <span class="icon icon-sm pe-2">
                                <img src="https://lh3.googleusercontent.com/GQe5kyPVPTuSCHNwAaUNbgo7s4IiooDCaXNn6-xMeELBuBRLWwYX2rY2eLKmRUPHTwAtchGgHpGoTVFM-y3dtuOIpw=s60" style="width: 24px; height: 24px;" />
                            </span>
                            Slush
                        </button>

                        <button class="btn btn-success" v-if="connectedMetamaskWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJZaVpfhv3kgZA46GoqfVNIFhR6pXIdX4_Rg&s" style="width: 24px; height: 24px;" />
                                <img v-if="metaMaskBlockchain === Blockchain.Ethereum" src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=021" class="ms-2" style="width: 24px; height: 24px;" />
                                <img v-else-if="metaMaskBlockchain === Blockchain.Polygon" src="https://cryptologos.cc/logos/polygon-matic-logo.svg?v=021" class="ms-2" style="width: 24px; height: 24px;" />
                                <img v-else-if="metaMaskBlockchain === Blockchain.BinanceSmartChain" src="https://cryptologos.cc/logos/binance-usd-busd-logo.svg?v=021" class="ms-2" style="width: 24px; height: 24px;" />                                                                                        
                            </span>
                            {{ connectedMetamaskWallet }}
                        </button>                                    
                        <button class="btn btn-neutral" @click="connectMetamaskWallet" v-else>
                            <span class="icon icon-sm pe-2">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJZaVpfhv3kgZA46GoqfVNIFhR6pXIdX4_Rg&s" style="width: 24px; height: 24px;" />
                            </span>
                            MetaMask
                        </button>

                        <button class="btn btn-success" v-if="connectedBloctoWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F4111966839-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MFJEAgz-LrhDYkRm4sv%252Favatar-1600919464132.png%3Fgeneration%3D1600919464422284%26alt%3Dmedia" style="width: 24px; height: 24px;" />
                            </span>
                            {{ connectedBloctoWallet }}
                        </button>
                        <button class="btn btn-neutral" @click="connectBloctoWallet" v-else>
                            <span class="icon icon-sm pe-2">
                                <img src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F4111966839-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MFJEAgz-LrhDYkRm4sv%252Favatar-1600919464132.png%3Fgeneration%3D1600919464422284%26alt%3Dmedia" style="width: 24px; height: 24px;" />
                            </span>
                            Blocto
                        </button>

                        <button class="btn btn-success" v-if="connectedDapperWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="@/assets/blockchains/dapper-logo.png" style="width: 24px; height: 24px;" />
                            </span>
                            {{ connectedDapperWallet }}
                        </button>
                        <button class="btn btn-neutral" @click="connectDapperWallet" v-else>
                            <span class="icon icon-sm pe-2">
                                <img src="@/assets/blockchains/dapper-logo.png" style="width: 24px; height: 24px;" />
                            </span>
                            Dapper
                        </button>


                        <button class="btn btn-success" v-if="connectedPhantomWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F3632261023-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MVOiF6Zqit57q_hxJYp%252Favatar-1615495356537.png%3Fgeneration%3D1615495356841399%26alt%3Dmedia" style="width: 24px; height: 24px;" />
                            </span>
                            {{ connectedPhantomWallet }}
                        </button>                                    
                        <button class="btn btn-neutral" v-else @click="WalletService.connectWallet(Wallet.Phantom)">
                            <span class="icon icon-sm pe-2">
                                <img src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F3632261023-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MVOiF6Zqit57q_hxJYp%252Favatar-1615495356537.png%3Fgeneration%3D1615495356841399%26alt%3Dmedia" style="width: 24px; height: 24px;" />
                            </span>
                            Phantom
                        </button>

                        <button class="btn btn-success" v-if="connectedWAXWallet">
                            <span class="icon icon-sm pe-2">
                                <img src="@/assets/blockchains/wax-logo.svg" style="width: 24px; height: 24px;" />
                            </span>
                            {{ connectedWAXWallet }}
                        </button>
                        <button class="btn btn-neutral" @click="WalletService.connectWallet(Wallet.WaxCloudWallet)" v-else>
                            <span class="icon icon-sm pe-2">
                                <img src="@/assets/blockchains/wax-logo.svg" style="width: 24px; height: 24px;" />
                            </span>
                            WAX Cloud Wallet
                        </button>
                        
                        <button class="btn btn-danger" @click="disconnectWallets" v-if="isWalletConnected">
                            <i class="bi bi-box-arrow-right me-2"></i>
                            Disconnect Wallet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container-fluid mb-5">
    <div class="row">
        <div class="card">
            <div class="card-body">
                <h4 class="text-warning mb-2">Your NFTs</h4>
                <div>
                    <!-- <label class="form-label">Search</label> -->
                    <div class="input-group input-group-sm input-group-inline" @keyup.enter="getAssets">
                        <span class="input-group-text pe-2">
                            <i class="bi bi-search"></i>
                        </span>
                        <input v-model="searchValue" type="text" class="form-control" placeholder="Search" aria-label="Search" data-form-type="">
                        <button class="btn btn-sm btn-primary ps-3" @click="searchAssets">Search</button>
                    </div>
                    <div class="input-group input-group-sm input-group-inline mt-2" @keyup.enter="getAssets">
                        <span class="input-group-text pe-2">
                            <i class="bi bi-search"></i>
                        </span>
                        <input v-model="collection" type="text" class="form-control" placeholder="Search Collections" aria-label="Search" data-form-type="">
                        <button class="btn btn-sm btn-primary ps-3" @click="searchAssets">Search Collection</button>
                    </div>                    
                </div>
                <div class="text-center my-4">
                    <span v-if="!isWalletConnected" class="font-italic text-muted font-semibold">Connect your wallet to view your NFTs</span>
                    <button v-if="selectedNFTs.length > 0" class="btn btn-primary ms-2" @click="importNFTs">Import {{ selectedNFTs.length }} NFT(s)</button>
                </div>                           
                <div class="d-flex flex-wrap my-3 gap-3">
                    <NFTImportCard
                        style="max-width: 180px; flex-grow: 1"                                                
                        v-for="(nft, index) in nfts" :key="index"
                        :nft-asset="nft"
                        @select-nft-to-import="selectNFTToImport"
                    />
                </div>
                <div class="text-center my-4">
                    <button v-if="isWalletConnected" class="btn btn-secondary" @click="getAssets">Load NFTs</button>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script lang="ts" setup>
import Wallet from '@/enums/Wallet';
import LoadingHelper from '@/helpers/LoadingHelper';
import ToastHelper from '@/helpers/ToastHelper';
import { initializePopover } from '@/hooks/BootstrapHooks';
import { Blockchain, TransferStatus, WalletAsset } from '@/services/api/models';
import BlockchainService from '@/services/BlockchainService';
import WalletService from '@/services/WalletService';
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@/store/main.store';
import NFTImportCard from '@/components/NFT/NFTImportCard.vue';
import NFTAsset from '@/models/NFTAsset';
import WalletAssetService from '@/services/domain/WalletAssetService';
import ErrorLogger from '@/helpers/ErrorLogger';
import StringHelper from '@/helpers/StringHelper';
import { useBlockchainStore } from '@/store/blockchain.store';
import { storeToRefs } from 'pinia';
import { RestApi } from '@/services/RestApi';


const store = useStore();
const blockchainStore = useBlockchainStore();

const { currentUser } = storeToRefs(store);

const isWalletConnected = computed(() => blockchainStore.isWalletConnected)
const connectedWAXWallet = computed(() => blockchainStore.currentWaxUser)
const connectedPhantomWallet = computed(() => blockchainStore.currentPhantomUser)
const connectedBloctoWallet = computed(() => blockchainStore.currentBloctoUser)
const connectedDapperWallet = computed(() => blockchainStore.currentDapperUser)
const connectedMetamaskWallet = computed(() => blockchainStore.currentMetamaskUser)


const nfts = ref([] as NFTAsset[]);
const nftPage = ref(1);
const searchValue = ref('')
const collection = ref('')

const selectedNFTs = ref([] as NFTAsset[])

function selectNFTToImport(nftAsset: NFTAsset, isSelected: boolean) {
    if (isSelected) {
        selectedNFTs.value.push(nftAsset)
        return
    }

    if (nftAsset.blockChain === Blockchain.Wax) selectedNFTs.value = selectedNFTs.value.filter(nft => (nft.contractAddress !== nftAsset.contractAddress))
    else selectedNFTs.value = selectedNFTs.value.filter(nft => (nft.contractAddress !== nftAsset.contractAddress && nft.tokenId !== nftAsset.tokenId))
}

interface TransferNFTModel {
    contractAddress: string;
    tokenId: string
}

async function saveImportedNFTs() {
    const loader = LoadingHelper.showLoader();

    try {
        const walletAssets: WalletAsset[] = [];

        for (let i = 0; i < selectedNFTs.value.length; ++i) {
            const asset = selectedNFTs.value[i];            

            const walletAssetModel = {
                userId: currentUser.value.id,
                blockchain: asset.blockChain,
                ownerAddress: asset.ownerAddress,
                contractAddress: asset.contractAddress,
                tokenId: asset.tokenId,
                transferStatus: TransferStatus.ImportPending              
            } as WalletAsset;

            walletAssets.push(walletAssetModel)
        }        

        await RestApi.Wallet.bulkCreate(walletAssets);
    } catch(err) {
        await ErrorLogger.logApiError(err)
        ToastHelper.error('There was an issue saving your imports.')
    }

    LoadingHelper.hideLoader(loader);
}

async function importNFTs() {
    const currentWalletProvider = WalletService.getCurrentWalletProvider();

    if (!currentWalletProvider) {
        ToastHelper.error('You must connect a wallet to import')
        return;
    }

    const currNFTs = selectedNFTs.value.map(nft => { 
        return {
            contractAddress: nft.contractAddress,
            tokenId: nft.tokenId
        }
    }) as TransferNFTModel[]
    const isSuccessful = await currentWalletProvider.transferNFTs(currNFTs);   

    if (isSuccessful) await saveImportedNFTs();

    selectedNFTs.value = [];    
    nfts.value = [];
    
    await getAssets(); 
}

async function disconnectWallets() {
    WalletService.resetWallets();
    nfts.value = [];
    nftPage.value = 1;
}

async function searchAssets() {
    nfts.value = [];
    nftPage.value = 1;
    await getAssets();
}

async function getAssets() {
    if (nfts.value.length > 0) {
        nftPage.value = nftPage.value + 1;
    }

    if (connectedWAXWallet.value) await getBlockchainAssets(Blockchain.Wax, connectedWAXWallet.value);
    else if (connectedBloctoWallet.value) await getBlockchainAssets(Blockchain.Flow, connectedBloctoWallet.value);
    else if (connectedDapperWallet.value) await getBlockchainAssets(Blockchain.Flow, connectedDapperWallet.value);
    else if (connectedPhantomWallet.value) await getBlockchainAssets(Blockchain.Solana, connectedPhantomWallet.value);
    else if (connectedMetamaskWallet.value) await getBlockchainAssets(await WalletService.getInstance(Wallet.MetaMask).getConnectedBlockchain(), connectedMetamaskWallet.value);    
}

async function getBlockchainAssets(blockchain: Blockchain, walletAddress: string) {
    const loader = LoadingHelper.showLoader();

    try {
        const assets = await BlockchainService
            .getInstance(blockchain)
            .getAssetsByOwner(walletAddress, nftPage.value, 15, searchValue.value, collection.value);
          
            nfts.value = nfts.value.concat(assets);
    } catch (err) {        
        ToastHelper.warning(`We have hit a rate limit retrieving ${blockchain} NFTs. Please try again in a minute`);
    }

    LoadingHelper.hideLoader(loader);
}

onMounted(() => {
    initializePopover()
})
</script>

<style scoped></style>