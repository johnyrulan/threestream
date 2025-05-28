<template>
<!-- streamContainer is where the video renders -->
<div id="media-container" class="media-container">
    <div v-if="showDefaultImage">
        <div v-if="!StringHelper.isNullOrEmpty(livestream.mediaUrl)" class="screenContainer">
            <video id="mediaPlayer" class="w-full rounded-4 shadow-5" controls autoPlay playsinline loop>
                <source :src="VideoHelper.getLivestreamMedia(livestream.id, livestream.mediaUrl)" type="video/mp4">
            </video>
        </div>
        <img v-else class="w-full h-screen" src="@/assets/livestream-waiting.gif" alt=""/>
    </div>
    <div v-else id="streamContainer" class="w-full d-flex flex-wrap justify-content-center screenContainer"></div>
    <div v-show="showDefaultImage" class="timer-overlay-content">
        <vue-countdown :time="countdownTimeInMilliseconds" v-slot="{ days, hours, minutes, seconds }">
            <div class="timer-content px-2">
                <div>
                    <div>Livestream Starting in</div>
                    {{ days }} days {{ hours }} hours {{ minutes }} min {{ seconds }} seconds
                </div>
            </div>
        </vue-countdown>
    </div>
</div>
<StreamOverlay />
<!-- End streamContainer -->

</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { CreateRoomRequest, FeedType, Livestream, SessionUserRole, VideoService } from "@/services/api/models";
import { RestApi } from "@/services/RestApi";
import AgoraBroadcasterService from "@/services/AgoraBroadcasterService";
import { BroadcasterCodec, BroadcasterRole, BroadcasterType } from "@/enums/BroadcasterEnums";
import { onBeforeRouteLeave } from "vue-router";
import InteractiveTalkRenderer from "@/renderer/InteractiveTalkRenderer";
import IInteractiveTalkRenderer from "@/renderer/IInteractiveTalkRenderer";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import VideoHelper from "@/helpers/VideoHelper";
import UserService from "@/services/domain/UserService";
import ErrorLogger from "@/helpers/ErrorLogger";
import StringHelper from "@/helpers/StringHelper";
import eventBus from "@/events/EventBus";
import StreamOverlay from '@/components/livestream/StreamOverlay.vue';

const props = defineProps<{
    livestream: Livestream
}>();

const agoraAppId = import.meta.env.VITE_AGORA_APP_ID;

const videoRenderer: IInteractiveTalkRenderer = new InteractiveTalkRenderer('#streamContainer');
const broadcastService = new AgoraBroadcasterService(BroadcasterRole.Attendee, BroadcasterCodec.H264, BroadcasterType.camera, agoraAppId, onStreamPublished, onStreamUnPublished);
const showDefaultImage = ref(true);

let countdownTimeInMilliseconds = (new Date(props.livestream.startTime) < new Date()) ? 0 : (new Date(props.livestream.startTime).getTime() - new Date().getTime());

onBeforeRouteLeave(async () => {
    await leaveChannel();
})

async function leaveChannel() {
    try {
    await broadcastService.leaveChannel();

    $('#streamContainer').empty();
    }
    catch(err) {
    await ErrorLogger.logApiError(err)
    }
}

async function onStreamPublished(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video", isLocalUser = false) {
    if (mediaType === "video") {
    showDefaultImage.value = false;

    const u = await UserService.getUserById(user.uid.toString());

    videoRenderer.addVideoStream(user, u?.name, true, !user.hasAudio, false, true);
    }
    else {
    videoRenderer.addAudioStream(user, isLocalUser);
    }
}

function onStreamUnPublished(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") {
    if (mediaType === "video") {
    videoRenderer.removeVideoStream(user.uid.toString());

    if (document.getElementById("streamContainer")?.children?.length == 0) {
        showDefaultImage.value = true;
    }
    }
    else {
    videoRenderer.removeAudioStream(user.uid.toString());
    }
}

async function joinBroadcast() {
    const roomRequest: CreateRoomRequest = {
        livestreamId: props.livestream.id,
        role: SessionUserRole.Attendee,
        feedType: FeedType.WebCam,
        videoService: VideoService.Agora,
    };

    const room = (await RestApi.Room.createRoom(roomRequest)).data;

    await broadcastService.joinChannel(room.roomId, room.accessToken, room.userStreamId);
}

eventBus.on('onAppClick', async () => {
    await (document.getElementById('mediaPlayer') as HTMLVideoElement)?.play();
})

onMounted(async () => {
    await joinBroadcast();
})
</script>

<style scoped>
.screenContainer >>> div {
    background-color: transparent !important;
    /* border-radius: 1rem; */
}

.screenContainer >>> .agora_video_player {
    /* border-radius: 1rem; */
}

.screenBox {
    background-color: transparent !important;
    /* border-radius: 1rem !important; */
}
.media-container {
    position: relative;
}
.timer-overlay-content {
    position: absolute;
    bottom: 0px;
    color: #fff;
    right: 0px;
    background: #00000075;
    width: 100%;
    height: 100%;
    /* border-radius: 13px; */
}
.timer-content {
    text-align: center;
    font-size: 35px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--body-font);
    font-weight: 900;
}
.timer-content p {
    font-size: 20px;
    font-family: var(--body-font);
    font-weight: 500;
}

/* @media only screen and (min-width: 1200px) {
    .screenContainer {
        min-height: 35vw;
        background-color: transparent !important;
        border: none !important;
    }
    .screenContainer :first-child {
        width: 100%;
        height: 35vw;
    }

    .screenContainer :not(:first-child) {
        width: 33.333%;
        height: 12vw;
    }
} */

@media only screen and (min-width: 768px) {
    .screenContainer {
        min-height: 100vh;
    }

    .screenContainer :first-child {
        width: 100%;
        min-height: 50vh;
    }

    .screenContainer :not(:first-child) {
        width: 45%;
        height: 20vw;
    }
}
@media only screen and (max-width: 767px) {
    .screenContainer {
        min-height: 100vh;
    }

    .screenContainer :first-child {
        width: 100%;
        min-height: 50vh;
    }

    .screenContainer :not(:first-child) {
        width: 100%;
        height: 60vw;
    }
}
</style>