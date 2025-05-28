<template>
<div class="mx-6">
  <div class="container-fluid">
    <div class="row gx-24 mt-0 py-10">
      <div class="col-lg-6 mt-lg-0 mt-6 text-center">
        <!-- <a href="https://tally.so/r/3Nl4lO" target="_blank">
          <img class="rounded-3 w-full" src="https://junkiecdn.azureedge.net/static/bttf-promo.png" alt="">
        </a>         -->
      </div>      
      <div class="col-lg-12">
        
        <!-- <h1 class="text-primary jk-font-primary text-center">JUNKIE has officially closed!</h1>
        <h2 class="text-center">Thank you for everything!</h2>
        <p class="lead lh-relaxed mt-2 text-white jk-font-primary text-center mt-4">          
          It's been a wonderful journey! See you around soon!           
        </p>      
        <div class="font-bold text-primary text-center">- JUNKIE Team</div> -->
        <h2 class="font-bold">
          Three Stream is the #1 livestream platform for crypto projects! 
        </h2>
        <h3>
          Drop your collection, run actions, giveaways & mystery packs all build right with your blockchain project in mind!
        </h3>
        <div class="d-flex flex-wrap gap-3 mt-4">
          <span class="badge badge-md j-bg-secondary rounded-pill">⛓️ ON-CHAIN</span>
          <span class="badge badge-md j-bg-secondary rounded-pill">✔️ TOP BRANDS</span>
          <span class="badge badge-md j-bg-secondary rounded-pill">📃 CREDIT CARD CHECKOUT</span>
          <span class="badge badge-md j-bg-secondary rounded-pill">🔒 SECURE</span>
        </div>
        <div class="d-flex gap-3 flex-wrap mt-6">
          <button v-if="!currentUser" target="_blank" data-bs-toggle="modal" data-bs-target="#authModal" class="btn btn-lg btn-primary">Start Collecting <i class="bi bi-trophy-fill ms-1 font-lg"></i></button>
          <a href="https://tally.so/r/3Nl4lO" target="_blank" class="btn btn-primary font-bold">Apply to be a Live Seller <i class="bi bi-boxes ms-1 font-lg"></i></a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- <header v-if="upcomingLivestreams.length > 0">
  <div class="container-fluid">
    <div class="pt-6">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0">
          <h1 class="h2 ls-tight text-white">
            Featured Live Shows <i class="bi bi-lightning-fill text-warning"></i>
          </h1>
        </div>
      </div>
    </div>
  </div>
</header>
<main class="py-6" v-if="upcomingLivestreams.length > 0">
  <div class="container-fluid pb-6">
    <LivestreamWideCard :livestream="firstUpcomingLivestream" :disabled="false" />
  </div>
</main> -->

<header v-if="upcomingLivestreams.length > 0">
  <div class="container-fluid">
    <div class="pt-6">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0">
          <!-- Title -->
          <h1 class="h2 ls-tight text-white">
            Live Shows <i class="bi bi-arrow-right-square-fill text-success"></i>
          </h1>
        </div>
      </div>
    </div>
  </div>
</header>


<!-- Main -->
<main class="py-6" v-if="upcomingLivestreams.length > 0">
  <div class="d-flex flex-row flex-wrap pb-6 mx-6 gap-4">
      <LivestreamWideCard
        :livestream="stream"
        :disabled="false"
        class=""
        v-for="(stream, index) in upcomingLivestreams"
        :key="index"
      />
  </div>
</main>



</template>

<script setup lang="ts">
import { BidLeader, Livestream, MarketplaceFilterRequest, MarketplaceSale, NftLeader } from "@/services/api/models";
import LivestreamService from "@/services/domain/LivestreamService";
import { onMounted } from "@vue/runtime-core";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import CommonHelper from "@/helpers/CommonHelper";
import LivestreamWideCard from "@/components/livestream/LivestreamWideCard.vue";
import LoadingHelper from "@/helpers/LoadingHelper";
import * as dayjs from "dayjs";
import { RestApi } from "@/services/RestApi";
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import MarketplaceNFTCard from "@/components/marketplace/MarketplaceNFTCard.vue";
import MarketplaceService from "@/services/domain/MarketplaceService";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";

const router = useRouter()
const store = useStore()

const { currentUser } = storeToRefs(store);

const firstUpcomingLivestream = ref({} as Livestream)
const upcomingLivestreams = ref([] as Livestream[])
const pastLivestreams = ref([] as Livestream[])

async function getUpcomingLivestreams() {
  const loader = LoadingHelper.showLoader();

  const allLivestreams = (await (RestApi.Livestream.getCurrentLivestreams({ page: 1, pageSize: 100 }))).data;

  upcomingLivestreams.value = allLivestreams;

  LoadingHelper.hideLoader(loader)
}

const topCollectors = ref([] as NftLeader[])
const topBidders = ref([] as BidLeader[])

async function getLeaderboards() {
  topCollectors.value = (await RestApi.Marketplace.getNFTLeaderboard()).data;
  topBidders.value = (await RestApi.Marketplace.getBidsLeaderboard()).data;
}

const latestSales = ref([] as MarketplaceSale[]);

async function getSales() {
   const sales = await MarketplaceService.getSales({ page: 1 } as MarketplaceFilterRequest);
   latestSales.value = sales.marketplaceSales.slice(0, 9);
}

onMounted(async () => {
  await getUpcomingLivestreams();
  // await getSales();
  // await getLeaderboards();
})
</script>

<style scoped>

header, main {
    /* background-color: #FEF8F6 !important; */
    color: #fff !important;
}

/* h1, h2, h3, h4, h5, h6 {
  color: #fff !important;
} */
</style>
