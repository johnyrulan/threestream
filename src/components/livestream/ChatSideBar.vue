<template>
<!-- <div class="mt-1 tab-pane fade show active" id="nav-chat" role="tabpanel" aria-labelledby="nav-chat-tab"> -->
<div class="rounded-4 overflow-y-scroll px-2 ps-4 pt-3 mb-5 font-semibold" id="chatmaindiv">
        <div class="card shadow-none bg-transparent border-0" v-for="(message, index) in messages" :key="index" v-show="message.type === 'regular'">
            <div class="card-body py-0 my-2 p-0 " v-if="message.message">
                <div class="d-flex align-items-start">
                    <!-- <div style="margin-right: 1rem;">
                        <div class="position-relative d-flex mr-4">
                            <a href="#" class="avatar avatar-sm rounded-circle d-block">
                                <img class="img-fluid" width="50px" alt="..." src="https://images.unsplash.com/photo-1522307837370-cc113a36b784?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80">
                            </a>
                            <span class="position-absolute bottom-1 end-2 transform translate-x-1/2 translate-y-1/2 border-4 border-solid border-current w- h- bg-success rounded-circle"></span>
                        </div>
                    </div> -->
                    <div>
                        <div class="d-flex mb-1 flex-row align-items-center">
                            <h6 class="mb-0 j-text-secondary">{{message.user.name}}</h6>
                            <span v-if="props.isHost && message.user.id !== currentUser.id">
                                <button v-if="!bannedUsers.includes(message.user.id)" class="badge bg-gradient bg-danger ms-2" @click.prevent="banUser(message.user.id)">Ban</button>
                                <button v-else-if="bannedUsers.includes(message.user.id)" class="badge bg-gradient bg-primary ms-2" @click.prevent="unbanUser(message.user.id, message.user.name)">Unban</button>
                            </span>
                        </div>
                        <img :src="message.message" alt="" class="img-fluid rounded-2" v-if="ReactionsHelper.isReaction(message.message)" style="height: 120px;max-width: 100%;">
                        <div v-else-if="isRequestNFTMessage(message.message)" class="text-sm text-warning">
                            {{message.message}}
                        </div>
                        <div v-else-if="isShareLinkMessage(message.message)" class="text-sm text-light bg-purple-400 px-3 py-1 rounded-2">
                            <div>{{message.message}}</div>
                        </div>    
                        <div v-else-if="isFollowMessage(message.message)" class="text-sm text-white gradient-bottom-right start-green-500 end-blue-500 px-3 py-1 rounded-2">
                            <div>{{message.message}}</div>
                        </div>       
                        <div v-else-if="isAuctionWon(message.message)" class="text-sm text-white gradient-bottom-right start-pink-400 end-red-400 px-3 py-1 rounded-2">
                            <div>{{message.message}}</div>
                        </div>   
                        <div v-else-if="isGiveawayWon(message.message)" class="text-sm text-white gradient-bottom-right start-red-400 end-orange-400 px-3 py-1 rounded-2">
                            <div>{{message.message}}</div>
                        </div>                                                                                                                     
                        <div v-else class="text-sm text-white" >
                            {{message.message}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
<!--
    <div class="display-4 font-semibold text-muted vstack Xgap-4 py-3 overflow-y-scroll">

    </div> -->
</div>

<!-- <div>
    <div class="position-absolute message-input bottom-0 start-0 w-full bg-gray-200 px-4 py-6">
        <div class="input-group">
            <a @click="showEmojiPicker = !showEmojiPicker" class="d-flex align-items-center h2 mx-2">😃</a>
            <input :disabled="!currentUser.value" v-model="newMessage" type="text" class="form-control" aria-label="Text input with segmented dropdown button" v-on:keyup.enter="addMessage()" autocomplete="off">
            <button :disabled="!currentUser.value || isBanned" type="button" class="btn btn-info" @click.prevent="addMessage()">
                <i class="bi bi-send"></i>
            </button>
        </div>
    </div>
    <EmojiPicker id="popover-content" v-show="showEmojiPicker" :native="true"  @select="selectEmoji" class="popover-emoji"  />
</div> -->
<!-- </div> -->

<!-- <div class="tab-pane fade pt-3" id="nav-stats" role="tabpanel" aria-labelledby="nav-stats-tab">
<div class="d-grid gap-2">
    <button type="button" class="btn btn-primary" @click="getUsersWhoJoined">Users who have joined</button>
    <button type="button" class="btn btn-primary" @click="getUsersWithPlacedBids">Users with bids</button>
    <button type="button" class="btn btn-primary" @click="getUsersWhoHaveWonAuctions">Users who won auction</button>
</div>
</div> -->

<!-- <div class="modal fade" id="usersStatsModal" tabindex="-1" aria-labelledby="usersStatsModal" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <h2 class="text-center mb-5">All users</h2>
                <div class="border h-40 overflow-auto p-3 rounded-3">
                    <div v-for="(user, index) in statUsers" :key="index">{{ user }}</div>
                </div>
            </div>
            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div> -->

</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref } from 'vue'
import RealtimeService from '@/services/RealtimeService';
import { v4 as uuidv4 } from "uuid";
import useEmitter from '@/helpers/useEmitter';
import LivestreamService from '@/services/domain/LivestreamService';
import ToastHelper from '@/helpers/ToastHelper';
import { useRoute } from 'vue-router';
import eventBus from '@/events/EventBus'
import { Livestream } from "../../services/api/models";
import { toggleModal } from '@/hooks/BootstrapHooks';
import { RestApi } from '@/services/RestApi';
import ReactionsHelper from '@/helpers/ReactionsHelper';
import StringHelper from '@/helpers/StringHelper';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';

