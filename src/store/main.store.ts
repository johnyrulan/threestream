import User from "@/models/User";
import { defineStore } from "pinia";

export const useStore = defineStore('mainStore', {
    state: () => {
        return {
            currentUser: undefined,
            cameraId: undefined,
            micId: undefined,
            speakerId: undefined
        };
    },
    actions: {
        setCurrentUser(user: User) {
            this.currentUser = user;
        },
        setCameraId(cameraId: string) {
            this.cameraId = cameraId;
        },
        setMicId(micId: string) {
            this.micId = micId;
        },
        setSpeakerId(speakerId: string) {
            this.speakerId = speakerId;
        }
    },
    persist: {
        storage: localStorage
    }
})