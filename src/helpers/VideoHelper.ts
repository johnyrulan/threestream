import $ from 'jquery';

export default class VideoHelper {
    static baseUrl = import.meta.env.VITE_AZURE_STORAGE_URL;

    static generateNamePill(name: string, isMuted: boolean, isHost = false): HTMLElement {
        const namePillEl = document.createElement('div');
        namePillEl.classList.add('vid-pills', 'font-bold', 'order-0');

        // if (isHost) {
        //     const rolePillSpan = document.createElement('span');
        //     rolePillSpan.classList.add('role-pill');
        //     rolePillSpan.textContent = 'Host - ';

        //     namePillEl.appendChild(rolePillSpan);
        // }

        const namePillSpan = document.createElement('span');
        namePillSpan.classList.add('name-pill');
        namePillSpan.textContent = name;

        namePillEl.appendChild(namePillSpan);

        return namePillEl;
    }

    static addMuteIcon(uid: string) {
        $(`#${uid} .name-pill`).prepend('<i class="bi bi-mic-mute-fill"></i>');
    }

    static removeMuteIcon(uid: string) {
        $(`#${uid} .name-pill i`).remove();
    }

    static getLivestreamMedia(livestreamId: string, mediaUrl: string) {
        if (!livestreamId || !mediaUrl) return '';

        const url = `${this.baseUrl}/livestream/${mediaUrl}`;

        return url;
    }
}