const props = defineProps({
    livestreamId: String,
    isHost: Boolean
});

const store = useStore();
const route = useRoute();

const livestreamId = route.params.id as string;
const inviteId = ref('')

const messages = ref(new Array<any>())
const newMessage = ref('')
let livestream = ref({} as Livestream)
let listenerId = uuidv4()
const emitter = useEmitter()
const statUsers = ref([] as string[]);
let isBanned = ref(false)
let bannedUsers = ref(new Array<any>())
let showEmojiPicker = ref(false);

const listener =  ref({} as any);

const { currentUser } = storeToRefs(store);

emitter.on('RequestAuction', async (value: { name: string, mintNumber: string, page: number }) => {
    let message = `Can you run ${value.name}`;

    if (value.mintNumber) message = message + ` mint #${value.mintNumber}`;

    message = message + ` on page #${value.page}?`;

    await addMessageDirect(message);
});

emitter.on('UserFollowed', async (value: { fromUser:string, toUser: string }) => {
    const message = `Started following 🔥`;
    await addMessageDirect(message);
})

emitter.on('LinkShared', async (value: { userName: string }) => {
    const message = `Shared the stream ⚡`;
    await addMessageDirect(message);
})

emitter.on('AuctionWon', async (value: { userName: string, productName: string }) => {
    if (StringHelper.isNullOrEmpty(value.productName) || value.productName.includes('undefined')) {
        value.productName = '';
    }

    const message = `${value.userName} has won ${value.productName} 👑`;
    await addMessageDirect(message);
})

emitter.on('GiveawayWon', async (value: { userName: string }) => {
    const message = `Giveaway winner: ${value.userName} 🎁`;
    await addMessageDirect(message);
})


emitter.on('ChatSent', async (value: { message: string }) => {
    await addMessageDirect(value.message)
})

function isRequestNFTMessage(message: string) {
    return message.toLowerCase().startsWith('can you run');
}

function isFollowMessage(message: string) {
    return message.toLowerCase().includes('started following');
}

function isShareLinkMessage(message: string) {
    return message.toLowerCase().includes('shared the stream');
}

