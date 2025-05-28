<template>
<div class="d-flex justify-content-between px-4 py-2">
    <div class="flex-1" style="width: 50%">
        <h4 class="mb-3 me-4" style="text-overflow: ellipsis; overflow: hidden; text-wrap: nowrap;">{{ livestream.name }}</h4>

    <div class="">
        <div class="d-flex align-content-center">
            <div class="d-flex pointer-cursor gap-2" @click="goToSellerProfile">
                <span class="avatar rounded-circle border">
                    <UserAvatar v-if="seller" :user="seller"/>
                </span>
                <div class="d-flex flex-column justify-content-center">
                    <h6 v-if="seller">{{ seller.name }}</h6>
                    <h6 v-if="seller">{{ followerCount }} followers</h6>
                </div>
            </div>                        
        </div>
    </div>
</div>
<div class="flex-1 d-flex flex-column gap-2">
    <div class="d-flex justify-content-end gap-2">
        <div v-if="doesCurrentUserFollow">
            <button class="btn btn-danger btn-sm" @click="followUser"><i class="bi bi-suit-heart-fill"></i></button>
        </div>
        <div v-else>
            <button class="btn btn-secondary btn-sm" @click="followUser">
                Follow
            </button>
        </div>        
        <div>
            <button class="btn btn-secondary btn-sm" @click="shareStream">
                <i class="bi bi-box-arrow-up-right"></i>
            </button>
        </div>                
    </div>
    <div class="text-end">
            <span class="badge badge-pill j-bg-primary ms-auto h-fit-content">
                <i class="bi bi-eye-fill me-1"></i> Live {{ totalMembers }}
            </span>
    </div>
</div>
</div>
<div class="d-none d-lg-block text-white rounded-1 px-3 py-2 bg-gray-800 mb-6 mx-4" vi-f="livestream.description">
    <h4>Description</h4>
    <p v-html="livestream.description"></p>
</div>
</template>

<script lang="ts" setup>
import ErrorLogger from '@/helpers/ErrorLogger';
import ToastHelper from '@/helpers/ToastHelper';
import useEmitter from '@/helpers/useEmitter';
import { toggleModal } from '@/hooks/BootstrapHooks';
import User from '@/models/User';
import { RestApi } from '@/services/RestApi';
import { Livestream } from '@/services/api/models';
import UserService from '@/services/domain/UserService';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import UserAvatar from '../social/UserAvatar.vue';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';

const props = defineProps<{
    livestream: Livestream
}>();

const store = useStore()

const router = useRouter();
let seller = ref(new User());
let totalMembers = ref(0);
const followerCount = ref(0)
const { currentUser } = storeToRefs(store);
const doesCurrentUserFollow = ref(false)

const emitter = useEmitter()

function flipColors() {
    const root: any = document.querySelector(':root');

    root.style.setProperty('--primary-color', '#00C2CB');
}

function shareStream() {
    const baseUrl = import.meta.env.VITE_URL;

    navigator.clipboard.writeText(`${baseUrl}/livestream/${props.livestream.id}/attend`);

    ToastHelper.success('Livestream URL coped to clipboard!')

    emitter.emit('LinkShared', { userName: currentUser.value.name });
}

function goToSellerProfile() {
    router.push({ name: 'UserProfile', params: { id: seller.value.id } })
}

async function getRoomStatistics() {
    totalMembers.value = (await RestApi.Room.getRoomStatistics(props.livestream.id))?.data.userCount;

    setInterval(async () => {
        totalMembers.value = (await RestApi.Room.getRoomStatistics(props.livestream.id))?.data.userCount;
    }, 30000);
}

async function followUser() {
    try {
        if (!currentUser?.value) {
            toggleModal('authModal', 'show')
            return;
        }

        if (currentUser.value.id === seller.value.id) {
            ToastHelper.warning('You cannot follow your own account')
            return;
        }

        await RestApi.Social.toggleFollow(seller.value.id)
        await getFollowerData();

        if (doesCurrentUserFollow.value) {
            emitter.emit('UserFollowed', { fromUser: currentUser.value.name, toUser: seller.value.name });
        }
    } catch (err) {
        ToastHelper.error('There was an error following the streamer. Please try again.')
    }
}

async function getFollowerData() {
    try {
        followerCount.value = (await RestApi.Social.getUserFollowers(seller.value.id)).data.length;

        if (currentUser.value) {
            doesCurrentUserFollow.value = (await RestApi.Social.doesUserFollow(seller.value.id)).data;
        }
    } catch (err) {
        await ErrorLogger.logApiError(err)
    }
}

onMounted(async () => {
    seller.value = await UserService.getUserById(props.livestream.hostUserId) ?? new User();

    await getFollowerData();

    await getRoomStatistics();
})

</script>

<style scoped>

</style>