<template>
<!-- <h4 class="text-black">Johny, Waffle</h4> -->
<div class="d-flex flex-column gap-1 overflow-y-scroll h-60-vh px-2" id="chatmaindiv">


    <div class="d-flex flex-column mb-1 flex-row mt-1 w-1/2" v-for="message in messages" 
        :class="[{'align-self-end': message.user.id === currentUser.id}, {'align-self-start': message.user.id !== currentUser.id}]" >
        <h6 class="mb-0 text-xs text-black" :class="{'text-end': message.user.id === currentUser.id}">{{ message.user.name }}</h6>

        <div class="text-sm mt-1" :class="[{'text-end': message.user.id === currentUser.id}, {'ms-auto': message.user.id === currentUser.id}]">
            <div class="bg-purple-100 text-black py-2 px-3 rounded-3 w-fit" v-if="message.user.id === currentUser.id">{{ message.message }}</div>
            <div class="bg-gray-200 text-black py-2 px-3 rounded-3 w-fit" v-else>{{ message.message }}</div>
        </div>                            
    </div>

</div>
<div class="d-flex gap-2 mt-2">
<div class="input-group input-group-sm">
    <input :disabled="!currentUser" v-model="message" type="text" class="form-control" aria-label="Text input with segmented dropdown button" v-on:keyup.enter="sendChatMessage" autocomplete="off" placeholder="Send a message" maxlength="240">
    <button :disabled="!currentUser" type="button" class="btn btn-primary" @click.prevent="sendChatMessage">
        <i class="bi bi-send"></i>
    </button>
</div>   
</div> 
</template>

<script lang="ts" setup>
import eventBus from '@/events/EventBus';
import StringHelper from '@/helpers/StringHelper';
import ToastHelper from '@/helpers/ToastHelper';
import RealtimeService from '@/services/RealtimeService';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';

const props = defineProps<{
    channelId: string
}>();

const store = useStore();
const route = useRoute();
const router = useRouter();
const { currentUser } = storeToRefs(store);

const message = ref('')

const bannedWords = ['http', 'www', '.com', 'whatnot', 'dripshop']

function validateMessage() {
    if (StringHelper.isNullOrEmpty(message.value)) {
        return false;
    }

    if (bannedWords.some(w => message.value.toLowerCase().trim().includes(w))) {
        ToastHelper.warning('Your message contains content that violates our DM policy')
        return false;
    }

    return true;
}

async function sendChatMessage() {
    if (!validateMessage()) return;

    await RealtimeService.sendMessage(message.value);
    message.value = '';
}

async function scrollToBottom () {
    await nextTick();
    var scrolltobottom = document.getElementById("chatmaindiv") ?? {} as any;
    scrolltobottom.scrollTop = scrolltobottom.scrollHeight;    
}

const listener =  ref({} as any);
const messages = ref([] as any)

function registerListener () {
    listener.value = RealtimeService.channel.on('message.new', event => {
        messages.value.push(event.message); 
        scrollToBottom();
    });
}

async function unRegisterListener () {
    listener.value?.unsubscribe();
}

async function getMessages() {    
    messages.value = await RealtimeService.getGroupConversation();
    scrollToBottom();
}

async function loadChannel(channelId: string) {
    if (StringHelper.isNullOrEmpty(channelId)) {
        return;
    }

    await RealtimeService.setChannel(channelId)

    // await unRegisterListener();
    await getMessages();
    registerListener();

    eventBus.emit('channelRead')
}

eventBus.on('onRealtimeServiceConnected', async () => {
    await loadChannel(props.channelId)
})

onMounted(async () => {    
    if (!StringHelper.isNullOrEmpty(RealtimeService.client.userID)) {        
        await loadChannel(props.channelId)
    }
})

</script>

<style scoped>
</style>