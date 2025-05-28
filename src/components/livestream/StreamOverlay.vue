<template>
<div class="overlay d-flex flex-column" :class="{ 'bg-dark': showNFT }">
    <div class="vid-pills font-bold d-flex" :class="{ 'd-none': showNFT }">
        <img alt="..." class="avatar rounded-circle shadow-3-hover" src="https://pbs.twimg.com/profile_images/1566880131028754436/p4SXlPE__400x400.jpg">

        <div class="d-flex flex-column ms-2">
            <span class="name-pill">Oceanside Waffle</span>
            <div class="d-flex mt-1">
                <span class="badge rounded-pill bg-warning w-min text-xs">
                    <i class="bi bi-eye-fill me-1"></i> {{ totalMembers }}
                </span>
                <span class="ms-1 badge rounded-pill bg-success w-min">Follow</span>
            </div>
        </div>

    </div>
    <div v-if="isNFTActive"
        class="nft-space pointer-cursor position-absolute top-5 w-full text-end"
        :class="{ 'text-center': showNFT, 'end-5': !showNFT }" @click="toggleShowNFT">
        <video v-if="saleNftAsset.asset.mainVideoUrl" class="img-fluid rounded-2 m-h-20-vh border-3"
            :class="{ 'm-h-60-vh': showNFT }"
            style="border-color: #E64415; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
            autoplay playsinline loop muted alt="..." :src="saleNftAsset.asset.mainVideoUrl" />
        <img v-else class="img-fluid rounded-2 m-h-20-vh m-w-60-vw border-3"
        :class="{ 'm-h-60-vh': showNFT, 'm-w-80-vw': showNFT }"
        style="border-color: #E64415; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;"
        :src="saleNftAsset.asset.mainImgUrl" />
    </div>
    <div class="bottom mt-auto d-flex align-items-end pb-3 mx-1 mb-1">
        <div class="chat d-flex flex-fill flex-column">
            <div id="chat-div" v-if="chats.length > 0" class="chats mx-2 mb-2 ps-2 py-2 overflow-y-scroll border rounded border-jk-primary" style="max-height: 25vh;background-color: rgba(var(--x-dark-rgb), 0.2) !important;" :class="{ 'd-none': showNFT }">
                <div id="chat2-div" class="mt-1 d-flex overflow-y-scroll" v-for="(chat, index) in chats" :key="index">
                    <img alt="..." class="avatar avatar-sm w-7 h-7 rounded-circle shadow-3-hover me-2" src="https://pbs.twimg.com/profile_images/1499837987349307396/KxfmpD1e_400x400.jpg">
                    <div>
                        <div class="text-xs text-warning">{{ chat.name }}</div>
                        <img :src="chat.message" alt="" class="img-fluid rounded-2" v-if="chat.isReaction" style="height: 120px;max-width: 100%;">
                        <div class="text-sm text-break" :class="{ 'text-success': chat.isRequest }" v-else>{{ chat.message }}</div>
                    </div>
                </div>
            </div>
            <div v-if="isNFTActive"
                class="d-flex flex-column border rounded mx-2 mb-2 py-1 px-3 gap-2 border-jk-primary" style="background-color: #383467; max-width: 350px">
                <div class="d-flex">
                    <div class="d-flex flex-column">
                        <div class="font-bold">{{ saleNftAsset.asset.name }}</div>
                        <div>
                            <vue-countdown :time="auctionRemainingMilliseconds" v-slot="{ hours, minutes, seconds }">
                                <div class="timer-content">
                                    <div class="text-sm text-warning my-1">Remaining: {{ seconds }} seconds</div>
                                </div>
                            </vue-countdown>
                        </div>
                        <div class="text-sm text-success">
                            <img alt="..." class="avatar avatar-sm w-7 h-7 rounded-circle shadow-3-hover me-1" src="https://pbs.twimg.com/profile_images/1499837987349307396/KxfmpD1e_400x400.jpg">
                            <span v-if="winningBuyer.buyOrder">{{ winningBuyer.name }} is winning: ${{ winningBuyer.buyOrder.amount }}</span>
                            <span v-else>Starting Bid: ${{ saleNftAsset.sale.floorPrice }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="currentUser && isPaymetMethodAvailable">
                    <div class="d-flex mt-1 justify-content-between gap-2 flex-wrap" v-if="winningBuyer.buyOrder">
                        <button class="btn btn-success btn-sm rounded-pill btn-sucess"
                            @click="placeBid(winningBuyer.buyOrder.amount + 1)"
                        >Bid ${{ winningBuyer.buyOrder.amount + 1 }}</button>
                        <button class="btn btn-success btn-sm rounded-pill btn-sucess"
                            @click="placeBid(winningBuyer.buyOrder.amount + 1)"
                        >Bid ${{ winningBuyer.buyOrder.amount + 5 }}</button>
                        <button class="btn btn-success btn-sm rounded-pill btn-sucess"
                            @click="placeBid(winningBuyer.buyOrder.amount + 10)"
                        >Bid ${{ winningBuyer.buyOrder.amount + 10 }}</button>
                        <button class="btn btn-success btn-sm rounded-pill btn-sucess" @click="showCustomBox = !showCustomBox">Custom</button>
                    </div>
                    <div class="d-flex mt-1 justify-content-between gap-2 flex-wrap" v-else>
                        <button class="btn btn-success btn-sm rounded-pill btn-sucess"
                        @click="placeBid(saleNftAsset.sale.floorPrice + 1)"
                        >Bid ${{ saleNftAsset.sale.floorPrice + 1 }}</button>
                        <button class="btn btn-success btn-sm rounded-pill btn-sucess"
                        @click="placeBid(saleNftAsset.sale.floorPrice + 5)"
                        >Bid ${{ saleNftAsset.sale.floorPrice + 5 }}</button>
                        <button class="btn btn-success btn-sm rounded-pill btn-sucess"
                        @click="placeBid(saleNftAsset.sale.floorPrice + 10)"
                        >Bid ${{ saleNftAsset.sale.floorPrice + 10 }}</button>
                        <button class="btn btn-success btn-sm rounded-pill btn-sucess" @click="showCustomBox = !showCustomBox">Custom</button>
                    </div>
                    <div class="input-group mt-2" v-if="showCustomBox">
                        <span class="input-group-text">$</span>
                        <input v-model="customBidAmount" type="number" class="form-control form-control-sm" aria-label="Text input with segmented dropdown button" step="1" oninput="validity.valid||(value='');">
                        <button
                        @click="placeBid(customBidAmount)"
                        type="button" class="btn btn-success btn-sm">Bid</button>
                    </div>
                </div>
            </div>
            <div class="mb-3 px-2 text-center" v-if="currentUser && !isPaymetMethodAvailable">
                <button class="btn btn-sm j-bg-secondary w-full" @click="toggleModal('addNewCardModal', 'show')">
                    Add a Card to Start Bidding
                </button>
            </div>
            <div class="chat-message d-flex px-1" :class="{ 'd-none': showNFT }" v-if="currentUser">
                <input @keyup.enter="sendChat" v-model="chatMessage" type="text" class="form-control form-control-sm text-sm shadow-none rounded-pill border-jk-accent border-2 bg-dark text-white" placeholder="Type your message" aria-label="Your message" aria-describedby="button-addon2">
                <button @click="sendChat"
                    class="btn btn-sm j-bg-secondary rounded-pill ms-1" type="button" id="button-addon2"><i class="bi bi-send-fill"></i></button>
            </div>
            <div class="ms-2 px-2 text-center" v-else>
                <button class="btn btn-sm j-bg-secondary w-full" @click="toggleModal('authModal', 'show')">
                    Login or Sign Up
                </button>
            </div>
        </div>
        <div class="d-flex flex-column me-2 gap-2" :class="{ 'd-none': showNFT }">
            <Transition name="animation">
                <button @click="openReactionsModal"
                v-if="showOptions"
                class="btn btn-sm btn-primary rounded-pill ms-1 transition ease-in-out" type="button" id="button-addon2"><i class="bi bi-chat-heart"></i></button>
            </Transition>
            <Transition name="animation">
                <button @click="openSaleModal"
                v-if="showOptions"
                class="btn btn-primary btn-sm rounded-pill ms-1 transition ease-in-out" type="button" id="button-addon2"><i class="bi bi-shop"></i></button>
            </Transition>
            <Transition name="bounce">
                <a href="/"
                v-if="showOptions"
                class="btn btn-primary btn-sm rounded-pill ms-1 transition ease-in-out" role="button" id="button-addon2"><i class="bi bi-house-door-fill"></i></a>
            </Transition>
            <Transition name="bounce">
                <button @click="reload"
                v-if="showOptions"
                class="btn btn-primary btn-sm rounded-pill ms-1 transition ease-in-out" type="button" id="button-addon2"><i class="bi bi-arrow-clockwise"></i></button>
            </Transition>

            <button @click="toggleOptions"
            class="btn btn-primary btn-sm rounded-pill ms-1" type="button" id="button-addon2"><i class="bi bi-three-dots-vertical"></i></button>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="nftModal" tabindex="-1" aria-labelledby="nftModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen">
    <div class="modal-content bg-dark" style="border: 2px solid #E64415 !important;">
      <div class="modal-header border-0">
        <h1 class="modal-title fs-5 text-white" id="exampleModalLabel">🎁 All NFTs</h1>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body border-0">
        <div class="d-flex flex-wrap gap-6 justify-content-center">
            <div class="card w-2/5 bg-dark px-2 py-2" v-for="nft in nfts" :key="nft.contractAddress">
                <video v-if="nft.mainVideoUrl"
                    autoplay playsinline loop muted :src="nft.mainVideoUrl" class="rounded-2"></video>
                <img v-else :src="nft.mainImgUrl" alt="" class="img-fluid rounded-2">
                <div class="text-white mt-1">{{ nft.name }}</div>
                <div>
                    <button v-if="currentUser" class="badge rounded-pill bg-success" @click="requestNFT(nft)">Request</button>
                </div>
            </div>
        </div>
        <!-- <nav aria-label="Page navigation example" class="text-center mt-3">
            <ul class="pagination pagination-spaced gap-2 justify-content-center flex-wrap">
                <li class="page-item">
                <a class="page-link rounded-circle" href="#">
                    <i class="bi bi-chevron-left"></i>
                </a>
                </li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">1</a></li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">2</a></li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">3</a></li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">4</a></li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">5</a></li>
                <li class="page-item">
                <a class="page-link rounded-circle" href="#">
                    <i class="bi bi-chevron-right"></i>
                </a>
                </li>
            </ul>
        </nav> -->
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- Super Reactions -->
<div class="modal fade" id="reactionsModal" tabindex="-1" aria-labelledby="reactionsModal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen">
    <div class="modal-content bg-dark" style="border: 2px solid #E64415 !important;">
      <div class="modal-header border-0">
        <h1 class="modal-title fs-5 text-white" id="exampleModalLabel"><i class="bi bi-chat-heart"></i> Reactions</h1>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body border-0">
        <div class="input-group mb-3">
            <input v-model="reactionsSearchValue" type="text" class="form-control" placeholder="Search GIFs" aria-label="Search GIFs" aria-describedby="button-addon2" @keyup.enter="searchReactions">
            <button @click="searchReactions" class="btn btn-primary" type="button" id="button-addon2"><i class="bi bi-search-heart"></i></button>
        </div>
        <div class="text-white">
            Powered By <img class="" src="@/assets/GIPHY-logo.png"/>
        </div>
        <div class="d-flex flex-wrap gap-6 justify-content-center">
            <div class="card w-2/5 bg-dark px-2 py-2" v-for="(reaction, index) in reactions" :key="index">
                <img :src="reaction.images.preview_gif.url" alt="" class="img-fluid rounded-2">
                <div class="mt-2">
                    <button v-if="currentUser" class="badge rounded-pill bg-success" @click="sendReaction(reaction)">Send Reaction</button>
                </div>
            </div>
        </div>
        <!-- <nav aria-label="Page navigation example" class="text-center mt-3">
            <ul class="pagination pagination-spaced gap-2 justify-content-center flex-wrap">
                <li class="page-item">
                <a class="page-link rounded-circle" href="#">
                    <i class="bi bi-chevron-left"></i>
                </a>
                </li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">1</a></li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">2</a></li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">3</a></li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">4</a></li>
                <li class="page-item"><a class="page-link rounded-circle" href="#">5</a></li>
                <li class="page-item">
                <a class="page-link rounded-circle" href="#">
                    <i class="bi bi-chevron-right"></i>
                </a>
                </li>
            </ul>
        </nav> -->
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<StripeCardModal @card-saved="onCardSaved"/>
</template>

<script lang="ts" setup>
import eventBus from "@/events/EventBus";
import { toggleModal } from "@/hooks/BootstrapHooks";
import RealtimeService from "@/services/RealtimeService";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import ToastHelper from "@/helpers/ToastHelper";
import NFTAsset from "@/models/NFTAsset";
import BlockchainService from "@/services/BlockchainService";
import { BuyOrder, OrderType, Sale, SaleAsset, SaleAssetWithMetadata, SaleType, SaleWithAssets } from "@/services/api/models";
import SaleService from "@/services/domain/SaleService";
import LoadingHelper from "@/helpers/LoadingHelper";
import { DateTime } from "luxon";
import UserService from "@/services/domain/UserService";
import NumberHelper from "@/helpers/NumberHelper";
import ErrorLogger from "@/helpers/ErrorLogger";
import { RestApi } from "@/services/RestApi";
import StripeCardModal from "../payment/StripeCardModal.vue";
import ReactionsHelper from "@/helpers/ReactionsHelper";
import StringHelper from "@/helpers/StringHelper";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";

const store = useStore();
const route = useRoute();

const { currentUser } = storeToRefs(store);

const livestreamId = route.params.id as string;

const showOptions = ref(false);

function toggleOptions() {
    showOptions.value = !showOptions.value;
}

const isNFTActive = ref(false)
const showCustomBox = ref(false)

function scrollToBottom () {
    nextTick().then(() => {
        var scrolltobottom = document.getElementById("chat-div") ?? {} as any;
        scrolltobottom.scrollTop = scrolltobottom.scrollHeight;

        var scrolltobottom = document.getElementById("chat2-div") ?? {} as any;
        scrolltobottom.scrollTop = scrolltobottom.scrollHeight;
    })
}

const showNFT = ref(false)

function toggleShowNFT() {
    showNFT.value = !showNFT.value;
}

onMounted(async () => {
    if (!currentUser.value) toggleModal('authModal', 'show');
    await getCurrentAuction();
    await checkAvailablePaymentMethods();
    await getRoomStatistics();
})

// CHAT CODE

let listenerId = uuidv4()

function highlightText(text: string): boolean {
    return text.includes('?');
}

function convertCometChatMessageToMessage(message: any): ChatMessage {
    return {
        name: message.sender.name,
        message: message.data.text,
        isRequest: highlightText(message.data.text),
        isReaction: ReactionsHelper.isReaction(message.data.text)
    };
}

interface ChatMessage {
    name: string;
    message: string;
    isRequest: boolean;
    isReaction: boolean;
}

const chats = ref([] as ChatMessage[])
const chatMessage = ref('')

async function sendChat() {
    if (!currentUser.value) return;
    if (chatMessage.value.length === 0) return;

    chats.value.push({
        name: currentUser.value.name,
        message: chatMessage.value,
        isRequest: highlightText(chatMessage.value),
        isReaction: ReactionsHelper.isReaction(chatMessage.value)
    });

    try {
        await RealtimeService.sendMessage(livestreamId, chatMessage.value);
        // await RealtimeService.getGroupConversation(livestreamId) ?? new Array<any>();

        chatMessage.value = '';
    }
    catch (err) {
        ToastHelper.error('There was an error sending your message. Please try again')
    }

    await scrollToBottom();
}

async function requestNFT(nft: NFTAsset, page: number = 1) {
    chatMessage.value = `Can you run ${nft.name}`;

    if (nft.mintNumber) chatMessage.value = chatMessage.value + ` mint #${nft.mintNumber}`;

    chatMessage.value = chatMessage.value + ` on page #${page}?`;

    try {
        await sendChat();
        ToastHelper.success(nft.name + ' has been requested!')
    } catch (err) {
        ToastHelper.error('There was an error requesting ' + nft.name + '. Please try again later')
    }
}

function registerListener () {
    RealtimeService.addHandler(listenerId,
        async (response: any) => {
            if (response.getReceiverId() !== livestreamId) return;

            if (response.category === 'message') {
                chats.value.push(convertCometChatMessageToMessage(response));
                await scrollToBottom()
            }
            else if (response.category === 'custom') {
                if (!response.metadata) return;

                if (response.metadata.type === 'Auction') {
                    if (response.metadata.status === 'Started') {
                        await onAuctionStart(response.metadata);
                    } else if (response.metadata.status === 'Ended') {
                        await onAuctionEnd();
                    } else if (response.metadata.status === 'Canceled') {
                        await onAuctionEnd();
                    } else if (response.metadata.status === 'GivenAway') {
                        // await onNFTGivenAway(response.metadata.saleId);
                    }
                } else if (response.metadata.type === 'Bid') {
                    await onBidReceived(response.metadata);
                }
            }
        },
        () => {})
}

async function unRegisterListener () {
    await RealtimeService.removeHandler(listenerId);
    await RealtimeService.removeGroupHandler(listenerId);
}

async function getGroupMessages() {
    try {
        const messages = await RealtimeService.getGroupConversation(livestreamId as string) ?? [];

        const currentChats = [];

        for (let i = 0; i < messages.length; ++i) {
            const message: any = messages[i];

            if (message.category === 'message') {
                currentChats.push(convertCometChatMessageToMessage(message))
            }
        }

        chats.value = currentChats;

        await scrollToBottom()
    } catch (err) {
        ToastHelper.error('There was an error retrieving chat messages')
    }
}

async function sendIntroMessage() {
    if (StringHelper.isNullOrEmpty(currentUser.value?.name)) return;        

    chatMessage.value = currentUser.value.name + ' joined 👋';

    await sendChat();
}

// END CHAT CODE

eventBus.on('onRealtimeServiceConnected', async () => {
    if (route.params.id  !== livestreamId) return;

    registerListener();
    // await getLivestream();
    await getGroupMessages();

    await sendIntroMessage();

    // if (props.isHost) {
    //     await getBannedUsers();
    // }
})

onUnmounted(async () => {
    await unRegisterListener();
});


// SALES Code
async function onAuctionStart(metadata: any) {
    ToastHelper.success('Auction started')
    customBidAmount.value = 0;
    await setSaleNftAsset(metadata.saleId)
}

async function onAuctionEnd() {
    ToastHelper.success('Auction ended')
    customBidAmount.value = 0;
    isNFTActive.value = false;

    if (winningBuyer.value.name) {
      ToastHelper.success(winningBuyer.value.name + ' has won ' + saleNftAsset.value.asset.name);
    }

    isNFTActive.value = false;
}

async function onBidReceived() {
    await setSaleNftAsset(saleNftAsset.value.sale.id);
}

async function getCurrentAuction() {
    const sales = await SaleService.getByParentId(livestreamId);

    const utcNow = DateTime.now().toUTC();

    const liveSale = sales.filter(s => {
        const sale = s.sale as Sale;

        const endTime = DateTime.fromISO(sale.endTime)

        return utcNow < endTime;
    })

    if (liveSale[0]) {
        const saleId = liveSale[0].sale.id;
        await setSaleNftAsset(saleId)
    }
}

const customBidAmount = ref(0)

async function placeBid(directBidAmount: number = 0) {

    if (!isPaymetMethodAvailable.value) {
    // await loadStripeCardElement();
    toggleModal('addNewCardModal', 'show')
    return
    }

    const loader = LoadingHelper.showLoader();

    try {

        const bid: BuyOrder = {
        amount: NumberHelper.normalizeCurrencyToSave(directBidAmount),
        userId: currentUser.value.id,
        orderType: OrderType.Bid,
        saleType: SaleType.LiveAuction,
        saleId: saleNftAsset.value.sale.id,
        saleParentId: livestreamId
        };

        await SaleService.placeBuyOrder(bid);

        //emitter.emit('BidPublished');

        ToastHelper.success('Bid successfully placed')
        customBidAmount.value = 0;
        getWinningBuyOrder(bid.saleId);
    } catch(err) {
        const error = await ErrorLogger.logApiError(err)
        ToastHelper.error(error[0]);
    }

    LoadingHelper.hideLoader(loader)
}

// END Sales Code

// NFT SIDEBAR Code
const nfts = ref([] as NFTAsset[])

async function getAsset(saleAsset: SaleAsset) {
    try {
        return await BlockchainService.getInstance(saleAsset.blockchain)
            .getAssetById(saleAsset.contractAddress, saleAsset.tokenId);
    } catch(err) {

    }

    return null;
}

const auctionRemainingMilliseconds = ref(0)

function updateAuctionTime() {
  const utcNow = DateTime.now().toUTC();
  const endTime = DateTime.fromISO(saleNftAsset.value.sale.endTime)
  const remainingDiff = endTime.diff(utcNow);
  auctionRemainingMilliseconds.value = remainingDiff.milliseconds;
}

interface WinningBuyer {
  buyOrder: BuyOrder,
  name: string
}

const winningBuyer = ref({} as WinningBuyer)

async function getWinningBuyOrder(saleId: string) {
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

interface SaleWithNFTAsset {
    sale: Sale,
    asset: NFTAsset
}

const saleNftAsset = ref({} as SaleWithNFTAsset)

async function setSaleNftAsset(saleId: string) {
  const saleWithAssets: SaleWithAssets = await SaleService.getById(saleId);
  const saleAsset = saleWithAssets.saleAssets[0];
  const nftAsset = await getAsset(saleAsset);

  saleNftAsset.value = { sale: saleWithAssets.sale, asset: nftAsset }

  updateAuctionTime();
  await getWinningBuyOrder(saleId)
  isNFTActive.value = true;
}

async function openSaleModal() {
    const loader = LoadingHelper.showLoader()

    toggleModal('nftModal', 'show')

    try {
        const sales = await SaleService.getByParentId(livestreamId);

        const blockchainAssets = [];

        for (let i = 0; i < sales.length; ++i) {
            const blockchainAsset = await getAsset(sales[i].saleAssets[0]);
            if (blockchainAsset) blockchainAssets.push(blockchainAsset)
        }

        nfts.value = blockchainAssets;
    } catch (err) {
        ToastHelper.error('There was an error showing All NFTs')
    }

    LoadingHelper.hideLoader(loader)
}

const isPaymetMethodAvailable = ref(false)

async function onCardSaved() {
  await checkAvailablePaymentMethods();
  ToastHelper.success('Card was successfully added. Now you can start bidding!')
}

async function checkAvailablePaymentMethods() {
    
    isPaymetMethodAvailable.value = false;

    if (!currentUser.value) return;
    
    const loader = LoadingHelper.showLoader();

    try {
      const customerCards = await RestApi.Payment.listCustomerCards(currentUser.value?.id);

      if (customerCards.data?.length > 0) {
          isPaymetMethodAvailable.value = true;
      }
    } catch (err) {
      ToastHelper.error('There was an error retrieving payments. Please try again')
      await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}

// End NFT SIDEBAR Code

// Reactions

const reactions = ref([] as IGif[]);
const reactionsSearchValue = ref('');

async function openReactionsModal() {
    const loader = LoadingHelper.showLoader();

    try {
        const gifs = await GiphyService.getTrendingGIFs(0);
        reactions.value = gifs.data;        
    } catch (err) {
        ToastHelper.error('There was an error loading reactions. Please try again.')
    }

    LoadingHelper.hideLoader(loader);

    toggleModal('reactionsModal', 'show');
}

async function searchReactions() {
    const loader = LoadingHelper.showLoader();

    try {
        const gifs = await GiphyService.searchGIFs(reactionsSearchValue.value, 0);
        reactions.value = gifs.data;
    } catch (err) {
        ToastHelper.error('There was an error loading reactions. Please try again.')
    }

    LoadingHelper.hideLoader(loader)
}

async function sendReaction(reaction: IGif) {
    chatMessage.value = reaction.images.original.url;

    try {
        await sendChat();
        ToastHelper.success('You sent a reaction!')

        toggleModal('reactionsModal', 'hide')
    } catch (err) {
        ToastHelper.error('There was an error sending the reaction')
    }
}

// End Reactions

const totalMembers = ref(0)

async function getRoomStatistics() {
    totalMembers.value = (await RestApi.Room.getRoomStatistics(livestreamId))?.data.userCount;

    setInterval(async () => {
        totalMembers.value = (await RestApi.Room.getRoomStatistics(livestreamId))?.data.userCount;
    }, 30000);
}

function overlayHooks() {
    showNFT.value = false;
    showOptions.value = false
}

function goHome() {

}

function reload() {
    location.reload();
}

</script>

<style scoped>
/* .vid-pills{
    position: relative;
    top: 40px;
    left: 20px;
    color: #fff;
    text-transform: capitalize;
} */

@media only screen and (min-width: 768px) {

    .overlay {
        position: absolute;
        bottom: 0px;
        color: #fff;
        
        /* background: #00000075; */
        width: 100%;
        height: 100vh;
        max-width: 900px;        
        /* border-radius: 13px; */
    }
    .vid-pills{
        margin-top: 40px;
        margin-left: 20px;
        color: #fff;
        text-transform: capitalize;
    }
}

@media only screen and (max-width: 767px) {
    .overlay {
        position: absolute;
        bottom: 0px;
        color: #fff;
        right: 0px;
        /* background: #00000075; */
        width: 100%;
        height: 100%;
        /* border-radius: 13px; */
    }
    .vid-pills{
        margin-top: 40px;
        margin-left: 20px;
        color: #fff;
        text-transform: capitalize;
    }
}
</style>