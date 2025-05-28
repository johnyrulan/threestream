<template>
<div class="h-screen flex-grow-1">
    <div class="bg-surface-secondary">
    <div class="d-xl-flex">
        <div class="min-w-0 flex-xl-fill">
            <!-- Navbar -->
            <header>
                <div class="container-fluid">
                    <div class="border-bottom py-6">
                        <div class="row align-items-center">
                            <div class="col-sm col-12">
                                <!-- Title -->
                                <h1 class="h2 ls-tight text-dark">
                                {{ nftAsset.name }}
                                </h1>
                            </div>
                            <!-- Actions -->
                            <div class="col-sm-auto col-12 mt-4 mt-sm-0">
                                <div class="hstack gap-2 justify-content-sm-end">
                                <router-link
                                    v-if="(saleWithAssets?.sale?.saleType === SaleType.DirectSale)"
                                    :to="{ name: 'Marketplace' }" class="btn btn-sm btn-neutral border-base"
                                    role="button">
                                        <span class="pe-2"><i class="bi bi-arrow-left"></i></span>
                                    <span>Back to Marketplace</span>
                                </router-link>
                                <router-link
                                    v-else
                                    :to="{ name: 'Auctions' }" class="btn btn-sm btn-neutral border-base"
                                    role="button">
                                        <span class="pe-2"><i class="bi bi-arrow-left"></i></span>
                                    <span>Back to Auctions</span>
                                </router-link>
                                <!-- <a href="#modalExport" class="btn btn-sm btn-neutral" data-bs-toggle="modal">
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
                                </button> -->
                                <button :disabled="disableBuyButton" @click.prevent="proceedToPayment" class="btn btn-sm btn-primary"
                                    v-if="(saleWithAssets?.sale?.saleType === SaleType.DirectSale)">
                                    <span class="pe-2">
                                    <i class="bi bi-lightning-charge-fill"></i>
                                    </span>
                                    <span>Buy for ${{ saleWithAssets?.sale?.floorPrice }}</span>
                                </button>
                                <button :disabled="disableBuyButton" @click.prevent="openBidModal" class="btn btn-sm btn-primary"
                                    v-if="(saleWithAssets?.sale?.saleType === SaleType.DirectAuction)">
                                    <span class="pe-2">
                                    <i class="bi bi-lightning-charge-fill"></i>
                                    </span>
                                    <span>Place a Bid</span>
                                </button>
                                <button :disabled="disableBuyButton" @click.prevent="makeOffer" class="btn btn-sm btn-primary"
                                    v-if="(saleWithAssets?.sale?.saleType === SaleType.DirectSale)">
                                    <span class="pe-2">
                                    <i class="bi bi-gift-fill"></i>
                                    </span>
                                    <span v-if="currentUserOffer.amount">Current Offer: ${{ NumberHelper.normalizeCurrencyFromAPI(currentUserOffer.amount) }}</span>
                                    <span v-else>Make an Offer</span>
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <!-- Main -->
            <main class="border-bottom py-6">
                <!-- Modal -->
                <div class="modal fade" id="modalExport" tabindex="-1" aria-labelledby="modalExport" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content shadow-3">
                        <div class="modal-header">
                            <div class="icon icon-shape rounded-3 bg-soft-primary text-primary text-lg me-4">
                            <i class="bi bi-globe"></i>
                            </div>
                            <div>
                            <h5 class="mb-1">Share to web</h5>
                            <small class="d-block text-xs text-muted">Publish and share link with anyone</small>
                            </div>
                            <div class="ms-auto">
                            <div class="form-check form-switch me-n2">
                                <input class="form-check-input" type="checkbox" id="switchShareToWeb" checked>
                                <label class="form-check-label" for="switchShareToWeb"></label>
                            </div>
                            </div>
                        </div>
                        <div class="modal-body">
                            <!-- Text -->
                            <div class="d-flex align-items-center mb-5">
                            <div>
                                <p class="text-sm">
                                Anyone with this link <span class="font-bold text-heading">can view</span>
                                </p>
                            </div>
                            <div class="ms-auto">
                                <a href="#" class="text-sm font-semibold">Settings</a>
                            </div>
                            </div>
                            <!-- Form group -->
                            <div>
                            <div class="input-group input-group-inline">
                                <input type="email" class="form-control" placeholder="username" value="https://clever.io/your-amazing-link">
                                <span class="input-group-text">
                                <i class="bi bi-clipboard"></i>
                                </span>
                            </div>
                            <span class="mt-2 valid-feedback">Looks good!</span>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="me-auto">
                            <a href="#" class="text-sm font-semibold"><i class="bi bi-clipboard me-2"></i>Copy link</a>
                            </div>
                            <button type="button" class="btn btn-sm btn-neutral" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-sm btn-success">Share file</button>
                        </div>
                        </div>
                    </div>
                </div>
                <!-- Container -->
                <div class="container-fluid px-xl-16 vstack gap-3">
                    <div class="w-full text-center rounded-2 py-2" style="background-color: black;" v-if="nftAsset">
                        <video id="asset" class="img-fluid rounded-2 asset-shadow mx-auto pointer-cursor bg-loading" style="max-height: 70vh;" autoplay playsinline loop muted alt="..." v-if="nftAsset.mainVideoUrl && nftAsset.mainVideoUrl.length > 0" :src="nftAsset.mainVideoUrl"
                        :style="{ backgroundImage: 'url(' + require('@/assets/loading.svg') + ')' }"
                        @load="CommonHelper.removeBg('asset')"/>
                        <img id="asset" v-else-if="nftAsset.mainImgUrl" class="img-fluid rounded-2 asset-shadow mx-auto pointer-cursor bg-loading"
                        style="max-height: 70vh;" alt="..." :src="nftAsset.mainImgUrl"
                        :style="{ backgroundImage: 'url(' + require('@/assets/loading.svg') + ')' }"
                        @load="CommonHelper.removeBg('asset')"/>
                    </div>
                </div>
            </main>
        </div>
        <div class="flex-xl-none w-xl-96 border-start-xl bg-surface-primary h-xl-screen position-sticky top-0 shadow-3" style="--x-h-xl: 4.5rem;">
        <aside class="p-8 h-full overflow-y-xl-auto">
            <div class="vstack gap-6">
                <div>
                    <div class="d-flex align-items-center mb-3">
                        <h5 class="me-auto text-dark">{{ nftAsset.name }}</h5>
                        <a @click.prevent="copyLink()" class="link-primary font-bold text-sm">
                            <i class="bi bi-clipboard-check me-2"></i>Copy link
                        </a>
                    </div>
                    <h6 class="text-muted mb-3" v-if="nftAsset.mintNumber">Mint {{ nftAsset.mintNumber }} of {{ nftAsset.totalSupply }}</h6>
                    <!-- Image -->
                    <!-- <h6 class="text-muted font-semibold mb-3">Seller</h6> -->
                    <div class="d-flex align-items-center my-5">
                        <div class="flex-none">
                            <img alt="..." class="avatar" :class="{ 'rounded-circle shadow-3-hover': nftAsset.blockChain !== Blockchain.Solana }" :src="ImageHelper.getBlockchainLogo(nftAsset.blockChain)">
                        </div>
                        <div class="flex-fill ms-3">
                            <span class="text-sm text-heading mb-0">
                                {{ nftAsset.blockChain }}
                            </span>
                        </div>
                        <div class="flex-none">
                            <span class="avatar rounded-circle border j-border-primary">
                                <UserAvatar :user="seller"/>
                            </span>
                        </div>
                        <div class="flex-fill ms-3">
                            <a :href="`/profile/${seller.id}`" class="text-sm text-heading mb-0">
                                {{ seller.name }}
                            </a>
                        </div>
                    </div>
                    <!-- Title -->
                    <!-- <h6 class="text-muted font-semibold mb-3">Description</h6> -->
                    <!-- Text -->
                    <!-- <p class="text-sm mb-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p> -->
                    <div v-if="doesRoyaltyApply" class="my-2">
                        <span class="badge badge-pill gradient-right start-indigo-500 end-red-500 w-full text-base py-3 shadow-2">
                            🎁 Redeemable
                        </span>
                    </div>
                    <div v-if="(saleWithAssets.sale?.saleType === SaleType.DirectAuction)" class="my-2">
                        <div class="mb-2">
                            <span v-if="winningBuyer.buyOrder"
                            id="winner-badge"
                            class="badge rounded-pill mb-5 text-sm px-4 py-3 d-block shadow-inset bg-purple-500 transition-colors"
                            data-hj-allow>
                                Current winning bid: ${{ winningBuyer.buyOrder?.amount }}
                            </span>
                            <span v-else
                                id="winner-badge"
                                class="badge rounded-pill mb-5 text-sm px-4 py-3 d-block shadow-inset bg-cyan-500 transition-colors"
                                data-hj-allow>
                                Starting price: ${{ saleWithAssets.sale.floorPrice }}
                            </span>
                        <span class="badge badge-pill gradient-right start-indigo-500 end-red-500 w-full text-base py-3 shadow-2">
                            <vue-countdown :time="remainingTime" v-slot="{ days, hours, minutes, seconds }">
                                <div class="timer-content">
                                    <div>
                                        <div>Auction Ending in</div>
                                        {{ days }} days {{ hours }} hours {{ minutes }} min {{ seconds }} seconds
                                    </div>
                                </div>
                            </vue-countdown>
                        </span>
                        </div>
                    </div>
                    <ul class="nav nav-tabs" id="nft-tab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" href="#"
                                data-bs-toggle="tab" data-bs-target="#nav-attributes"
                                role="tab" aria-controls="nav-attributes">
                                🔥 Attributes
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#"
                                data-bs-toggle="tab" data-bs-target="#nav-history"
                                role="tab" aria-controls="nav-history">
                                📜 History
                            </a>
                        </li>
                        <li class="nav-item" v-if="(saleWithAssets.sale?.saleType === SaleType.DirectSale)">
                            <a class="nav-link" href="#"
                                data-bs-toggle="tab" data-bs-target="#nav-offers"
                                role="tab" aria-controls="nav-offers">
                                💰 Offers
                            </a>
                        </li>
                        <!-- <li class="nav-item">
                            <a class="nav-link" href="#"
                                data-bs-toggle="tab" data-bs-target="#nav-tags"
                                role="tab" aria-controls="nav-tags">
                                🔖 Tags
                            </a>
                        </li> -->
                    </ul>
                </div>
                <div class="tab-content" id="nftTabContent">
                    <div class="tab-pane fade show active" id="nav-attributes" role="tabpanel" aria-labelledby="attributes-tab" tabindex="0">
                        <div class="d-flex gap-2 flex-wrap">
                            <span v-for="(attribute, key, index) in nftAsset.attributes" :key="index" class="j-bg-secondary pointer-cursor bg-opacity-50 bg-opacity-100-hover shadow-2 shadow-4-hover j-border-primary border-1 rounded px-3 py-1 font-semibold text-heading text-wrap text-break px-3 text-capitalize">
                                <span class="font-bold text-sm">{{ key }}</span> <div class="font-regular text-sm">{{ nftAsset.attributes[key] }}</div>
                            </span>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="nav-history" role="tabpanel" aria-labelledby="history-tab" tabindex="0">
                        <div class="list-group list-group-flush list-group-borderless">
                            <div class="list-group-item px-2 py-0" v-for="(history, index) in assetHistories" :key="index">
                                <div :class="{ 'border-start': index < assetHistories.length - 1 }" v-if="history.saleAmount > 0">
                                    <div class="d-flex ms-n2 pb-6">
                                        <div class="flex-none me-3">
                                            <div class="icon icon-shape text-sm w-4 h-4 rounded-circle" :class="{ 'bg-success': index % 2 === 0, 'bg-danger': index % 2 === 1 }"></div>
                                            </div>
                                            <div>
                                            <div class="h6 font-semibold lh-none text-heading d-inline-block mb-1">
                                                Sold for ${{ NumberHelper.normalizeCurrencyFromAPI(history.saleAmount) }} to {{ history.buyerName }}
                                            </div>
                                            <div>
                                                <small class="text-xs text-muted">
                                                {{ CommonHelper.formatDate(history.dateOfSale, 'MM/DD/YYYY') }}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="nav-offers" role="tabpanel" aria-labelledby="offers-tab" tabindex="0">
                        <div class="list-group list-group-flush list-group-borderless">
                            <div class="list-group-item px-2 py-0" v-for="(offer, index) in saleOffers" :key="index">
                                <div :class="{ 'border-start': index < saleOffers.length - 1 }" v-if="saleOffers.length > 0">
                                    <div class="d-flex ms-n2 pb-6">
                                        <div class="flex-none me-3">
                                            <div class="icon icon-shape text-sm w-4 h-4 rounded-circle" :class="{ 'bg-success': index % 2 === 0, 'bg-danger': index % 2 === 1 }"></div>
                                            </div>
                                            <div>
                                            <div class="h6 font-semibold lh-none text-heading d-inline-block mb-1" v-if="offer.offerType === OrderType.Offer">
                                                {{ offer.userName }} offered ${{ NumberHelper.normalizeCurrencyFromAPI(offer.amount) }}
                                            </div>
                                            <div class="h6 font-semibold lh-none text-heading d-inline-block mb-1" v-else-if="offer.offerType === OrderType.CounterOffer">
                                                {{ offer.userName }} got countered ${{ NumberHelper.normalizeCurrencyFromAPI(offer.amount) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="tab-pane fade" id="nav-offers" role="tabpanel" aria-labelledby="history-tab" tabindex="0">
                        <div class="list-group list-group-flush list-group-borderless">
                            <div class="list-group-item px-2 py-0" v-for="(offer, index) in assetCounterOffers" :key="index">
                                <div class="d-flex ms-n2 pb-6 justify-content-between">
                                    <div class="h6 font-semibold lh-none text-heading d-inline-block">
                                        <span class="badge badge-pill j-bg-secondary ms-auto h-fit-content">
                                            ${{ NumberHelper.normalizeCurrencyFromAPI(offer.buyOrder.amount) }}
                                        </span>
                                    </div>
                                      <button v-if="currentUser?.id === offer.buyOrder.userId"
                                        class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2"
                                        @click="acceptCounterOffer(offer.buyOrder.id)">Accept</button>
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <!-- <div class="tab-pane fade" id="nav-tags" role="tabpanel" aria-labelledby="tags-tab" tabindex="0">
                        <div class="d-flex gap-2 flex-wrap">
                            <a href="#" class="bg-white bg-opacity-20 bg-opacity-100-hover border rounded px-3 py-1 font-semibold text-heading text-xs">Project</a>
                            <a href="#" class="bg-white bg-opacity-20 bg-opacity-100-hover border rounded px-3 py-1 font-semibold text-heading text-xs">SpaceX</a>
                            <a href="#" class="bg-white bg-opacity-20 bg-opacity-100-hover border rounded px-3 py-1 font-semibold text-heading text-xs">Launch</a>
                            <a href="#" class="bg-white bg-opacity-20 bg-opacity-100-hover border rounded px-3 py-1 font-semibold text-heading text-xs">Falcon</a>
                            <a href="#" class="bg-white bg-opacity-20 bg-opacity-100-hover border rounded px-3 py-1 font-semibold text-heading text-xs">Multiplanetary</a>
                        </div>
                    </div> -->
                </div>
                <!-- Purchase -->
                <button :disabled="disableBuyButton" class="btn btn-primary" @click.prevent="proceedToPayment"
                    v-if="(saleWithAssets?.sale?.saleType === SaleType.DirectSale)">
                    <span class="pe-2">
                    <i class="bi bi-lightning-charge-fill"></i>
                    </span>
                    Buy for ${{ saleWithAssets?.sale?.floorPrice }}
                </button>
                <button :disabled="disableBuyButton" class="btn btn-primary" @click.prevent="makeOffer"
                v-if="(saleWithAssets?.sale?.saleType === SaleType.DirectSale)">
                    <span class="pe-2">
                    <i class="bi bi-gift-fill"></i>
                    </span>
                    <span v-if="currentUserOffer.amount">Current Offer: ${{ NumberHelper.normalizeCurrencyFromAPI(currentUserOffer.amount) }}</span>
                    <span v-else>Make an Offer</span>
                </button>
                <button v-if="currentUserOffer.amount > 0 && saleWithAssets?.sale?.saleType === SaleType.DirectSale" class="btn btn-warning" @click.prevent="cancelOffer">
                    <span class="pe-2">
                    <i class="bi bi-x-square-fill"></i>
                    </span>
                    <span>Cancel Offer</span>
                </button>
                <button :disabled="disableBuyButton" class="btn btn-primary" @click.prevent="openBidModal"
                    v-if="(saleWithAssets?.sale?.saleType === SaleType.DirectAuction)">
                    <span class="pe-2">
                    <i class="bi bi-lightning-charge-fill"></i>
                    </span>
                    Place a Bid
                </button>
            </div>
        </aside>
        </div>
    </div>
    </div>
</div>

<div class="modal fade" id="checkoutModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="checkoutModal" style="display: none" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <h2 class="pb-3">Checkout</h2>
                <h6 class="text-muted">You are about to purchase </h6>
                   <h3> <div class="cardname  pb-2">{{ nftAsset.name }}</div></h3>
                   <div class="d-flex mt-2">
                    <div>
                        <p class="text-muted">Sale price</p>
                        <p class="text-muted">Commission fee <span data-bs-toggle="tooltip" data-bs-placement="top" title="Free for limited time"><i class="bi bi-info-circle"></i></span></p>
                        <p class="text-muted" v-if="doesRoyaltyApply">Royalty <span data-bs-toggle="tooltip" data-bs-placement="top" title="This is a physically backed NFT"><i class="bi bi-info-circle"></i></span></p>
                        <p class="text-muted">Total price </p>
                    </div>
                    <div class="ms-auto">
                        <p class="text-dark">${{ saleWithAssets.sale?.floorPrice }}</p>
                        <p class="text-dark">$0</p>
                        <p class="text-dark" v-if="doesRoyaltyApply">10%</p>
                        <p class="text-dark"
                            v-if="!doesRoyaltyApply">
                            ${{ saleWithAssets.sale?.floorPrice }}
                        </p>
                        <p class="text-dark" v-else>${{ NumberHelper.calculateRoyalty(saleWithAssets.sale?.floorPrice).toFixed(2) }}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer py-1">
                <button  type="button" class="btn btn-sm btn-danger"
                    data-bs-dismiss="modal">
                    Cancel
                </button>
                <button type="button" class="btn btn-sm btn-success" @click.prevent="purchaseDirectSale">
                    Purchase
                </button>
            </div>
        </div>
    </div>
</div>

<StripeCardModal @card-saved="onCardSaved"/>

<div class="modal fade" id="listedForSaleModal" tabindex="-1" aria-labelledby="listedForSaleModal" style="display: none" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <h2>Your NFT has been listed for sale!</h2>
                <div>
                    <p class="mt-2 mb-3">
                        Your NFT has been listed for sale! Other JUNKIE users can now find it on the Marketplace homepage, or you can share this page’s URL with potential buyers elsewhere on the web.
                    </p>
                    <p class="mt-2 mb-3">
                        When your NFT has been purchased, we will email you with a recap of the sale.
                        At that point, the proceeds will be added to your <a href="https://app.junkieapp.xyz/account/billing" target="_blank">Payout Balance</a> in your JUNKIE account:
                    </p>
                    <div class="text-center">
                        <img src="@/assets/payout-balance.png" class="rounded"/>
                    </div>
                    <p class="mt-2 mb-3">
                        On August 12th, we will be enabling payouts and you will be able to withdraw your balance to a bank account!
                    </p>
                </div>
            </div>
            <div class="modal-footer d-block text-end">
                <button type="button" class="btn btn-sm btn-neutral" data-bs-dismiss="modal">
                    Got It!
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="MakeOfferModal" tabindex="-1" aria-labelledby="MakeOfferModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <h4 class="text-center mb-5">Make an Offer for <span class="text-muted">{{ nftAsset.name }}</span></h4>
                <input v-model="offerAmount" type="number" class="form-control" />
            </div>
            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-primary float-end" @click="createOffer">Submit</button>
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="placeBidModal" tabindex="-1" aria-labelledby="placeBidModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <h4 class="text-center mb-5 text-dark">Place a Bid</h4>
                <input v-model="bidAmount" type="number" class="form-control" />
            </div>
            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-primary float-end" @click="placeBid">Submit</button>
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import ErrorLogger from "@/helpers/ErrorLogger";
import ToastHelper from "@/helpers/ToastHelper";
import NFTAsset from "@/models/NFTAsset";
import { Blockchain, SaleWithAssets, SaleStatus, SaleAsset, AssetSalesHistoryResponse, BuyOrderOffer, OrderType, SaleType, RedemptionStatus, BuyOrder, SaleOfferResponseModel } from "@/services/api/models";
import BlockchainService from "@/services/BlockchainService";
import SaleService from "@/services/domain/SaleService";
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import ImageHelper from "@/helpers/ImageHelper";
import UserService from "@/services/domain/UserService";
import User from "@/models/User";
import WalletService from "@/services/WalletService";
import { initializeTooltip, toggleModal } from "@/hooks/BootstrapHooks";
import { RestApi } from "@/services/RestApi";
import StripeCardModal from "@/components/payment/StripeCardModal.vue";
import LoadingHelper from "@/helpers/LoadingHelper";
import StringHelper from "@/helpers/StringHelper";
import { watch } from "vue";
import NumberHelper from "@/helpers/NumberHelper";
import CommonHelper from "@/helpers/CommonHelper";
import { DateTime } from "luxon";
import UserAvatar from "@/components/social/UserAvatar.vue";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";

const route = useRoute();
const store = useStore();
const router = useRouter();

let offerAmount = ref(0);
let offerSaleId = ref('');
let offerAssetName = ref('');

const saleWithAssets = ref({} as SaleWithAssets);
const nftAsset = ref({} as NFTAsset);
const seller = ref({} as User);
const assetHistories = ref([] as AssetSalesHistoryResponse[]);
const sellerInitial = computed(() => seller?.value?.name?.charAt(0)?.toUpperCase());
const isPaymetMethodAvailable = ref(false);
const assetCounterOffers = ref([] as BuyOrderOffer[]);

const saleId = route.params.id as string;

const { currentUser } = storeToRefs(store);

const doesRoyaltyApply = ref(false)
const disableBuyButton = computed(() => saleWithAssets.value?.sale?.saleStatus === SaleStatus.Sold || !currentUser.value || currentUser.value?.id === seller.value?.id)

watch(currentUser, checkAvailablePaymentMethods);
watch(currentUser, getCurrentUserOffer);

const remainingTime = ref(0)

function calculateRemainingTime() {
    if (saleWithAssets.value.sale.saleType !== SaleType.DirectAuction) return;

    const utcNow = DateTime.now().toUTC();
    const endTime = DateTime.fromISO(saleWithAssets.value.sale?.endTime)
    const remainingDiff = endTime.diff(utcNow);
    remainingTime.value = remainingDiff.milliseconds;
}

async function getSaleWithAssets() {
    try {
        saleWithAssets.value = await SaleService.getById(saleId);

        if (saleWithAssets.value.sale.saleStatus === SaleStatus.Sold) {
            router.push({ name: 'Marketplace' })
            ToastHelper.warning('The NFT is not longer for sale')
            return;
        }

        calculateRemainingTime();

        doesRoyaltyApply.value = saleWithAssets.value.saleAssets[0].redemptionStatus === RedemptionStatus.Redeemable;
    } catch (err) {
        router.push({ name: 'Marketplace' })
        ToastHelper.error('There was an error fetching your NFTs. Please try again later.');
        await ErrorLogger.logApiError(err);
    }
}

async function getBlockchainAsset() {
    const saleAsset = saleWithAssets.value.saleAssets[0];
    nftAsset.value = await BlockchainService.getInstance(saleAsset.blockchain)
                        .getAssetById(saleAsset.contractAddress, saleAsset.tokenId);
}

async function getSeller() {
    try {
        seller.value = await UserService.getUserById(saleWithAssets.value.sale.sellerUserId) ?? new User();
    } catch (err) {
        await ErrorLogger.logApiError(err);
    }
}

async function proceedToPayment() {
    if (saleWithAssets.value.sale.saleStatus === SaleStatus.Sold) {
        ToastHelper.error('Sorry, this item has been sold');
        return;
    }

    if (!currentUser.value) {
      toggleModal('authModal', 'show');
      return;
    } else if (!isPaymetMethodAvailable.value) {
        toggleModal('addNewCardModal', 'show');
        return;
    } else {
        toggleModal('checkoutModal', 'show');
    }
}

async function purchaseDirectSale () {
     const loader = LoadingHelper.showLoader();
    try {
        const chargeId = await SaleService.purchaseDirectSale(saleId, nftAsset.value.name + ' Mint ' + nftAsset.value.mintNumber);

        if (chargeId) {
            toggleModal('checkoutModal', 'hide');
            ToastHelper.success('NFT successfully purchased.');
            router.push({name: 'NFTs'});
        }
        else
            ToastHelper.error('There was an error processing your payment. Please try again with another card (found under "Account Settings").');

    } catch (err) {
      ToastHelper.error('There was an error purchasing the NFT. Please try again.')
      await ErrorLogger.logApiError(err);
    }
    LoadingHelper.hideLoader(loader);
}

async function checkAvailablePaymentMethods() {
    if (!currentUser.value?.id) return;

    const loader = LoadingHelper.showLoader();

    isPaymetMethodAvailable.value = false;

    try {
      const customerCards = await RestApi.Payment.listCustomerCards(currentUser.value?.id);

      if (customerCards.data?.length > 0) {
          isPaymetMethodAvailable.value = true;
      }
    } catch (err) {
      ToastHelper.error('There was an error retrieving payments. Please try again.')
      await ErrorLogger.logApiError(err)
    }
    LoadingHelper.hideLoader(loader);
}

async function onCardSaved() {
  await checkAvailablePaymentMethods();
  if (saleWithAssets.value.sale.saleType === SaleType.DirectSale) await proceedToPayment();
  else if (saleWithAssets.value.sale.saleType === SaleType.DirectAuction) openBidModal();

  ToastHelper.success('Card was successfully added. Now you can purchase the NFT.')
}

async function copyLink () {
    await navigator.clipboard.writeText(window.location.href);
    ToastHelper.success('Link copied to clipboard.');
}

async function getAssetHistory() {
    try {
        const asset: SaleAsset = saleWithAssets.value.saleAssets[0];
        assetHistories.value = (await (RestApi.Asset.getAssetHistory(asset.blockchain, asset.contractAddress, asset.tokenId))).data;
    }
    catch (err) {
        await ErrorLogger.logApiError(err);
    }
}

async function getAssetCounterOffers() {
    try {
        const offers = await SaleService.getOffers(saleId);
        assetCounterOffers.value = offers.filter(offer => offer.buyOrder.orderType === OrderType.CounterOffer);
    }
    catch (err) {
        await ErrorLogger.logApiError(err);
    }
}

async function createOffer() {
    const loader = LoadingHelper.showLoader();

    try {
        await RestApi.Sales.saveOffer({
          amount: NumberHelper.normalizeCurrencyToSave(offerAmount.value),
          userId: currentUser.value.id,
          orderType: OrderType.Offer,
          saleType: SaleType.DirectSale,
          saleId: saleId
        }, nftAsset.value.name);

        ToastHelper.success('Offer submitted successfully!');
        toggleModal('MakeOfferModal', 'hide');
        await getCurrentUserOffer();
        await getSaleOffers();
    } catch(err) {
        ToastHelper.error('There is an error while making an offer!');
    }

    LoadingHelper.hideLoader(loader);
}

async function acceptCounterOffer(buyOrderId: string) {
    var loader = LoadingHelper.showLoader();

    try {
        const response = await SaleService.acceptCounterOffer(buyOrderId);

        if (response) {

            ToastHelper.success('Nft is sold!');
            router.push({ name: 'NFTs' });

        } else {
            ToastHelper.error('There is an error while accepting an counter-offer!');
        }
    }
    catch (err) {
        ToastHelper.error('There is an error while accepting an counter-offer!');
        await ErrorLogger.logApiError(err);
    }

    LoadingHelper.hideLoader(loader);
}

function openSellerModal() {
    if (currentUser.value?.id === seller.value?.id) toggleModal('listedForSaleModal', 'show');
}

function makeOffer() {
    if (!currentUser.value) {
        toggleModal('authModal', 'show');
    }
    else if (!isPaymetMethodAvailable.value) {
        toggleModal('addNewCardModal', 'show');
    } else {
        offerSaleId.value = saleId;
        offerAssetName.value = nftAsset.value.name;
        toggleModal('MakeOfferModal', 'show');
    }
}

const saleOffers = ref([] as SaleOfferResponseModel[]);

async function getSaleOffers() {
    try {
        saleOffers.value = (await RestApi.Sales.getOffersForSale(saleId)).data ?? []
    }
    catch (err) {
        ToastHelper.error('There was an error retrieving Sale Offers')
    }
}

const currentUserOffer = ref({} as BuyOrder);

async function getCurrentUserOffer() {
    if (!currentUser.value) return;

    try {
        const offer = (await RestApi.Sales.getCurrentUserOffer(saleId)).data;
        currentUserOffer.value = offer?.id ? offer : { amount: 0 } as BuyOrder;
        offerAmount.value = NumberHelper.normalizeCurrencyFromAPI(currentUserOffer.value.amount);
    } catch (err) {
    }
}

async function cancelOffer() {
    if (!currentUser.value || currentUserOffer.value.amount <= 0) return;

    try {
        await RestApi.Sales.cancelOffer(currentUserOffer.value.id)
        await getCurrentUserOffer();
        await getSaleOffers();
        ToastHelper.success('Offer has been cancelled')
    } catch (err) {
        ToastHelper.error('There was an error cancelling your offer')
    }
}

const bidAmount = ref(0);
const winningBuyer = ref({})

async function openBidModal() {
    if (saleWithAssets.value.sale.saleStatus === SaleStatus.Sold) {
        ToastHelper.error('Sorry, this item has been sold');
        return;
    }

    if (!currentUser.value) {
      toggleModal('authModal', 'show');
      return;
    } else if (!isPaymetMethodAvailable.value) {
        toggleModal('addNewCardModal', 'show');
        return;
    } else {
        toggleModal('placeBidModal', 'show');
    }
}

async function getWinningBuyOrder() {
  const buyOrder = await SaleService.getWinningBuyOrder(saleId)

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

async function placeBid() {
    if (!isPaymetMethodAvailable.value) {
    // await loadStripeCardElement();
    toggleModal('addNewCardModal', 'show')
    return
    }

    const loader = LoadingHelper.showLoader();

    try {

        const bid: BuyOrder = {
            amount: NumberHelper.normalizeCurrencyToSave(bidAmount.value),
            userId: currentUser.value.id,
            orderType: OrderType.Bid,
            saleType: SaleType.DirectAuction,
            saleId: saleId,
        };

        await SaleService.placeBuyOrder(bid);

        ToastHelper.success('Bid successfully placed')
        bidAmount.value = 0;
        getWinningBuyOrder();
        toggleModal('placeBidModal', 'hide');
    } catch(err) {
        const error = await ErrorLogger.logApiError(err)
        ToastHelper.error(error[0]);
    }

    LoadingHelper.hideLoader(loader)
}

onMounted(async () => {
    await getSaleWithAssets();
    await getBlockchainAsset();
    await getSeller();
    await checkAvailablePaymentMethods();
    await getAssetHistory();
    await getSaleOffers();
    await getCurrentUserOffer();
    await getWinningBuyOrder();
    openSellerModal();
    initializeTooltip();
})
</script>

<style scoped>
.btn-rounded {
    border-radius: 50%;
}
.cardname {
    color: #e64415;
    font-weight:300 ;
}

.asset-shadow {
    box-shadow: rgba(255,255,255, 0.56) 0px 22px 70px 4px;
}
</style>
