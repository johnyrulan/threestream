<template>
<!-- #screenContainer is where the video renders -->
<div class="position-relative">
<div id="screenContainer" class="w-full d-flex flex-row flex-wrap justify-content-center "></div>
<!-- End #screenContainer -->
  <div class="overlay-content">
      <!-- <vue-countdown :time="countdownTimeInMilliseconds" v-slot="{ days, hours, minutes, seconds }">
          <div class="timer-content">
              <div>
                  <div>Livestream Starting in</div>
                  {{ days }} days {{ hours }} hours {{ minutes }} min {{ seconds }} seconds
              </div>
          </div>
      </vue-countdown> -->
      <!-- <ChatSideBar :livestreamId="props.livestreamId" :is-host="true" /> -->
  </div>
</div>

<div class="btn-group w-full px-4" role="group" aria-label="Basic example">
  <button type="button" :class="isBroadcasting ? 'btn btn-success' : 'btn btn-neutral'" @click="isBroadcasting ? stopBroadcast() : startBroadcast()">
      <span class="pe-2">
          <i :class="isBroadcasting ? 'bi bi-camera-video' : 'bi bi-camera-video-off-fill'"></i>
      </span>
      Camera
  </button>
  <button type="button" :class="isMuted ? 'btn btn-neutral' : 'btn btn-success'" @click="isMuted ? toggleMuteAudio(false) : toggleMuteAudio(true)">
      <span class="pe-2">
          <i :class="isMuted? 'bi bi-mic-mute-fill': 'bi bi-mic'"></i>
      </span>
      Mic
  </button>
    <button type="button" :class="isScreenSharing ? 'btn btn-success' : 'btn btn-neutral'" @click="isScreenSharing ? stopScreenShare() : startScreenShare()">
      <span class="pe-2">
          <i class="bi bi-display"></i>
      </span>
      Screen
  </button>
  <button type="button" class="btn btn-neutral" @click="showSettingsModal">
      <span class="pe-2">
          <i class="bi bi-gear"></i>
      </span>
      Settings
  </button>
  <button type="button" class="btn btn-neutral" @click="goToHome">
      <span class="pe-2">
          <i class="bi bi-arrow-left-circle"></i>
      </span>
      Exit
  </button>
</div>
<VideoSettingsModal :isLive="isBroadcasting" @go-live="initializeBroadcaster" @settings-configured="changeDevices" />
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import VideoSettingsModal from '@/components/video/VideoSettingsModal.vue';
import { CreateRoomRequest, FeedType, SessionUserRole, StartRecordingRequest, VideoService } from "@/services/api/models";
import { RestApi } from "@/services/RestApi";
import AgoraBroadcasterService from "@/services/AgoraBroadcasterService";
import { BroadcasterCodec, BroadcasterRole, BroadcasterType } from "@/enums/BroadcasterEnums";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import InteractiveTalkRenderer from "@/renderer/InteractiveTalkRenderer";
import IInteractiveTalkRenderer from "@/renderer/IInteractiveTalkRenderer";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { toggleModal } from "@/hooks/BootstrapHooks";
import UserService from "@/services/domain/UserService";
import ErrorLogger from "@/helpers/ErrorLogger";
import { storeToRefs } from 'pinia';
import { useStore } from "@/store/main.store";

const props = defineProps<{
    livestreamId: string,
    isHost: boolean,
    hostUserId: string
}>();

const agoraAppId = import.meta.env.VITE_AGORA_APP_ID;
const router = useRouter();
const store = useStore();

const videoRenderer: IInteractiveTalkRenderer = new InteractiveTalkRenderer('#screenContainer');
const broadcastService = new AgoraBroadcasterService(BroadcasterRole.Presenter, BroadcasterCodec.H264, BroadcasterType.camera, agoraAppId, onStreamPublished, onStreamUnPublished);
const screenShareService = new AgoraBroadcasterService(BroadcasterRole.Presenter, BroadcasterCodec.H264, BroadcasterType.screenshare, agoraAppId, () => {}, () => {});
const isBroadcasting = ref(false);
const isMuted = ref(true);
const isScreenSharing = ref(false);
const { currentUser } = storeToRefs(store);