function isAuctionWon(message: string) {
    return message.toLowerCase().includes('has won');
}

function isGiveawayWon(message: string) {
    return message.toLowerCase().includes('giveaway winner:');
}

async function getLivestream() {
    livestream.value = await LivestreamService.getLivestream(props.livestreamId ?? '') as Livestream;
}

emitter.on('BidPublished', async () => {
    // messages.value = await RealtimeService.getGroupConversation(livestream.value.id as string) ?? new Array<any>();
})

eventBus.on('memberBanned', () => {
    isBanned.value = true;
})

async function banUser (userId: string) {
    try {
        await LivestreamService.banUser(userId, route.params.id as string);
        await getBannedUsers();
    } catch (err) {
        ToastHelper.error('There was an error banning the user')
    }
}

async function unbanUser (userId: string, userName: string) {
    try {
        await LivestreamService.unbanUser(userId, route.params.id as string);
        await getBannedUsers();
    } catch (err) {
        ToastHelper.error('There was an error unbanning the user')
    }
}

async function timeoutUser (userId: string, userName: string) {
    await banUser(userId);

    setTimeout(async () => {
        await unbanUser(userId, userName);
    }, 300000);
}

function selectEmoji(emoji: any) {
    newMessage.value = newMessage.value + emoji.i;
    showEmojiPicker.value = false;
}

async function addMessageDirect(message: string) {
  if (!currentUser.value || isBanned.value) return;

  if (await RealtimeService.checkIfBanned(currentUser.value.id)) {
    ToastHelper.warning('Unable to send message. Please contact the host.')
    return;
  }

  await RealtimeService.sendMessage(message);  

  await scrollToBottom();

  if (message.includes('@')) {
    await RestApi.Notification.tagUserInLivestream(livestream.value.id, message)
  }  
}

async function addMessage() {
  if (!currentUser.value || isBanned.value) return;

  if (await RealtimeService.checkIfBanned(currentUser.value.id)) {
    ToastHelper.warning('Unable to send message. Please contact the host.')
    return;
  }

  await RealtimeService.sendMessage(newMessage.value);  
  newMessage.value = '';
  await scrollToBottom();
}

async function scrollToBottom () {
    await nextTick();
    var scrolltobottom = document.getElementById("chatmaindiv") ?? {} as any;
    scrolltobottom.scrollTop = scrolltobottom.scrollHeight;    
}

async function getGroupMessages() {
    try {
        messages.value = await RealtimeService.getGroupConversation() ?? [];        
        
        await scrollToBottom()
    } catch (err) {
        ToastHelper.error('There was an error retrieving chat messages')
    }
}

async function getUsersWhoJoined() {
    statUsers.value = [];

    const excludedNames = ['guest', 'system', (currentUser.value.name ?? '' as string).toLowerCase()];

    try {
        const groupUsers = await RealtimeService.getAllGroupMembers() ?? [];

        statUsers.value = groupUsers.map(o => o?.name);

        toggleModal('usersStatsModal', 'show')
    } catch (err) {
        ToastHelper.error('There was an error retrieving users')
    }
}

async function getUsersWithPlacedBids() {
    statUsers.value = [];

    try {
        const bidUsers = await LivestreamService.getUsersWithPlacedBids(livestream.value.id as string);
        statUsers.value = bidUsers.map(b => b.name);

        toggleModal('usersStatsModal', 'show')
    } catch (err) {
        console.log(err);
    }
}

async function getUsersWhoHaveWonAuctions() {
    statUsers.value = [];

    try {
        const auctionWonUsers = await LivestreamService.getUsersWhoWonAuctions(livestream.value.id as string);
        statUsers.value = auctionWonUsers.map(a => a.name);

        toggleModal('usersStatsModal', 'show')
    } catch (err) {
        console.log(err);
    }
}

