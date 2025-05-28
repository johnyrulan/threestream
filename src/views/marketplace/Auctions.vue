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
                                <h1 class="ls-tight border-bottom pb-4 text-white">NFT Auctions 🚀</h1>


                                <!-- <h2 class="ls-tight mt-4 text-white">All Auctions 🚀</h2> -->


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

                    <div class="d-flex flex-wrap justify-content-start gap-4">
                        <MarketplaceAuctionCard v-for="marketplaceSale in latestAuctions.marketplaceSales" :key="marketplaceSale.id" :sale="marketplaceSale"
                        :sale-assets="marketplaceSale.saleAssets" :ref="marketplaceSale.id"
                        @nft-loaded="(nft) => {}"/>
                    </div>
                </div>
            </main>
        </div>
    </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import LivestreamWideCard from "@/components/livestream/LivestreamWideCard.vue";
import ImageHelper from '@/helpers/ImageHelper';
import { initializeTooltip, toggleModal } from '@/hooks/BootstrapHooks';
import { Blockchain, Livestream, MarketplaceCollectionResponseModel, MarketplaceFilterRequest, MarketplaceResponseModel, MarketplaceSortOptions, OrderType, SaleAsset, SaleType, SaleWithAssets } from '@/services/api/models';
import LivestreamService from '@/services/domain/LivestreamService';
import { onMounted } from '@vue/runtime-core';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import { RestApi } from "@/services/RestApi";
import PaginationHelper from "@/helpers/PaginationHelper";
import CommonHelper from "@/helpers/CommonHelper";
import VueMultiselect from 'vue-multiselect'
import { useRoute, useRouter } from "vue-router";
import User from "@/models/User";
import NFTAsset from "@/models/NFTAsset";
import MarketplaceService from "@/services/domain/MarketplaceService";
import useEmitter from "@/helpers/useEmitter";
import ToastHelper from "@/helpers/ToastHelper";
import SaleService from "@/services/domain/SaleService";
import NumberHelper from "@/helpers/NumberHelper";
import LoadingHelper from "@/helpers/LoadingHelper";
import ErrorLogger from "@/helpers/ErrorLogger";
import MarketplaceAuctionCard from '@/components/marketplace/MarketplaceAuctionCard.vue';
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";

const store = useStore();
const { currentUser } = storeToRefs(store);
const router = useRouter();
const route = useRoute();
const emitter = useEmitter();

const latestAuctions = ref([] as MarketplaceResponseModel)

async function getAuctions() {
    latestAuctions.value = (await RestApi.Marketplace.getAuctions()).data;
}

onMounted(async () => {
    initializeTooltip();

    await getAuctions();
})

</script>

<style scoped>
.multiselect {
    min-width: 150px;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>