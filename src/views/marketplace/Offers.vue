<template>
    <header>
        <div class="container-fluid">
            <div class="border-bottom">
                <div class="row align-items-center mt-5">
                    <div class="col-sm-6 col-12">
                        <h1 class="h2 ls-tight">Your Offers</h1>
                    </div>
                </div>
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="offers-received-tab" data-bs-toggle="tab" data-bs-target="#offers-received" type="button" role="tab" aria-controls="offers-received" aria-selected="false"><i class="bi bi-arrow-down-square-fill"></i> Offers Received ({{ offersReceived.length }})</button>
                    </li>                       
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="offers-sent-tab" data-bs-toggle="tab" data-bs-target="#offers-sent" type="button" role="tab" aria-controls="sent" aria-selected="true"><i class="bi bi-send-plus-fill"></i> Offers Sent ({{ offersSent.length }})</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="counter-offers-received-tab" data-bs-toggle="tab" data-bs-target="#counter-offers-received" type="button" role="tab" aria-controls="counter-offers-received" aria-selected="false"><i class="bi bi-arrow-down-square-fill"></i> Counter-Offers Received ({{ counterOffersReceived.length }})</button>
                    </li>                        
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="counter-offers-sent-tab" data-bs-toggle="tab" data-bs-target="#counter-offers-sent" type="button" role="tab" aria-controls="counter-offers-sent" aria-selected="true"><i class="bi bi-send-plus-fill"></i> Counter-Offers Sent ({{ counterOffersSent.length }})</button>
                    </li>                             
                </ul>
                <div class="tab-content mt-3" id="myTabContent">
                    <div class="tab-pane fade show active" id="offers-received" role="tabpanel" aria-labelledby="offers-received-tab">
                        <div class="table-responsive shadow-2 rounded-2">
                            <table class="table table-hover table-nowrap table-striped table-hover">
                                <thead class="table-dark">
                                    <tr class="text-white">
                                        <th scope="col">NFT Name</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Listing Price</th>
                                        <th scope="col">Offer</th>
                                        <th scope="col">Blockchain</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="offer in offersReceived" :key="offer.buyOrderId">
                                        <td>
                                            <!-- <img alt="..." src="https://images.unsplash.com/photo-1610271340738-726e199f0258?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80" class="avatar avatar-sm rounded-circle me-2"> -->
                                            <a class="text-heading font-semibold" href="#">
                                                {{ offer.saleAsset.data.name }}
                                            </a>
                                        </td>
                                        <td>
                                            {{ CommonHelper.formatDate(offer.createdAt, 'MMM DD, YYYY') }}
                                        </td>
                                        <td>
                                            ${{ NumberHelper.normalizeCurrencyFromAPI(offer.listingPrice) }}
                                        </td>
                                        <td>
                                            ${{ NumberHelper.normalizeCurrencyFromAPI(offer.offerPrice) }}
                                        </td>
                                        <td>
                                            <img alt="..." :src="ImageHelper.getBlockchainLogo(offer.saleAsset.blockchain)" class="avatar avatar-xs rounded-circle me-2">
                                            <!-- Link -->
                                            <a class="text-current" href="#">{{ offer.saleAsset.blockchain }}</a>
                                        </td>
                                        <td class="text-end">                                            
                                            <button type="button" class="btn btn-sm btn-success me-2" @click="acceptOffer(offer)">
                                                <i class="bi bi-arrow-down-square-fill"></i> Accept
                                            </button>
                                            <button type="button" class="btn btn-sm btn-primary me-2" @click="openCounterOfferModal(offer)">
                                                <i class="bi bi-send-plus-fill"></i> 
                                                <span v-if="offer.counterOfferPrice > 0" > Countered with ${{ NumberHelper.normalizeCurrencyFromAPI(offer.counterOfferPrice) }}</span>
                                                <span v-else> Counter-Offer</span>
                                            </button>
                                            <router-link :to="{ name: 'MarketplaceSale', params: { id: offer.saleId } }" class="btn btn-sm btn-neutral">View Sale</router-link>
                                        </td>
                                    </tr>                                   
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="offers-sent" role="tabpanel" aria-labelledby="offers-sent-tab">
                        <div class="table-responsive shadow-2 rounded-2">
                            <table class="table table-hover table-nowrap table-striped table-hover">
                                <thead class="table-dark">
                                    <tr class="text-white">
                                        <th scope="col">NFT Name</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Listing Price</th>
                                        <th scope="col">Offer</th>
                                        <th scope="col">Blockchain</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="offer in offersSent" :key="offer.buyOrderId">
                                        <td>
                                            <!-- <img alt="..." src="https://images.unsplash.com/photo-1610271340738-726e199f0258?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80" class="avatar avatar-sm rounded-circle me-2"> -->
                                            <a class="text-heading font-semibold" href="#">
                                                {{ offer.saleAsset.data.name }}
                                            </a>
                                        </td>
                                        <td>
                                            {{ CommonHelper.formatDate(offer.createdAt, 'MMM DD, YYYY') }}
                                        </td>
                                        <td>
                                            ${{ NumberHelper.normalizeCurrencyFromAPI(offer.listingPrice) }}
                                        </td>
                                        <td>
                                            ${{ NumberHelper.normalizeCurrencyFromAPI(offer.offerPrice) }}
                                        </td>
                                        <td>
                                            <img alt="..." :src="ImageHelper.getBlockchainLogo(offer.saleAsset.blockchain)" class="avatar avatar-xs rounded-circle me-2">
                                            <!-- Link -->
                                            <a class="text-current" href="#">{{ offer.saleAsset.blockchain }}</a>
                                        </td>
                                        <td class="text-end">                                           
                                            <router-link :to="{ name: 'MarketplaceSale', params: { id: offer.saleId } }" class="btn btn-sm btn-neutral me-2">View Sale</router-link>                                            
                                            <button type="button" class="btn btn-sm btn-danger" @click="cancelOffer(offer.buyOrderId)">
                                                <i class="bi bi-trash"></i> Cancel
                                            </button>
                                        </td>
                                    </tr>                                   
                                </tbody>
                            </table>
                        </div>
                    </div>                    
                    <div class="tab-pane fade" id="counter-offers-received" role="tabpanel" aria-labelledby="counter-offers-received-tab">
                        <div class="table-responsive shadow-2 rounded-2">
                            <table class="table table-hover table-nowrap table-striped table-hover">
                                <thead class="table-dark">
                                    <tr class="text-white">
                                        <th scope="col">NFT Name</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Listing Price</th>
                                        <th scope="col">Offer</th>
                                        <th scope="col">Blockchain</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="offer in counterOffersReceived" :key="offer.buyOrderId">
                                        <td>
                                            <!-- <img alt="..." src="https://images.unsplash.com/photo-1610271340738-726e199f0258?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80" class="avatar avatar-sm rounded-circle me-2"> -->
                                            <a class="text-heading font-semibold" href="#">
                                                {{ offer.saleAsset.data.name }}
                                            </a>
                                        </td>
                                        <td>
                                            {{ CommonHelper.formatDate(offer.createdAt, 'MMM DD, YYYY') }}
                                        </td>
                                        <td>
                                            ${{ NumberHelper.normalizeCurrencyFromAPI(offer.listingPrice) }}
                                        </td>
                                        <td>
                                            ${{ NumberHelper.normalizeCurrencyFromAPI(offer.offerPrice) }}
                                        </td>
                                        <td>
                                            <img alt="..." :src="ImageHelper.getBlockchainLogo(offer.saleAsset.blockchain)" class="avatar avatar-xs rounded-circle me-2">
                                            <!-- Link -->
                                            <a class="text-current" href="#">{{ offer.saleAsset.blockchain }}</a>
                                        </td>
                                        <td class="text-end">
                                            <button type="button" class="btn btn-sm btn-success me-2" @click="acceptOffer(offer)">
                                                <i class="bi bi-arrow-down-square-fill"></i> Accept
                                            </button>
                                            <router-link :to="{ name: 'MarketplaceSale', params: { id: offer.saleId } }" class="btn btn-sm btn-neutral me-2">View Sale</router-link>
                                        </td>
                                    </tr>                                   
                                </tbody>
                            </table>
                        </div>
                    </div>                    
                    <div class="tab-pane fade" id="counter-offers-sent" role="tabpanel" aria-labelledby="counter-offers-sent-tab">
                        <div class="table-responsive shadow-2 rounded-2">
                            <table class="table table-hover table-nowrap table-striped table-hover">
                                <thead class="table-dark">
                                    <tr class="text-white">
                                        <th scope="col">NFT Name</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Listing Price</th>
                                        <th scope="col">Offer</th>
                                        <th scope="col">Blockchain</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="offer in counterOffersSent" :key="offer.buyOrderId">
                                        <td>
                                            <!-- <img alt="..." src="https://images.unsplash.com/photo-1610271340738-726e199f0258?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80" class="avatar avatar-sm rounded-circle me-2"> -->
                                            <a class="text-heading font-semibold" href="#">
                                                {{ offer.saleAsset.data.name }}
                                            </a>
                                        </td>
                                        <td>
                                            {{ CommonHelper.formatDate(offer.createdAt, 'MMM DD, YYYY') }}
                                        </td>
                                        <td>
                                            ${{ NumberHelper.normalizeCurrencyFromAPI(offer.listingPrice) }}
                                        </td>
                                        <td>
                                            ${{ NumberHelper.normalizeCurrencyFromAPI(offer.offerPrice) }}
                                        </td>
                                        <td>
                                            <img alt="..." :src="ImageHelper.getBlockchainLogo(offer.saleAsset.blockchain)" class="avatar avatar-xs rounded-circle me-2">
                                            <!-- Link -->
                                            <a class="text-current" href="#">{{ offer.saleAsset.blockchain }}</a>
                                        </td>
                                        <td class="text-end">
                                            <router-link :to="{ name: 'MarketplaceSale', params: { id: offer.saleId } }" class="btn btn-sm btn-neutral me-2">View Sale</router-link>                                            
                                            <button type="button" class="btn btn-sm btn-danger" @click="cancelOffer(offer.buyOrderId)">
                                                <i class="bi bi-trash"></i> Cancel
                                            </button>
                                        </td>
                                    </tr>                                   
                                </tbody>
                            </table>
                        </div>
                    </div>                                        
                </div>
            </div>
        </div>
    </header>

    <div class="modal fade" id="MakeOfferModal" tabindex="-1" aria-labelledby="MakeOfferModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-3">
                <div class="modal-body">
                    <h4 class="text-center mb-5">Update Offer for <span class="text-muted">{{ currentCounterOffer.saleAsset?.data?.name }}</span></h4>                    
                    <input v-model="counterOfferUpdateAmount" type="number" class="form-control" />
                </div>
                <div class="modal-footer d-block">
                    <button type="button" class="btn btn-sm btn-primary float-end" @click="createCounterOffer()">Submit</button>
                    <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ErrorLogger from "@/helpers/ErrorLogger";
