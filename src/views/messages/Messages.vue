<template>
<div class="d-flex flex-column mx-12 bg-white rounded-3 px-6 py-4 mb-12">
    <div class="d-flex justify-content-between pb-4 border-bottom border-gray-200">
        <h3 class="text-black">Send a Message</h3>
        <button class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#sendMessageModal"><i class="bi bi-pencil-square"></i></button>
    </div>
    <div class="d-flex h-full flex-column flex-md-row mt-4 gap-3">
        <div class="d-flex flex-column gap-2 border-end pe-4 border-gray w-full w-md-1/4 h-60-vh overflow-y-scroll">
            <p class="text-muted text-sm">
                <span class="font-bold">DM Rules:</span>
                <ol>
                    <li>Always be respectful; Absolutely no harassment or inappropriate content</li>
                    <li>No links or promotion of other platforms</li>
                    <li>Offers for sales should be only within the JUNKIE platform</li>
                </ol>
                <div>Note: You can only message your followers or users you are following</div>
            </p>
            <button class="btn btn-neutral px-6 py-4 rounded-3" 
                :class="{ 'j-bg-secondary': selectedChannelId === channel.id }"
                v-for="channel in channels" :key="channel.id" @click="goToChannel(channel)">
                <h5 class="text-black">{{ CommonHelper.getStreamChatMember(channel.state.members, currentUser.id).name }}</h5>
                <!-- <div>This is a message</div>  -->
        </button>           
        </div>
        <div class="d-flex flex-column flex-1 rounded-3 p-4 gap-3">
            <MessageView :channel-id="(route.params.id as string)" v-if="route.params.id" 
            :key="(route.params.id as string)" />
        </div>
    </div>
</div>
<SendMessageModal @start-thread="(user) => connectToChannel(user.id)" />
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useStore } from '@/store/main.store';
import { useRoute, useRouter } from 'vue-router';
import SendMessageModal from '@/components/modals/SendMessageModal.vue';
import RealtimeService from '@/services/RealtimeService';
import ErrorLogger from "@/helpers/ErrorLogger";
import ToastHelper from "@/helpers/ToastHelper";
import { RestApi } from '@/services/RestApi';
import StringHelper from '@/helpers/StringHelper';
import MessageView from './MessageView.vue';
import CommonHelper from '@/helpers/CommonHelper';
import { storeToRefs } from 'pinia';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { currentUser } = storeToRefs(store);

const selectedChannelId = ref(route.params.id)

async function goToChannel(channel: any) {
    RealtimeService.channel = channel;
    router.push({ name: 'Messages', params: { id: channel.id } })
    selectedChannelId.value = channel.id;
}

async function initialize() {
    try {
        let token = (await RestApi.Livestream.getUserChatToken()).data;    

        await RealtimeService.initializeChat(currentUser.value, token)
    } catch (err) {
        await ErrorLogger.logApiError(err)
        ToastHelper.error('There was an error connecting to that thread')
    }
}

async function connectToChannel(member: string) {
    if (member === currentUser.value.id)
        return;

    try {
        await RealtimeService.createChatGroup([currentUser.value.id, member])
        await getUserChannels();
        router.push({ name: 'Messages', params: { id: RealtimeService.channel.id }  })
    } catch (err) {        
        await ErrorLogger.logApiError(err)
        ToastHelper.error('There was an error connecting to that thread')
    }
}

const channels = ref([] as any[])

async function getUserChannels() {
    channels.value = await RealtimeService.getUserChannels(currentUser.value.id);
}

onMounted(async () => {
    await initialize();
    await getUserChannels();
})

</script>

<style scoped>
</style>