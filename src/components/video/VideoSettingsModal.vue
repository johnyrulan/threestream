<template>
<div class="modal fade" id="videoSettingsModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="videoSettingsModal" aria-hidden="false">
<div class="modal-dialog modal-xl">
    <div class="modal-content">
    <div class="modal-body">
        <h2 class="text-center mb-5">Set up your video and audio to go live</h2>
        <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-5">
                <label for="video-source">Video Source</label>
                <select class="form-control" id="video-source" v-model="cameraId" @change="onChangeCamera">
                    <option v-for="camera in cameras"
                            :key="camera.deviceId" :value="camera.deviceId">{{ camera.label }}</option>
                </select>

                <label for="mic-source">Microphone Source</label>
                <select class="form-control" id="mic-source" v-model="micId">
                    <option v-for="mic in mics" :key="mic.deviceId" :value="mic.deviceId">{{ mic.label }}</option>
                </select>

                <label for="speakers-source">Speakers Source</label>
                <select class="form-control" id="speakers-source" v-model="speakerId" disabled>
                    <option v-for="speaker in speakers" :key="speaker.deviceId" :value="speaker.deviceId">{{ speaker.label }}</option>
                </select>
            </div>
            <div id="cameraVideo" class="col-sm-12 col-md-12 col-lg-7">
                <div :id="modalId + 'cameraVideo'" class="screenBox rounded-4 shadow-4"></div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" v-if="props.isLive" @click="saveSettings">Save settings</button>
        <button type="button" class="btn btn-primary" v-else @click="goLive">Accept and go live</button>
    </div>
    </div>
</div>
</div>
</template>

<script setup lang="ts">
import ToastHelper from "@/helpers/ToastHelper";
import useEmitter from "@/helpers/useEmitter";
import VideoHelper from "@/helpers/VideoHelper";
import { toggleModal } from "@/hooks/BootstrapHooks";
import AgoraBroadcasterService from "@/services/AgoraBroadcasterService";
import { useStore } from "@/store/main.store";
import StoreMutations from "@/store/store.constants";
import AgoraRTC, { CameraVideoTrackInitConfig, ICameraVideoTrack } from "agora-rtc-sdk-ng";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUpdated, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const props = defineProps<{
    isLive: Boolean
}>();

const store = useStore();

const emit = defineEmits<{
    (e: 'settingsConfigured'): void,
    (e: 'goLive'): void
}>();

const cameras = ref([] as MediaDeviceInfo[]);
const mics = ref([] as MediaDeviceInfo[]);
const speakers = ref([] as MediaDeviceInfo[]);
const cameraId = ref('');
const micId = ref('');
const speakerId = ref('');
const cameraTrack = ref({} as ICameraVideoTrack);
const modalId = 'videoModal';
const { currentUser } = storeToRefs(store);

async function getDevices() {
    try {
        cameras.value = await AgoraBroadcasterService.getCameras();
        mics.value = await AgoraBroadcasterService.getMicrophones();
        speakers.value = await AgoraBroadcasterService.getSpeakers();

        cameraId.value = (cameras.value[0] as any)?.deviceId;
        micId.value = (mics.value[0] as any)?.deviceId;
        speakerId.value = (speakers.value[0] as any)?.deviceId;
    }
    catch (err) {
        ToastHelper.error('There was an error retrieving your media devices');
    }
}

function applyDevices() {
    store.setCameraId(cameraId.value);
    store.setMicId(micId.value);
    store.setSpeakerId(speakerId.value);
}

function removeVideoElementChildren(videoEl: HTMLElement | null) {
    while (videoEl?.hasChildNodes())
    videoEl.removeChild(videoEl.lastChild as ChildNode);
}

function addVideoPills(videoEl: HTMLElement | null) {
    videoEl?.appendChild(VideoHelper.generateNamePill(currentUser.value.name, false));
}

async function createVideoTrack() {
    try {
        const config: CameraVideoTrackInitConfig = {
            cameraId: cameraId.value
        };

        cameraTrack.value = await AgoraRTC.createCameraVideoTrack(config);

        const videoEl = document.getElementById(modalId + 'cameraVideo');
        removeVideoElementChildren(videoEl);
        cameraTrack.value.play(videoEl as HTMLElement, { mirror: false });

        addVideoPills(videoEl);
    }
    catch (err) {
        ToastHelper.error('There was an error with your camera. Please check & try again.');
    }
}

async function onChangeCamera() {
    const videoEl = document.getElementById(modalId + 'cameraVideo');

    removeVideoElementChildren(videoEl);

    try {
        await cameraTrack.value.setDevice(cameraId.value);

        addVideoPills(videoEl);
    } catch (err) {
        // TODO: Common error logger
        console.error(err);
    }
}

function goLive() {
    applyDevices();
    emit('goLive')
    toggleModal('videoSettingsModal', 'hide');
}

function saveSettings() {
    applyDevices();
    emit('settingsConfigured')
    toggleModal('videoSettingsModal', 'hide');
}

onBeforeRouteLeave(() => {
    cameraTrack.value.close()
})

onMounted(async () => {
    await getDevices();
    await createVideoTrack();
});
</script>

<style scoped>
.screenBox {
    min-height:unset;
    border-radius: 5px;
    background: #F0F0F1;
    position: relative;
    overflow: hidden;
}
.screenBox >>> div {
    padding-top: 56.25%;
    display: block;
}
.screenBox >>> video {
    position: absolute;
    top: 0;
    bottom: 0;
    width: auto;
    height: 100%;
    border: 0;
    margin: auto;
    min-width: 100%;
    min-height: 100%;
}
.screenBox >>> .vid-pills {
    position: absolute;
    bottom: 15px;
    left: 15px;
    color: white;
    font-size: 13px;
}
.screenBox >>> .vid-pills >>> .name-pill {
    background: #1F1F1F;
    padding: 7px 12px;
    display: inline-block;
    border-radius: 5px;
}

@media (max-width: 992px) {
    #cameraVideo {
        margin-top: 1rem;
    }
}

</style>