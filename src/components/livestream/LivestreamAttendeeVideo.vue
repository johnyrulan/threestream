<template>
    <!-- streamContainer is where the video renders -->
    <div id="media-container" class="media-container">
        <div v-if="showDefaultImage">
            <div v-if="!StringHelper.isNullOrEmpty(livestream.mediaUrl)" class="streamContainer">
                <video id="mediaPlayer" class="w-full" controls autoPlay playsinline loop>
                    <source :src="VideoHelper.getLivestreamMedia(livestream.id, livestream.mediaUrl)" type="video/mp4">
                </video>
            </div>
            <img v-else class="w-full" src="@/assets/livestream-waiting.gif" alt=""/>
        </div>
        <div v-else id="streamContainer" class="w-full d-flex flex-wrap justify-content-center gap-3 streamContainer"></div>
        <div class="overlay-content">
            <!-- <vue-countdown :time="countdownTimeInMilliseconds" v-slot="{ days, hours, minutes, seconds }">
                <div class="timer-content">
                    <div>
                        <div>Livestream Starting in</div>
                        {{ days }} days {{ hours }} hours {{ minutes }} min {{ seconds }} seconds
                    </div>
                </div>
            </vue-countdown> -->
            <!-- <ChatSideBar :livestreamId="props.livestream.id" /> -->
            <div></div>            
        </div>
    </div>
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

        const isHostStream = props.livestream.hostUserId === u?.id;

        videoRenderer.addVideoStream(user, u?.name, isHostStream, !user.hasAudio, false, true);
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

.screenContainer >>> .vid-pills{
    position: relative;
    bottom: 40px;
    left: 20px;
    color: #fff;
    text-transform: capitalize;
}

.screenContainer >>> .agora_video_player{
    /* border-radius: 1rem; */
}

.screenBox {
    background-color: transparent !important;
    /* border-radius: 1rem !important; */
}
.media-container {
    position: relative;
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

#streamContainer :not(:first-child) {
    /* border-radius: 10px;   */
    border-width: 1px;
    border-color: var(--accent-color);       
}

/* #streamContainer :not(:first-child) >>> .agora_video_player {
    border-radius: 10px;     
} */


@media only screen and (min-width: 1200px) {
    #streamContainer {
        min-height: 35vw;
        background-color: transparent !important;
        border: none !important;
    }

    #streamContainer :first-child {
        width: 100%;
        height: 35vw;
    }

    #streamContainer :not(:first-child) {
        width: 25%;
        height: 10vw;
        position: absolute !important;    
    }

    #streamContainer :nth-child(2) {
        bottom: 8px;
        right: 8px;
    }

    #streamContainer :nth-child(3) {
        bottom: 8px;
        left: 8px;
    }

    #streamContainer :nth-child(4) {
        top: 8px;
        left: 8px;
    }
    
    #streamContainer :nth-child(5) {
        top: 8px;
        right: 8px;
    }    
}

@media only screen and (min-width: 768px) and (max-width: 1199px) {
    #streamContainer {
        min-height: 50vw;
    }

    #streamContainer :first-child {
        width: 100%;
        height: 50vw;
    }

    #streamContainer :not(:first-child) {
        width: 28%;
        height: 20vw;
        position: absolute !important;
    }

    #streamContainer :nth-child(2) {
        bottom: 8px;
        right: 8px;
    }

    #streamContainer :nth-child(3) {
        bottom: 8px;
        left: 8px;
    }

    #streamContainer :nth-child(4) {
        top: 8px;
        left: 8px;
    }
    
    #streamContainer :nth-child(5) {
        top: 8px;
        right: 8px;
    }       
}
@media only screen and (max-width: 767px) {
    #streamContainer {
        min-height: 60vw;
    }

    #streamContainer :first-child {
        width: 100%;
        height: 60vw;
    }

    /* #screenContainer :not(:first-child) {
        width: 100%;
        height: 60vw;
    } */

    #streamContainer :not(:first-child) {
        width: 28%;
        height: 16vw;
        position: absolute !important;
    }

    #streamContainer :nth-child(2) {
        bottom: 8px;
        right: 8px;
    }

    #streamContainer :nth-child(3) {
        bottom: 8px;
        left: 8px;
    }

    #streamContainer :nth-child(4) {
        top: 8px;
        left: 8px;
    }
    
    #streamContainer :nth-child(5) {
        top: 8px;
        right: 8px;
    }        
}
</style>