import LoadingHelper from "@/helpers/LoadingHelper";
import NumberHelper from "@/helpers/NumberHelper";
import ToastHelper from "@/helpers/ToastHelper";
import { toggleModal } from "@/hooks/BootstrapHooks";
import { BuyOrder, OrderType, SaleAsset, SaleType, UserOfferResponse } from "@/services/api/models";
import BlockchainService from "@/services/BlockchainService";
import SaleService from "@/services/domain/SaleService";
import { RestApi } from "@/services/RestApi";
import { onMounted, ref } from "@vue/runtime-core";
import { computed } from "vue";
import NFTAsset from '@/models/NFTAsset';
import ImageHelper from "@/helpers/ImageHelper";
import CommonHelper from "@/helpers/CommonHelper";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";

const offersSent = ref([] as UserOfferResponse[])
const offersReceived = ref([] as UserOfferResponse[])
const counterOffersSent = ref([] as UserOfferResponse[])
const counterOffersReceived = ref([] as UserOfferResponse[])

const currentCounterOffer = ref({} as UserOfferResponse);
const counterOfferUpdateAmount = ref(0);

const store = useStore();
const { currentUser } = storeToRefs(store);

function openCounterOfferModal(offer: UserOfferResponse) {
    currentCounterOffer.value = offer;
    counterOfferUpdateAmount.value =  NumberHelper.normalizeCurrencyFromAPI(offer.counterOfferPrice);    
    toggleModal('MakeOfferModal', 'show');
}

