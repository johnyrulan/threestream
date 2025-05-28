<template>
<div class="bg-surface-secondary overflow-hidden mx-auto" style="max-width: 950px">
<div class="d-xl-flex">
    <div class="min-w-0 flex-xl-fill">
    <!-- Navbar -->
    <main class="py-0">
        <div class="container-fluid px-0">
        <div class="vstack gap-6">
           <LivestreamAttendeeVideoV2 v-if="livestream.id" :livestream="livestream" />
            <!-- <div class="card d-none d-lg-block">
                <div class="card-body">
                    <div class="d-flex">
                        <h4 class="mb-3 me-4">{{ livestream.name }}</h4>
                        <span class="badge badge-pill j-bg-primary ms-auto h-fit-content">
                            <i class="bi bi-eye-fill me-1"></i> {{ totalMembers }} Online
                        </span>
                    </div>
                    <p class="text-sm"><span v-html="livestream.description"></span></p>
                    <p v-if="seller.name !== ''" class="mb-3">Hosted by {{ seller.name }}</p>
                </div>
            </div> -->
            <!-- <div class="card">
            <div class="card-body">
                <h4 class="mb-3">Mission</h4>
                <p class="text-sm">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable you need to be sure there isn't anything hidden in the middle of text.
                </p>
            </div>
            </div> -->
        </div>
        </div>
    </main>
    </div>
    <!-- <NFTSideBar :livestream="livestream"/> -->
    <!-- <ChatSideBar :livestream-id="livestream.id"/> -->
</div>
</div>

<div class="modal fade" id="hostWarningModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="hostWarningModal" aria-hidden="false">
<div class="modal-dialog modal-lg">
    <div class="modal-content">
    <div class="modal-body">
        <h4 class="text-center mb-5">You are currently in the Attendee mode. Would you like to switch to the Host mode for the livestream?</h4>
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
import ChatSideBar from '../../components/livestream/ChatSideBar.vue'
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
import LivestreamAttendeeVideoV2 from '@/components/livestream/LivestreamAttendeeVideoV2.vue';
import { toggleModal } from '@/hooks/BootstrapHooks';
import { RestApi } from '@/services/RestApi';
import eventBus from '@/events/EventBus';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
let livestream = ref({} as Livestream);
let seller = ref(new User());
let totalMembers = ref(0);

const store = useStore();
const { currentUser } = storeToRefs(store);

eventBus.on('onLogin', async () => {
    await authRealtime();
})

eventBus.on('onLogin', async () => {
    await authRealtime();
})

async function authRealtime() {
    const chatuser = currentUser.value ?? { id: 'guest', name: 'guest' };

    // const loader = LoadingHelper.showLoader();

    try {
        // await RealtimeService.initializeRealtimeService(chatUser, livestream.value.id, livestream.value.name)
    } catch (err) {
        ToastHelper.error('There was a problem connecting you to the stream. Please refresh & try again')
        await ErrorLogger.logApiError(err)
    }

    // LoadingHelper.hideLoader(loader)
}

async function getRoomStatistics() {
    totalMembers.value = (await RestApi.Room.getRoomStatistics(livestream.value.id))?.data.userCount;

    setInterval(async () => {
        totalMembers.value = (await RestApi.Room.getRoomStatistics(livestream.value.id))?.data.userCount;
    }, 30000);
}

onMounted(async () => {
    livestream.value = await LivestreamService.getLivestream(route.params.id.toString());
    seller.value = await UserService.getUserById(livestream.value.hostUserId) ?? new User();

    await authRealtime();

    if (currentUser.value && currentUser.value.id === livestream.value.hostUserId) {
        toggleModal('hostWarningModal', 'show');
    }

    await getRoomStatistics();
})

onUnmounted(async () => {
    await RealtimeService.logout();
})

</script>

<style scoped>

</style>
