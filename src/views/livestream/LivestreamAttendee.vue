<template>
<div class="bg-jk-bg-dark">
<div class="d-xl-flex">
    <div class="min-w-0 flex-xl-fill">
    <!-- Navbar -->
    <main class="">
        <div class="container-fluid px-0">
        <div class="vstack gap-2">
            <LivestreamAttendeeVideo v-if="livestream.id" :livestream="livestream" :class="'order-1 order-lg-0'"/>
            <LivestreamInfo v-if="livestream.id" :livestream="livestream" />
        </div>
        </div>
    </main>
    </div>
    <NFTSideBar :livestream="livestream" v-if="livestream.id"/>
</div>
</div>

<div class="modal fade" id="hostWarningModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="hostWarningModal" aria-hidden="false">
<div class="modal-dialog modal-lg">
    <div class="modal-content">
    <div class="modal-body">
        <h4 class="text-center mb-5 text-dark">You are currently in the Attendee mode. Would you like to switch to the Host mode for the livestream?</h4>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Stay in Attendee Mode</button>
        <a type="button" class="btn btn-primary" :href="`/livestream/${livestream.id}/present`">Switch to Host Mode</a>
    </div>
    </div>
</div>
</div>
</template>

<script setup lang="ts">
import NFTSideBar from '../../components/livestream/NFTSideBar.vue'
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import LivestreamService from '@/services/domain/LivestreamService';
import UserService from '@/services/domain/UserService';
import { useRoute, useRouter } from 'vue-router';
import { Livestream } from "../../services/api/models";
import User from '@/models/User';
import { useStore } from '@/store/main.store';
import RealtimeService from '@/services/RealtimeService';
import LoadingHelper from '@/helpers/LoadingHelper';
import ToastHelper from '@/helpers/ToastHelper';
import ErrorLogger from '@/helpers/ErrorLogger';
import LivestreamAttendeeVideo from '@/components/livestream/LivestreamAttendeeVideo.vue';
import { toggleModal } from '@/hooks/BootstrapHooks';
import { RestApi } from '@/services/RestApi';
import eventBus from '@/events/EventBus';
import LivestreamInfo from '@/components/livestream/LivestreamInfo.vue'
import { storeToRefs } from 'pinia';

const route = useRoute();
let livestream = ref({} as Livestream);

const store = useStore();
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
        let token = '';
    
        if (chatUser.id != 'guest') {        
            token = (await RestApi.Livestream.getUserChatToken()).data
        }        

        await RealtimeService.initializeRealtimeService(chatUser, livestream.value.id, livestream.value.name, token, livestream.value.hostUserId)
    } catch (err) {
        ToastHelper.error('There was a problem connecting you to the stream. Please refresh & try again')
        await ErrorLogger.logApiError(err)
    }

}

onMounted(async () => {    
    livestream.value = await LivestreamService.getLivestream(route.params.id.toString());

    if (!livestream.value) {
        window.location.href = `https://app.junkieapp.xyz/livestream/${route.params.id.toString()}/attend`;

        return;
    }

    await authRealtime();

    if (currentUser.value && currentUser.value.id === livestream.value.hostUserId) {
        toggleModal('hostWarningModal', 'show');
    }
})

onUnmounted(async () => {
    await RealtimeService.logout();    
})

</script>

<style scoped>

</style>