function parseNFTAsset(offers: UserOfferResponse[]) {
    for (const offer of offers) {
        const nftData = JSON.parse(offer.saleAsset.data);
        offer.saleAsset.data = NFTAsset.generateNFTAsset(nftData, offer.saleAsset.blockchain);    
    }

    return offers;
}

async function getOffers() {
    var loader = LoadingHelper.showLoader();

    try {
        const offersSentResponse = (await RestApi.Sales.getOffersForUser(OrderType.Offer, true)).data;
        const offersReceivedResponse = (await RestApi.Sales.getOffersForUser(OrderType.Offer, false)).data;
        const counterOffersSentResponse = (await RestApi.Sales.getOffersForUser(OrderType.CounterOffer, true)).data;
        const counterOffersReceivedResponse = (await RestApi.Sales.getOffersForUser(OrderType.CounterOffer, false)).data;

        offersSent.value = parseNFTAsset(offersSentResponse);
        offersReceived.value = parseNFTAsset(offersReceivedResponse);
        counterOffersSent.value = parseNFTAsset(counterOffersSentResponse);
        counterOffersReceived.value = parseNFTAsset(counterOffersReceivedResponse);
    } catch (err) {     
        ToastHelper.error('There is an error while fetching your offers!');
    }

    LoadingHelper.hideLoader(loader);
}

