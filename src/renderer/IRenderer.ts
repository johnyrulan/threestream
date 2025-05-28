import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";

export default interface IRenderer {        
    addVideoStream(user: IAgoraRTCRemoteUser, userName: string, isHost: boolean, isMuted: boolean, isLocalUser: boolean, viewControls: boolean): void;

    removeVideoStream(streamId: string): void;

    addAudioStream(user: IAgoraRTCRemoteUser, isLocalUser: boolean): void;

    removeAudioStream(streamId: string): void;        
}