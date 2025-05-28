import Vue from 'vue';
import VideoHelper from '@/helpers/VideoHelper';
import LiveVideoControls from '@/components/video/LiveVideoControls.vue';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import $ from 'jquery';

import IInteractiveTalkRenderer from './IInteractiveTalkRenderer';

export default class InteractiveTalkRenderer implements IInteractiveTalkRenderer {

    private containerEl = '';

    private videoControls: any = {};

    private muteStatuses: any = {};

    constructor(containerEl: string) {
        this.containerEl = containerEl;
    }

    removeMainScreen() {
        $(`${this.containerEl} .screenBox.mainScreen`).removeClass('mainScreen');
    }

    setDefaultMainVideo() {
        if ($(`${this.containerEl} .screenBox.mainScreen`).length === 0)
            $(`${this.containerEl} .screenBox:first`).addClass('mainScreen');
    }

    setMainVideo(streamId: string): void {
        this.removeMainScreen();

        $(`${this.containerEl} #${streamId}`).addClass('mainScreen');
    }

    addVideoStream(user: IAgoraRTCRemoteUser, userName: string, isHost: boolean, isMuted: boolean, isLocalUser: boolean, viewControls: boolean): void {
        this.removeMainScreen();

        const el = $('<div></div>')
            .attr('id', user.uid.toString())
            .attr('ref', user.uid.toString())
            .addClass('screenBox');
            // .addClass('shadow-4');
            // .addClass('h-auto');
            //.addClass('w-full');

        const isScreenShare = user.uid.toString().includes('screenshare');

        if (isScreenShare) $(this.containerEl).prepend(el);
        else if (isHost) {            
            $(this.containerEl).prepend(el);
        } else {
            $(this.containerEl).append(el);
        }

        const videoFit = isScreenShare ? 'fill' : 'contain';

        user.videoTrack?.play(user.uid.toString(), { mirror: false, fit: videoFit });
        // el.append(VideoHelper.generateNamePill(userName, false, true));
        // el.append(VideoHelper.generateNamePill(userName, false, isHost));
        // const liveViewControlsComp = Vue.defineComponent(LiveVideoControls as any);
        // const liveVideoControlsInstance = liveViewControlsComp;
        // liveVideoControlsInstance.$props.uid = user.uid.toString();
        // liveVideoControlsInstance.$props.isMuted = this.muteStatuses[user.uid] ?? true;

        // if (viewControls && !isLocalUser) {
        //     liveVideoControlsInstance.$props.showMute = true;
        //     liveVideoControlsInstance.$props.showRemove = true;
        // }

        // el.append(liveVideoControlsInstance.$el);

        // this.videoControls[user.uid.toString()] = liveVideoControlsInstance;

        // if (isScreenShare) this.setMainVideo(user.uid.toString());
        // else this.setDefaultMainVideo();
    }

    removeVideoStream(streamId: string): void {
        $(`${this.containerEl} #${streamId}`).remove();

        this.setDefaultMainVideo();
    }

    setMuteStatus(uid: string, isMuted: boolean) {
        this.muteStatuses[uid] = isMuted;

        if (this.videoControls[uid]) this.videoControls[uid].$props.isMuted = isMuted;
    }

    addAudioStream(user: IAgoraRTCRemoteUser, isLocalUser: boolean): void {
        if (!isLocalUser) user.audioTrack?.play();

        VideoHelper.removeMuteIcon(user.uid.toString());

        this.setMuteStatus(user.uid.toString(), false);
    }

    removeAudioStream(streamId: string): void {
        VideoHelper.addMuteIcon(streamId);

        this.setMuteStatus(streamId, true);
    }

}