async function acceptOffer(offer: UserOfferResponse) {
    var loader = LoadingHelper.showLoader();
    
    try {
        const response = await SaleService.acceptOffer(offer.buyOrderId, offer.saleAsset.data?.name);
        
        if (response) {
            ToastHelper.success('The offer has been accepted!');
            await getOffers();
        } else {
            ToastHelper.error('There is an error processing the card transaction. This offer cannot be currently accepted unless the card can be processed.');
        }
    }
    catch (err) {
        ToastHelper.error('There is an error processing the card transaction. This offer cannot be currently accepted unless the card can be processed.');
        await ErrorLogger.logApiError(err);
    }

    LoadingHelper.hideLoader(loader);
}

async function createCounterOffer() {
    const loader = LoadingHelper.showLoader();
    
    try {

        await SaleService.saveOffer({
            amount: NumberHelper.normalizeCurrencyToSave(counterOfferUpdateAmount.value),
            userId: currentCounterOffer.value.userId,
            orderType: OrderType.CounterOffer,
            saleType: SaleType.DirectSale,
            saleId: currentCounterOffer.value.saleId
        }, currentCounterOffer.value.saleAsset?.data?.name);    
   
        toggleModal('MakeOfferModal', 'hide');
        ToastHelper.success('Counter-Offer submitted successfully!');

        await getOffers();

    } catch(err) {
        ToastHelper.error('There is an error while making an counter-offer!');
    }

    LoadingHelper.hideLoader(loader);
}

async function cancelOffer(buyOrderId: string) {
    var loader = LoadingHelper.showLoader();
    
    try {
        const response = await SaleService.cancelOffer(buyOrderId);
        
        if (response) {

            ToastHelper.success('Offer is cancelled!');
            await getOffers();

        } else {
            ToastHelper.error('There is an error while cancelling an offer!');
        }
    }
    catch (err) {
        ToastHelper.error('There is an error while cancelling an offer!');
        await ErrorLogger.logApiError(err);
    }

    LoadingHelper.hideLoader(loader);
}

onMounted(async () => {
    await getOffers();
});

</script>

<style scoped>
table th {
    color: white !important;
    background-color: var(--primary-color) !important;    
}
</style>