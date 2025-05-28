<template>
<div class="h-screen flex-grow-1">
    <div class="bg-dark">
    <div class="d-xl-flex">
        <div class="min-w-0 flex-xl-fill">
            <!-- Navbar -->
            <header class="mt-4">
                <div class="container-fluid">
                    <div class="mb-4">
                        <div class="row align-items-center">
                            <div class="col-sm col-12">
                                <!-- Title -->
                                <h1 class="ls-tight border-bottom pb-4 text-white">NFT Marketplace</h1>

                                <div class="card mt-4">
                                    <div class="card-body">
                                        <h4 class="j-text-primary mb-2">Welcome to the Marketplace!</h4>
                                        <p class="text-regular text-muted">
                                            Thanks for being an early user of our NFT Marketplace! As you can see, we're starting with the basics. But we'll be rolling out a ton more features as we go, like sorting by price, filtering by NFT collection, recent seller activity, top seller leaderboards, and more. For more info, check out our <a href="https://www.junkieapp.xyz/marketplace-roadmap" target="_blank">marketplace's public roadmap here</a> ⛰️.
                                        </p>
                                        <p class="text-regular text-muted">LFG JUNKIES! 🤪</p>
                                        <p class="font-bold mt-1">Note: For a limited time, we are having a 0% commission rate! Take advantage of that and start buying and selling NFTs!</p>
                                    </div>
                                </div>


                                <h2 class="ls-tight mt-4 text-white">All Listings 🚀</h2>


                            </div>
                            <!-- Actions -->
                            <!-- <div class="col-sm-auto col-12 mt-4 mt-sm-0">
                                <div class="hstack gap-2 justify-content-sm-end">
                                <router-link :to="{ name: 'Marketplace' }" class="btn btn-sm btn-neutral border-base" role="button">
                                        <span class="pe-2"><i class="bi bi-arrow-left"></i></span>
                                    <span>Back to Marketplace</span>
                                </router-link>
                                <a href="#modalExport" class="btn btn-sm btn-neutral" data-bs-toggle="modal">
                                    <span class="pe-2">
                                    <i class="bi bi-people-fill"></i>
                                    </span>
                                    <span>Share</span>
                                </a>
                                <button class="btn btn-sm btn-neutral">
                                    <span class="pe-2">
                                    <i class="bi bi-heart"></i>
                                    </span>
                                    <span>Save</span>
                                </button>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
            </header>
            <!-- Main -->
            <main class="border-bottom pb-6">

                <!-- Container -->
                <div class="container-fluid vstack gap-3">
                   <div class="d-flex flex-wrap gap-1">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-funnel me-2"></i>
                            <VueMultiselect
                                v-model="currentFilters.blockchain"
                                :options="blockchainFilterOptions"
                                :searchable="false"
                                :show-labels="false"
                                :allow-empty="false"
                                placeholder="Blockchain"
                                @select="async (value) =>
                                {
                                    currentFilters.blockchain = value;
                                    currentFilters.collection = '';
                                    currentFilters.page = 1;
                                    await getCollections(value);
                                    await getSales();
                                    setPage(1);
                                }">
                            </VueMultiselect>
                        </div>
                        <div class="d-flex align-items-center" style="min-width: 300px;" v-if="collectionFilterOptions.length > 0">
                            <i class="bi bi-funnel me-2"></i>
                            <VueMultiselect
                                :options="collectionFilterOptions"
                                label="collectionName" track-by="collectionKey"
                                :searchable="false"
                                :show-labels="false"
                                placeholder="Collection"
                                :allow-empty="false"
                                @select="async (value) =>
                                {
                                    currentFilters.collection = value.collectionKey;
                                    currentFilters.page = 1;
                                    await getSales();
                                    setPage(1);
                                }">
                            </VueMultiselect>
                        </div>
                        <div class="d-flex align-items-center">
                            <i class="bi bi-arrow-down-up me-2"></i>
                            <VueMultiselect
                                v-model="selectedSortOption"
                                :options="sortOptions"
                                label="label" track-by="key"
                                :searchable="false"
                                :show-labels="false"
                                :allow-empty="false"
                                placeholder="Sort"
                                @select="async (value) =>
                                {
                                    selectedSortOption = value;
                                    currentFilters.sort = value.key;
                                    currentFilters.page = 1;
                                    await getSales();
                                    setPage(1);
                                }">
                            </VueMultiselect>
                        </div>
                        <!-- <div class="d-flex align-items-center ms-3">
                            <div class="input-group input-group-sm input-group-inline">
                                <span class="input-group-text pe-2">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" v-model="searchValue" class="form-control" placeholder="Search" aria-label="Search" data-form-type="" @keyup="applyFilters">
                            </div>
                        </div> -->
                   </div>

                    <div class="d-flex flex-wrap justify-content-start gap-4">
                        <MarketplaceNFTCard v-for="marketplaceSale in latestSales.marketplaceSales" :key="marketplaceSale.id" :sale="marketplaceSale"
                        :sale-assets="marketplaceSale.saleAssets" :ref="marketplaceSale.id"
                        @nft-loaded="(nft) => onNFTLoaded(marketplaceSale.id, nft)"/>
                    </div>
                    <div class="row g-6" id="lightgallery">
                        <div class="col-xxl-3 col-xl-4 col-md-6" >
                        </div>
                    </div>
                    <div class="row">
                        <nav class="col-12 mt-3">
                            <ul class="pagination pagination-spaced justify-content-center gap-2 flex-wrap">
                                <li class="page-item">
                                    <button class="page-link rounded-circle" @click="movePageArrow(currentPage - 1)">
                                        <i class="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                <li v-for="page of totalPages" :key="page" class="page-item" :class="{ 'active': (page === currentPage) }">
                                <button class="page-link rounded-circle" @click="movePageArrow(page)">{{ page }}</button>
                                </li>

                                <li class="page-item">
                                    <button class="page-link rounded-circle" @click="movePageArrow(currentPage + 1)">
                                        <i class="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </main>
        </div>
    </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import { initializeTooltip } from '@/hooks/BootstrapHooks';
