import { BroadcasterRole, BroadcasterCodec, BroadcasterType } from '@/enums/BroadcasterEnums';
import AgoraRTC, { CameraVideoTrackInitConfig, ClientConfig, IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, ILocalVideoTrack, IMicrophoneAudioTrack, MicrophoneAudioTrackInitConfig, ScreenVideoTrackInitConfig, UID } from 'agora-rtc-sdk-ng';

export default class AgoraBroadcasterService {
    private readonly appId: string;

    private readonly role: BroadcasterRole;

    private readonly codec: BroadcasterCodec;

    private readonly broadcasterType: BroadcasterType;

    private onStreamPublishedFunc: Function;

    private onStreamUnPublishedFunc: Function;

    public client?: IAgoraRTCClient = undefined;

    public localVideoTrack?: ICameraVideoTrack;

    public localAudioTrack?: IMicrophoneAudioTrack;

    public localScreenTrack?: ILocalVideoTrack;

    public localUid = '';

    public screenShareUid = '';

    constructor(role: BroadcasterRole,
      codec = BroadcasterCodec.H264,
      type: BroadcasterType,
      appId: string,
      onStreamPublishedFunc: Function,
      onStreamUnpublishedFunc: Function) {
      this.role = role;
      this.codec = codec;
      this.broadcasterType = type;
      this.appId = appId;
      this.onStreamPublishedFunc = onStreamPublishedFunc;
      this.onStreamUnPublishedFunc = onStreamUnpublishedFunc;

      this.initializeClient();
    }

    private initializeClient() {
      if (this.client) return;

      const config: ClientConfig = {
        mode: 'live',
        codec: 'h264',
      };

      this.client = AgoraRTC.createClient(config);

      this.bindClientCallbacks();
      this.setClientRole();
    }

    private bindClientCallbacks() {
      if (!this.client) return;

      // this.client.on('stream-subscribed', (evt) => this.onStreamSubscribed(evt));
      // this.client.on('stream-added', (evt) => this.onStreamAdded(evt));
      // this.client.on('stream-published', (evt) => this.onStreamPublished(evt));
      // this.client.on('stream-unpublished', (evt) => this.onStreamEnded(evt));
      // this.client.on('stream-removed', (evt) => this.onStreamEnded(evt));
      // this.client.on('peer-leave', (evt) => this.onStreamEnded(evt));

      // this.client.on('mute-audio', (evt) => this.toggleMuteAudio(evt, true));
      // this.client.on('unmute-audio', (evt) => this.toggleMuteAudio(evt, false));

      // this.client.on('mute-video', (evt) => this.toggleMuteVideo(evt, true));
      // this.client.on('unmute-video', (evt) => this.toggleMuteVideo(evt, false));

      this.client.on('user-joined', (user: IAgoraRTCRemoteUser) => { this.onUserJoined(user) });
      this.client.on('user-left', (user: IAgoraRTCRemoteUser) => { this.onUserLeft(user) });

      this.client.on('user-published', (user: IAgoraRTCRemoteUser, mediaType) => { this.onStreamPublished(user, mediaType) });
      this.client.on('user-unpublished', (user: IAgoraRTCRemoteUser, mediaType) => { this.onStreamUnpublished(user, mediaType) });

      this.client.on('user-info-updated', (uid: UID, msg) => { this.onUserEvent(uid, msg) });
    }

    private setClientRole() {
      if (!this.client) return;

      const clientRole = this.role === BroadcasterRole.Presenter ? 'host' : 'audience';

      // TODO (johnyrulan): Handle error with common error logger
      this.client.setClientRole(clientRole);
    }

    public async joinChannel(channel: string, token: string, userId: string) {
      if (!this.client) return;

      try {
        await this.client.join(this.appId, channel, token, userId);
        this.localUid = userId;
      }
      catch (err) {
        // Common error logger
        console.error(err);
      }
    }

    public async leaveChannel() {
      try {
        if (this.localVideoTrack) {
          await this.unpublishLocalAudio();
          this.localVideoTrack.close();
        }
        if (this.localAudioTrack) {
          await this.unpublishLocalVideo();
          this.localAudioTrack.close();
        }
        if (this.localScreenTrack) {
          await this.stopScreenShare();
          this.localScreenTrack.close();
        }
        await this.client?.leave();
      }
      catch (err) {
        // Common error logger
        console.error(err);
      }
    }