function showSettingsModal() {
   toggleModal('videoSettingsModal', 'show');
}

async function goToHome() {
  await leaveChannel();
  router.push({ name: 'Home' });
}

onBeforeRouteLeave(async () => {
    await leaveChannel();
});

async function leaveChannel() {
  try {
    await broadcastService.leaveChannel();
    await screenShareService.leaveChannel();
  }
  catch(err) {
    console.error(err);
  }
}

async function sendNotification() {
  try {
    if (props.isHost) {
      await RestApi.Room.sendNotification(props.livestreamId)
    }
  } catch (err) {
    await ErrorLogger.logApiError(err)
  }
}

async function startRecording() {
  try {
    if (props.isHost) {
      await RestApi.Room.startRecording({ livestreamId: props.livestreamId })
    }
  } catch (err) {
    await ErrorLogger.logApiError(err)
  }
}

async function initializeBroadcaster() {
  const roomRequest: CreateRoomRequest = {
    livestreamId: props.livestreamId,
    role: SessionUserRole.Presenter,
    feedType: FeedType.WebCam,
    videoService: VideoService.Agora,
  };

  try {
    const room = (await RestApi.Room.createRoom(roomRequest)).data;

    await broadcastService.createLocalTracks(store.cameraId, store.micId);

    await broadcastService.joinChannel(room.roomId, room.accessToken as string, room.userStreamId);

    await startBroadcast();
    await toggleMuteAudio(false);
    await sendNotification();
    await startRecording();
  }
  catch (err) {
    console.error(err);
  }
}

async function changeDevices() {
  await stopBroadcast();
  await broadcastService.changeTrack(store.cameraId, store.micId);
  await startBroadcast();
}

async function onStreamPublished(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video", isLocalUser = false) {
  if (mediaType === "video") {
    const u = await UserService.getUserById(user.uid.toString());

    const isHostStream = props.hostUserId === u?.id;

    videoRenderer.addVideoStream(user, u?.name, isHostStream, !user.hasAudio, false, true);
  }
  else {
    videoRenderer.addAudioStream(user, isLocalUser);
  }
}

function onStreamUnPublished(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") {
  if (mediaType === "video") {
    videoRenderer.removeVideoStream(user.uid.toString());
  }
  else {
    videoRenderer.removeAudioStream(user.uid.toString());
  }
}

function isChannelBroadcasting() {
  if (isBroadcasting.value) return true;

    const users = (broadcastService as AgoraBroadcasterService).client?.remoteUsers ?? [];

    for (let userCounter = 0; userCounter < users.length; userCounter++) {
      if (users[userCounter].hasVideo) return true;
    }

   return false;
}

async function startBroadcast() {
  try {
    await broadcastService.publishLocalVideo();
    // await broadcastService.publishLocalAudio();
    isBroadcasting.value = true;

    const localUser: IAgoraRTCRemoteUser = {
      uid: broadcastService.localUid,
      videoTrack: broadcastService.localVideoTrack as any,
      audioTrack: undefined as any,
      hasVideo: isBroadcasting.value,
      hasAudio: !isMuted.value
    };

    videoRenderer.addVideoStream(localUser, currentUser.value.name, props.isHost, true, true, true);
    videoRenderer.removeAudioStream(broadcastService.localUid);
  }
  catch (err) {
    console.error(err);
  }
}

 async function stopBroadcast() {
    try {
      await broadcastService.unpublishLocalVideo();
      await broadcastService.unpublishLocalAudio();
      isBroadcasting.value = false;
      isMuted.value = true;

      videoRenderer.removeVideoStream(broadcastService.localUid);
      videoRenderer.removeAudioStream(broadcastService.localUid);

    } catch (err) {
      console.error(err);
    }
}

async function toggleMuteAudio(muteAudio: boolean) {

  try {
    if (muteAudio) {
      await broadcastService.unpublishLocalAudio();
    } else {
      await broadcastService.publishLocalAudio();
    }

    isMuted.value = muteAudio;

    const localUser: IAgoraRTCRemoteUser = {
      uid: broadcastService.localUid,
      videoTrack: undefined as any,
      audioTrack: undefined as any,
      hasVideo: isBroadcasting.value,
      hasAudio: !isMuted.value
    };

    if (!isMuted.value) onStreamPublished(localUser, "audio", true);
    else onStreamUnPublished(localUser, "audio");
  }
  catch (err) {
    console.error(err);
  }
}

