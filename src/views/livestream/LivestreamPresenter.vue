<template>
<div class="bg-dark">
<div class="d-xl-flex">
    <div class="min-w-0 flex-xl-fill">
    <!-- Navbar -->
    <main class="">
        <div class="container-fluid px-0">
        <div class="vstack gap-2">
            <LivestreamPresenterVideo :livestreamId="livestream.id" :isHost="true" :host-user-id="livestream.hostUserId"/>
            <div class="d-flex justify-content-center gap-3 mt-3">
                <!-- <button class="btn btn-sm btn-primary" @click="uploadMedia()">Upload Livestream Media</button> -->
                <input v-show="false" id="livestream_media_upload" name="livestream_media_upload" type="file" accept="video/mp4" @change="onMediaUpload($event)" />         

                <button class="btn btn-sm btn-primary" @click="openRaidModal"><i class="bi bi-fire"></i> Raid</button>

                <button class="btn btn-sm btn-primary" @click="openCostreamModal"><i class="bi bi-emoji-sunglasses"></i> Add Co-Streamer</button>
            </div>
            <LivestreamInfo v-if="livestream.id" :livestream="livestream" />
        </div>
        </div>
    </main>
    </div>
    <NFTSideBar :livestream="livestream" v-if="livestream.id" />
</div>
</div>
<RaidModal :livestreamId="livestream.id" :refresh="raidKey"/>
<CostreamModal :livestreamId="livestream.id" :refresh="costreamKey"/>
</template>

<script setup lang="ts">
import NFTSideBar from '../../components/livestream/NFTSideBar.vue'
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, onUnmounted } from '@vue/runtime-core';
import { FileRequestType, Livestream, UserRole } from "../../services/api/models";
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
import RaidModal from '@/components/modals/RaidModal.vue';
import { toggleModal } from '@/hooks/BootstrapHooks';
import CostreamModal from '@/components/modals/CostreamModal.vue';
import { storeToRefs } from 'pinia';

const route = useRoute();
let livestream = ref({} as Livestream);
let seller = ref(new User());

const store = useStore();
const router = useRouter();
const { currentUser } = storeToRefs(store);

const raidKey = ref(0)
const costreamKey = ref(0)

function openRaidModal() {
    raidKey.value = raidKey.value + 1;
    toggleModal('raidModal', 'show')
}

function openCostreamModal() {
    costreamKey.value = costreamKey.value + 1;
    toggleModal('costreamModal', 'show')
}

eventBus.on('onLogin', async () => {
    await authRealtime();
})

eventBus.on('onLogin', async () => {
    await authRealtime();
})

function uploadMedia() {
   document.getElementById('livestream_media_upload')?.click();
}

async function onMediaUpload(event: any) {
    const file = event.target.files[0]
    let extention = '';

    if (file.type === "video/mp4") extention = '.mp4'
    else if (file.type === "video/m4v") extention = '.m4v'
    else {
        ToastHelper.error("Only mp4 & m4v files allowed");
        return;
    }

    const fileName = uuidv4() + extention;

    const loader = LoadingHelper.showLoader();

    try {
        await RestApi.Upload.upload(fileName, file, FileRequestType.Livestream);

        livestream.value.mediaUrl = fileName;

        await RestApi.Livestream.upadateLivestream(livestream.value);

        ToastHelper.success('Media successfully uploaded');
    } catch (err) {
        ToastHelper.error('There was an error uploading the media. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}

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

    if (!currentUser.value || currentUser.value?.id !== livestream.value?.hostUserId) {
        ToastHelper.error('You are not authorized to access that page');
        router.push({ name: 'Home' })
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