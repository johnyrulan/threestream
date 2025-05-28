<template>
    <div class="bg-dark">
    <div class="d-xl-flex">
        <div class="min-w-0 flex-xl-fill">
        <!-- Navbar -->
        <main class="">
            <div class="container-fluid px-xxl-4">
            <div class="vstack gap-6">
                <LivestreamPresenterVideo :livestreamId="livestream.id" :isHost="false" :hostUserId="livestream.hostUserId"/>
                <LivestreamInfo v-if="livestream.id" :livestream="livestream" />
            </div>
            </div>
        </main>
        </div>
        <NFTSideBar :livestream="livestream" v-if="livestream.id" />
    </div>
    </div>
    </template>
    
    <script setup lang="ts">
    import NFTSideBar from '../../components/livestream/NFTSideBar.vue'
    import { useRoute, useRouter } from 'vue-router';
    import { computed, onMounted, onUnmounted } from '@vue/runtime-core';
    import { FileRequestType, Livestream } from "../../services/api/models";
    import { ref } from 'vue';
    import LivestreamService from '@/services/domain/LivestreamService';
    import User from '@/models/User';
    import UserService from '@/services/domain/UserService';
    import { useStore } from '@/store/main.store';
    import RealtimeService from '@/services/RealtimeService';
    import ErrorLogger from '@/helpers/ErrorLogger';
    import ToastHelper from '@/helpers/ToastHelper';
    import LoadingHelper from '@/helpers/LoadingHelper';
    import { RestApi } from '@/services/RestApi';
    import LivestreamPresenterVideo from '@/components/livestream/LivestreamPresenterVideo.vue';
    import eventBus from '@/events/EventBus';
    import { v4 as uuidv4 } from 'uuid';
    import LivestreamInfo from '@/components/livestream/LivestreamInfo.vue'
import StringHelper from '@/helpers/StringHelper';
import { storeToRefs } from 'pinia';
    
    const route = useRoute();
    let livestream = ref({} as Livestream);
    let seller = ref(new User());
    
    const inviteId = route.params.inviteId as string;

    const store = useStore();
    const router = useRouter();
    const { currentUser } = storeToRefs(store);
    
    eventBus.on('onLogin', async () => {
        await authRealtime();
    })
    
    eventBus.on('onLogin', async () => {
        await authRealtime();
    })
    
    async function authRealtime() {
        const chatUser = currentUser.value ?? { id: 'guest', name: 'guest' };
        try {
            let token = (await RestApi.Livestream.getUserChatToken()).data;    
    
            await RealtimeService.initializeRealtimeService(chatUser, livestream.value.id, livestream.value.name, token, livestream.value.hostUserId)
        } catch (err) {
            ToastHelper.error('There was a problem connecting you to the stream. Please refresh & try again')
            await ErrorLogger.logApiError(err)
        }
    }
    
    onMounted(async () => {

        livestream.value = await LivestreamService.getLivestream(route.params.id.toString());
        seller.value = await UserService.getUserById(livestream.value.hostUserId) ?? new User();

        const isInviteValid = (await RestApi.Livestream.isValidCostreamInvite(livestream.value.id, inviteId)).data;
    
        if (!currentUser.value || StringHelper.isNullOrEmpty(inviteId) || !isInviteValid) {
            ToastHelper.error('You are not authorized to access that page');
            const baseUrl = import.meta.env.VITE_URL;

            window.location.href = `${baseUrl}`;
            return
        } 
    
        await authRealtime();
    })
    
    onUnmounted(async () => {
        await RealtimeService.logout();
    })
    </script>
    
    <style scoped>
    </style>