import { Blockchain, MarketplaceCollectionResponseModel, MarketplaceFilterRequest, MarketplaceResponseModel, MarketplaceSortOptions } from '@/services/api/models';
import { onMounted } from '@vue/runtime-core';
import { computed, ref } from 'vue';
import MarketplaceNFTCard from "@/components/marketplace/MarketplaceNFTCard.vue";
import { RestApi } from "@/services/RestApi";
import VueMultiselect from 'vue-multiselect'
import { useRoute, useRouter } from "vue-router";
import NFTAsset from "@/models/NFTAsset";
import MarketplaceService from "@/services/domain/MarketplaceService";
import useEmitter from "@/helpers/useEmitter";
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';

enum FilterOptions {
    All = 'All',
    Wax = 'Wax',
    Flow = 'Flow',
    Solana = 'Solana',
    Polygon = 'Polygon'
}

const currentFilters = ref({
    blockchain: FilterOptions.All,
    collection: '',
    sort: MarketplaceSortOptions.NewestListings,
    page: 1,
    pageSize: 20
} as MarketplaceFilterRequest)

const sortOptions = [
    { label: 'Newest Listings', key: MarketplaceSortOptions.NewestListings },
    { label: 'Lowest Price',    key: MarketplaceSortOptions.LowestPrice    },
    { label: 'Highest Price',   key: MarketplaceSortOptions.HighestPrice   },
    { label: 'Oldest Listings', key: MarketplaceSortOptions.OldestListings }];

const blockchainFilterOptions = [ FilterOptions.All, FilterOptions.Wax, FilterOptions.Flow, FilterOptions.Solana, FilterOptions.Polygon ];

const store = useStore();
const { currentUser } = storeToRefs(store);
const router = useRouter();
const route = useRoute();
const emitter = useEmitter();

const latestSales = ref([] as MarketplaceResponseModel)
const allNFTs = [] as { saleId: string, asset: NFTAsset }[]
const currentPage = ref(1);
const totalPages = ref(1);

const selectedSortOption = ref(sortOptions[0]);
const collectionFilterOptions = ref([] as MarketplaceCollectionResponseModel[]);

async function movePageArrow(page: number) {
  if (page <= 0) return;
  if (page > totalPages.value) return;

  setPage(page);
  await getSales();
}

emitter.on('OfferAccepted', async () => {
    await getCollections(currentFilters.value.blockchain);
    await getSales();
    setPage(currentFilters.value.page);
});

async function setPage(page: number) {
    currentFilters.value.page = page;

    currentPage.value = page;

    totalPages.value = Math.floor(latestSales.value.totalResults / currentFilters.value.pageSize);

    if (latestSales.value.totalResults % currentFilters.value.pageSize > 0) {
        totalPages.value = totalPages.value + 1;
    }

    setQueryParams();
}

function setQueryParams() {
    router.replace({name: 'Marketplace', query: {
        blockchain: currentFilters.value.blockchain || undefined,
        collection: currentFilters.value.collection || undefined,
        sort: currentFilters.value.sort || undefined,
        page: currentFilters.value.page || undefined }});
}

async function getSales() {
   latestSales.value = await MarketplaceService.getSales(currentFilters.value);
}

const latestAuctions = ref([] as MarketplaceResponseModel)

async function getAuctions() {
    latestAuctions.value = (await RestApi.Marketplace.getAuctions()).data;
}

function onNFTLoaded(saleId: string, asset: NFTAsset) {
    allNFTs.push({ saleId: saleId, asset: asset });
}

async function getCollections (value: string) {
    if (!value || value === 'All') value = '';
    collectionFilterOptions.value = await MarketplaceService.getCollections(value as Blockchain);
}

function parseQueryParams() {
    if (route.query.page) currentFilters.value.page = Number.parseInt(route.query.page as string) ?? 1;
    if (route.query.collection) currentFilters.value.collection = route.query.collection as string;
    if (route.query.blockchain) currentFilters.value.blockchain = route.query.blockchain as string;
    if (route.query.sort) {
     currentFilters.value.sort = route.query.sort as string;
     selectedSortOption.value = sortOptions.find(x => x.key == currentFilters.value.sort) ?? sortOptions[0];
    }
}

onMounted(async () => {
    initializeTooltip();
    parseQueryParams();

    await getCollections(currentFilters.value.blockchain);
    await getSales();
    setPage(currentFilters.value.page);
})

</script>

<style scoped>
.multiselect {
    min-width: 150px;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>