async function getOnlineUsers() {
    statUsers.value = [];

    try {
        const groupUsers = await RealtimeService.getAllGroupMembers() ?? [];
        
        const onlineUsers = groupUsers.filter(x => x?.online);

        statUsers.value = onlineUsers.map(o => o?.name);

        toggleModal('usersStatsModal', 'show')
    } catch (err) {
        ToastHelper.error('There was an error retrieving users')
    }
}

async function getBannedUsers() {
    try {
        bannedUsers.value = (await RestApi.Livestream.getBannedUsers(livestream.value.id)).data ?? [];
        isBanned.value = bannedUsers.value.includes(currentUser.value.id);
    } catch (err) {
        ToastHelper.error('There was an error retrieving banned users')
    }
}
function registerListener () {
    listener.value = RealtimeService.channel.on('message.new', event => {
        if (event?.message?.kind !== 'Auction' && event?.message?.kind !== 'Bid') {            
            messages.value.push(event.message); 
            scrollToBottom();
        }     
    });

    // RealtimeService.permissionHandler(listenerId,
    //     (uid: string) => {
    //         alert('ban')
    //         if (uid === currentUser.value.id) isBanned.value = true;
    //     }, async (uid: string) => {
    //         alert('unban')
    //         if (uid === currentUser.value.id) isBanned.value = false;
    //         await getGroupMessages()
    // })
}

async function unRegisterListener () {
    listener.value.unsubscribe();
}

// async function copyUserlist() {
//     let users = new Array<string>();
//     allUsers.value.forEach(user => {
//         users.push(user.name);
//     });
//     await navigator.clipboard.writeText(users.toString());
//     ToastHelper.success('User list copied to clipboard!');
// }

async function sendIntroMessage() {
    if (props.isHost || StringHelper.isNullOrEmpty(currentUser.value?.name)) return;        

    // newMessage.value = currentUser.value.name + ' joined 👋';

    await addMessageDirect('Joined 👋');
}

eventBus.on('onRealtimeServiceConnected', async () => {
    if (route.params.id  !== props.livestreamId) return;

    registerListener();
    await getLivestream();
    await getGroupMessages();

    await sendIntroMessage()

    if (props.isHost) {
        await getBannedUsers();
    }
})

onUnmounted(async () => {    
    await RealtimeService.logout();
    await unRegisterListener();    
});

</script>

<style scoped>
#chatmaindiv {
    /* height: calc(100vh - 300px) !important; */
    /* height: 100% !important; */
    /* max-height: 72vh !important; */
}

@media only screen and (max-width: 1199px) {
    #chatmaindiv {
        /* height: 400px; */
        max-height: 25vh !important;
        /* margin-bottom: 100px; */
    }
}

.chat-block-calcheight{
    height: -webkit-calc(100% - 155px) !important;
    height: -moz-calc(100% - 155px) !important;
    height: calc(100% - 155px) !important;
    overflow-y: auto;
}

.cometchat__main__chat div:first-child {
    display: none !important;
}
:deep(.groups__sidebar) {
    /* display: none !important; */
}
:deep(.groups__main){
    width: 100%;
}
#chatmaindiv{
    scroll-behavior: smooth;
}
 .btn-ban{
    padding: 6px 7px;
    font-size: 14px;
    margin-left: 10px;
    background-color: #E62B2B;
    color: white
 }

 .btn-unban{
    padding: 6px 7px;
    font-size: 14px;
    margin-left: 10px;
    background-color: #495CE2;
    color: white
 }

 .btn-timeout{
    padding: 6px 7px;
    font-size: 14px;
    margin-left: 10px;
    background-color: #6AAA0F;
    color: white
 }

 .popover-emoji{
    position: absolute;
    bottom: 73px;
 }

@media (max-width: 1199px) {
    .chat-block-calcheight {
        height: 100% !important;
        max-height: 600px;
        overflow: hidden;
   }
}

.nav-link {
  color: #fff;
}
.nav-link.active {
  background-color: var(--accent-color);
  color: #000;
}

</style>