async function startScreenShare() {
  try {
    await initializeScreenShareBroadcaster();

    await screenShareService.startScreenShare();

    isScreenSharing.value = true;
  } catch (err) {
    console.error(err);
  }
}

async function stopScreenShare() {
  try {
    await screenShareService?.stopScreenShare();
    await screenShareService?.leaveChannel();
    isScreenSharing.value = false;
  } catch (err) {
    console.error(err);
  }
}

async function initializeScreenShareBroadcaster() {
  const roomRequest: CreateRoomRequest = {
    livestreamId: props.livestreamId ?? '',
    role: SessionUserRole.Presenter,
    feedType: FeedType.ScreenShare,
    videoService: VideoService.Agora,
  };

  const room = (await RestApi.Room.createRoom(roomRequest)).data;
  await screenShareService.createScreenShareTrack();

  await screenShareService.joinChannel(
    room.roomId ?? '',
    room.accessToken as string,
    room.userStreamId ?? ''
  );
}

onMounted(() => {
  toggleModal('videoSettingsModal', 'show');
})

onUnmounted(async () => {
  await leaveChannel();
})

</script>

<style scoped>
#screenContainer >>> div {
    background-color: transparent !important;
    /* border-radius: 1rem; */
}

#screenContainer >>> .vid-pills{
    position: relative;
    bottom: 40px;
    left: 20px;
    color: #fff;
    text-transform: capitalize;
}

#screenContainer >>> .agora_video_player{
    /* border-radius: 0.5rem; */
}

.screenBox {
    background-color: transparent !important;
    /* border-radius: 0.5rem !important; */
}

/* #screenContainer :not(:first-child) {
    border-radius: 10px;  
    border-width: 1px;
    border-color: var(--accent-color);       
} */

/* #screenContainer >>> div {
    flex: 1 1 48% !important;
} */


@media only screen and (min-width: 1200px) {
    #screenContainer {
        min-height: 35vw;
        background-color: transparent !important;
        border: none !important;
    }

    #screenContainer :first-child {
        width: 100%;
        height: 35vw;
    }

    #screenContainer :not(:first-child) {
        width: 25%;
        height: 10vw;
        position: absolute !important;
    }

    #screenContainer :nth-child(2) {
        bottom: 8px;
        right: 8px;
    }

    #screenContainer :nth-child(3) {
        bottom: 8px;
        left: 8px;
    }

    #screenContainer :nth-child(4) {
        top: 8px;
        left: 8px;
    }
    
    #screenContainer :nth-child(5) {
        top: 8px;
        right: 8px;
    }     
}

@media only screen and (min-width: 768px) and (max-width: 1199px) {
    #screenContainer {
        min-height: 50vw;
    }

    #screenContainer :first-child {
        width: 100%;
        height: 50vw;
    }

    #screenContainer :not(:first-child) {
        width: 28%;
        height: 20vw;
        position: absolute !important;
    }

    #screenContainer :nth-child(2) {
        bottom: 8px;
        right: 8px;
    }

    #screenContainer :nth-child(3) {
        bottom: 8px;
        left: 8px;
    }

    #screenContainer :nth-child(4) {
        top: 8px;
        left: 8px;
    }
    
    #screenContainer :nth-child(5) {
        top: 8px;
        right: 8px;
    }       
}
@media only screen and (max-width: 767px) {
    #screenContainer {
        min-height: 60vw;
    }

    #screenContainer :first-child {
        width: 100%;
        height: 60vw;
    }

    #screenContainer :not(:first-child) {
        width: 28%;
        height: 16vw;
        position: absolute !important;
    }

    #screenContainer :nth-child(2) {
        bottom: 8px;
        right: 8px;
    }

    #screenContainer :nth-child(3) {
        bottom: 8px;
        left: 8px;
    }

    #screenContainer :nth-child(4) {
        top: 8px;
        left: 8px;
    }
    
    #screenContainer :nth-child(5) {
        top: 8px;
        right: 8px;
    }        
} 
</style>