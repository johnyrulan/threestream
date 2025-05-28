<template>
    <div :id="`${uid}-controls`" class="vid-controls" @mouseenter="controlsIn" @mouseleave="controlsOut">
    <div class="vid-controls-wrap">
        <div class="vid-bottom-btns">
            <button class="vid-mute" @click="onMute" v-if="showMute">
                <i v-if="isMuted" class="fa fa-microphone-slash"></i>
                <i v-else class="fa fa-microphone"></i>
            </button>
            <button class="vid-pin" @click="onPin"><i class="fa fa-thumb-tack"></i></button>
            <button class="vid-full" @click="onExpand"><i class="fa fa-expand"></i></button>
        </div>
        <div class="vid-top-btns">
            <button class="vid-close" @click="onRemove" v-if="showRemove"><i class="fa fa-times-circle"></i></button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import useEmitter from "@/helpers/useEmitter";


const emitter = useEmitter();

const props = defineProps({
    uid: String,
    isMuted: Boolean,
    showRemove: Boolean,
    showMute: Boolean
});

function onMute() { 
    emitter.emit('videoControlsMute', { uid: props.uid, enableMute: !props.isMuted });
}

function onPin() {
    emitter.emit('videoControlsPin', props.uid);
}

function onExpand() {
    emitter.emit('videoControlsExpand', props.uid);
}

function onRemove() {
    emitter.emit('videoControlsRemove', props.uid);
}

function controlsIn($event: Event){
    $(`#${props.uid}-controls .vid-controls-wrap`).stop().fadeIn(300);
}

function controlsOut($event: Event){
    $(`#${props.uid}-controls .vid-controls-wrap`).stop().fadeOut(300);
}
</script>

<style scoped>

</style>