    public async createLocalTracks(cameraId: string, micId: string) {
      try {
        const audioConfig: MicrophoneAudioTrackInitConfig = {
          microphoneId: micId
        };

        const cameraConfig: CameraVideoTrackInitConfig = {
          cameraId: cameraId
        };

        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, cameraConfig);
        this.localAudioTrack = localTracks[0];
        this.localVideoTrack = localTracks[1];
      }
      catch (err) {
        // Common error logger
        console.error(err);
      }
    }

    public async changeTrack(cameraId: string, micId: string) {
      try {
        await this.localVideoTrack?.setDevice(cameraId);
        await this.localAudioTrack?.setDevice(micId);
      } catch (err) {
        console.error(err)
      }
    }

    public async createScreenShareTrack() {
      try {
        const config: ScreenVideoTrackInitConfig = {
          encoderConfig: "1080p_2"
        }

        const screenshareTrack = await AgoraRTC.createScreenVideoTrack(config, "disable");

        this.localScreenTrack = screenshareTrack;
      }
      catch (err) {
        // Common error logger
        console.error(err);
      }
    }

    private onUserJoined(user: IAgoraRTCRemoteUser) {
      // this.renderFunc();
    }

    private onUserLeft(user: IAgoraRTCRemoteUser) {
      // this.renderFunc();
    }

    private onUserEvent(uid: UID, msg: "mute-audio" | "mute-video" | "enable-local-video" | "unmute-audio" | "unmute-video" | "disable-local-video") {
      // this.renderFunc();

      // if (msg === "unmute-video") this.videoRenderer.addVideoStream();
      // else if (msg === "mute-video") this.videoRenderer.removeVideoStream();
      // else if (msg === "enable-local-video") this.videoRenderer.addVideoStream();
      // else if (msg === "disable-local-video") this.videoRenderer.removeVideoStream();
      // else if (msg === "unmute-audio") this.videoRenderer.addAudioStream();
      // else if (msg === "mute-audio") this.videoRenderer.removeAudioStream();
    }

    private async onStreamPublished(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") {
      try {
        await this.client?.subscribe(user, mediaType);

        await this.onStreamPublishedFunc(user, mediaType);
      }
      catch (err) {
        // common error logger
        console.error(err);
      }
    }

    private async onStreamUnpublished(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") {
      try {
        await this.client?.unsubscribe(user, mediaType);

        await this.onStreamUnPublishedFunc(user, mediaType);
      }
      catch (err) {
        // common error logger
        console.error(err);
      }
    }

    public async publishLocalVideo() {
      try {
        if (this.localVideoTrack) await this.client?.publish(this.localVideoTrack);
      }
      catch (err) {
        // common error logger
        console.error(err);
      }
    }

    public async unpublishLocalVideo() {
      try {
        if (this.localVideoTrack) await this.client?.unpublish(this.localVideoTrack);
      }
      catch (err) {
        // common error logger
        console.error(err);
      }
    }

    public async publishLocalAudio() {
      try {
        if (this.localAudioTrack) await this.client?.publish(this.localAudioTrack);
      }
      catch (err) {
        // common error logger
        console.error(err);
      }
    }

    public async unpublishLocalAudio() {
      try {
        if (this.localAudioTrack) await this.client?.unpublish(this.localAudioTrack);
      }
      catch (err) {
        // common error logger
        console.error(err);
      }
    }

    public async startScreenShare() {
      try {
        if (this.localScreenTrack) await this.client?.publish(this.localScreenTrack);
      }
      catch (err) {
        // common error logger
        console.error(err);
      }
    }

    public async stopScreenShare() {
      try {
        if (this.localScreenTrack) await this.client?.unpublish(this.localScreenTrack);
      }
      catch (err) {
        // common error logger
        console.error(err);
      }
    }

    static getCameras() {
      return AgoraRTC.getCameras(false);
    }

    static getMicrophones() {
      return AgoraRTC.getMicrophones(false);
    }

    static getSpeakers() {
      return AgoraRTC.getPlaybackDevices(false);
    }

    // Virtual Background
    public async registerVirtualBackgroundExtension() {

    }

    public async addVirtualBackground() {

    }

    public async removeVirtualBackground() {
      
    }

    // End Virtual Background
}