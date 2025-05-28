<template>
<a :href="`/#/livestream/${props.livestream.id}/attend`" :class="{ 'pointer-cursor': !disabled }" class="card-container position-relative">
    <img id="mainImg" v-if="livestream?.imageUrl" autoplay loop :src="getImg()" class="rounded-4 w-full">
    <img id="mainImg" v-else autoplay loop src="@/assets/default-livestream-image.png" class="rounded-4 w-full">       

    <div class="position-absolute end-2 top-2">
        <h6 v-if="totalMembers.broadcastersCount > 0" class="live-container rounded-1 px-2 py-1 text-xs">LIVE {{ totalMembers.userCount > 0 ? totalMembers.userCount : '' }}</h6>
        <div v-else class="d-flex flex-column flex-wrap gap-1 align-items-end">
            <h6 class="date-container rounded-1 px-2 py-1 text-xs text-dark">{{ CommonHelper.formatLivestreamDate(livestream?.startTime) }}</h6>       
            <h6 v-if="totalMembers.userCount > 0" class="date-container rounded-1 px-2 py-1 text-xs text-dark">Waiting: {{ totalMembers.userCount }}</h6>               
        </div>
    </div>
   
    <div class="d-flex gap-2 align-items-center mt-2">
        <div class="d-flex gap-1 justify-content-center align-items-center">
            <UserAvatar :user="seller"/>        
        </div>
        <div class="d-flex flex-column w-3/4">
            <h5 class="text-white overflow-hidden text-nowrap text-truncate">{{ livestream?.name }}</h5>                
            <a :href="`/profile/${seller.name}`" class="text-secondary link-hover-white">{{ seller.name }}</a>
        </div>
    </div>
    <div v-if="currentUser && currentUser.role === 'Tester'">
        <a :href="`/livestream/${livestream.id}/attend-v2`" class="btn btn-primary mt-2">Alpha Test Enter</a>
    </div>
</a>
</template>

<script setup lang="ts">
import { Livestream, RoomStatistics } from "@/services/api/models";
import CommonHelper from "@/helpers/CommonHelper";
import { useRouter } from "vue-router";
import { computed } from "@vue/runtime-core";
import { onMounted, ref } from "vue";
import { RestApi } from "@/services/RestApi";
import User from "@/models/User";
import ErrorLogger from "@/helpers/ErrorLogger";
import UserAvatar from "../social/UserAvatar.vue";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";

const props = defineProps<{
    livestream: Livestream,
    disabled: boolean
}>();

const router = useRouter()
const store = useStore()

const totalMembers = ref({} as RoomStatistics)

const { currentUser } = storeToRefs(store);

const seller = ref({} as User)

async function getRoomStatistics() {
    totalMembers.value = (await RestApi.Room.getRoomStatistics(props.livestream.id))?.data;
}

function getImg() {
    return import.meta.env.VITE_AZURE_STORAGE_URL + '/livestream/' + props.livestream.imageUrl;
}

function navigateToStream() {
    if (!props.disabled) router.push({ name: 'AttendLivestream', params: { id: props.livestream.id } })
}

async function getSeller() {
    try {
        seller.value = (await RestApi.User.getUserById(props.livestream.hostUserId)).data
    } catch (err) {
        await ErrorLogger.logApiError(err)
    }
}

onMounted(async () => {
    await getSeller();
    await getRoomStatistics()
})

</script>

<style scoped>
.card-container {
    max-width: 200px;
}
#mainImg {
    aspect-ratio: 10/16;
}
.live-container {
    background-color: #BB33FF;
    width: fit-content;
}

.date-container {
    background-color: #c8e515;
    width: fit-content;
}
</style>