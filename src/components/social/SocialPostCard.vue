<template>
<div class="card w-full w-xxl-2/3"
    :class="[
        { 'bg-jk-special-card': props.post.socialPost.userRole === UserRole.Admin },  
        { 'bg-jk-post-card': props.post.socialPost.userRole !== UserRole.Admin },                      
    ]">
    <!-- Card Body -->
    <div class="card-body pb-0">
        <div class="d-flex align-items-center mb-7">
        <div>
            <a :href="`/profile/${user.id}`" class="avatar rounded-circle">
                <UserAvatar :user="user" />
            </a>
        </div>
        <div class="ps-3">
            <div class="text-sm">
            <a :href="`/profile/${user.id}`" class="font-bold h6 text-white">{{ props.post.socialPost.userName }}
                <span class="ms-1" v-if="props.post.socialPost.userRole === UserRole.Admin">✨</span>
                <span class="ms-1" v-else-if="props.post.socialPost.userRole === UserRole.Seller">💸</span>
                <span class="ms-1" v-else>💥</span>
            </a>
            </div>
            <small class="text-white text-xs d-block">{{ CommonHelper.formatDateAsWeekday(props.post.socialPost.created) }}</small>
        </div>
        </div>
        <p class="text-sm text-white">
            {{ props.post.socialPost.post }}
        </p>
        <div class="p-2 text-center" v-for="(img, index) in props.post.socialPost.socialPostAttributes?.images" :key="index">
            <img alt="..." class="rounded-3" :src="ImageHelper.getPostImage(img)" style="max-height: 300px;">
        </div>
        <div class="p-2 text-center" v-for="(video, index) in props.post.socialPost.socialPostAttributes?.videos" :key="index">
            <video alt="..." class="rounded-3" style="max-height: 300px;" controls autoPlay playsinline loop muted>
                <source :src="ImageHelper.getPostVideo(video)" type="video/mp4">
            </video>
        </div>        
        
    </div>
    <!-- Actions -->
    <hr class="mx-4" style="color: silver;"/>
    <div class="py-4 px-4 px-lg-4">
        <div class="d-flex align-items-center justify-content-end text-sm">
        <!-- <a href="#!" class="px-3 h6 mb-0 text-sm text-danger font-semibold d-flex align-items-center">
            <i class="bi bi-heart-fill lh-none"></i>
            <span class="ps-2 lh-none">{{ props.post.likeCount }}</span>
        </a> -->
        <a href="#!" class="px-3 h6 mb-0 text-sm font-semibold d-flex align-items-center text-white">
            <i class="bi bi-chat-square lh-none"></i>
            <span class="ps-2 lh-none">{{ props.post.comments.length }}</span>
        </a>
        <!-- <a href="#!" disabled class="px-3 h6 mb-0 text-sm font-semibold d-flex align-items-center text-muted">
            <i class="bi bi-box-arrow-up lh-none"></i>
            <span class="ps-2 lh-none">Share</span>
        </a> -->
        </div>
    </div>            
    <!-- Comments -->
    <div class="list-group list-group-flush ps-5 py-3">
        <!-- List group item -->
        <div class="list-group-item px-0 border-0 py-2" v-for="(comment, index) in props.post.comments" :key="index">
            <div class="row">
            <div class="col-auto">
                <a :href="`/profile/${CommonHelper.getUserFromSocialPost(comment).id}`" class="avatar avatar-sm rounded-circle">
                    <UserAvatar :user="CommonHelper.getUserFromSocialPost(comment)" />
                </a>
            </div>
            <div class="col ms-n3">
                <div class="text-sm">
                    <a :href="`/profile/${CommonHelper.getUserFromSocialPost(comment).id}`" class="h6 text-sm text-white">{{ comment.userName }}</a>
                </div> 
                <div class="d-flex">
                <div>
                    <span class="text-xs text-white d-block">{{ CommonHelper.formatDateAsWeekday(comment.created) }}</span>
                </div>
                </div>
                <div class="mt-2">
                <p class="text-sm mb-0 lh-150 text-white">
                    {{ comment.post }}
                </p>
                </div>
            </div>
            </div>
        </div>
    </div>            
    <!-- Card footer -->
    <div class="card-footer py-4" v-if="currentUser">
        <div class="row align-items-center">
        <div class="col-8 col-md-9 d-flex align-items-center">
            <div class="pe-3">
            <a :href="`/profile/${user.id}`" class="avatar avatar-sm rounded-circle">
                <UserAvatar :user="currentUser" />
            </a>
            </div>
            <form class="card-comment-box" role="form" @keydown.enter.prevent="saveComment">
                <input class="form-control text-white" placeholder="Add a comment..." v-model="currentComment">
            </form>
        </div>
        <div class="col-4 col-md-3 text-end">
            <div class="d-inline-flex mx-n2">
            <button class="btn btn-sm btn-secondary px-2" @click="saveComment">
                Post
            </button>                        
            <!-- <a href="#!" class="px-2 text-muted">
                <i class="bi bi-image-fill"></i>
            </a> -->
            <!-- <div class="dropdown">
                <a href="#" class="px-2 text-muted" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-three-dots-vertical text-white"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                <a class="dropdown-item" href="#">Open post</a>
                <a class="dropdown-item" href="#">Report inappropriate</a>
                <a class="dropdown-item" href="#">Get the embed code</a>
                </div>
            </div> -->
            </div>
        </div>
        </div>
    </div>
</div>

</template>

<script lang="ts" setup>
import CommonHelper from '@/helpers/CommonHelper';
import ImageHelper from '@/helpers/ImageHelper';
import LoadingHelper from '@/helpers/LoadingHelper';
import ToastHelper from '@/helpers/ToastHelper';
import { SocialPost, SocialPostType, SocialPostViewModel, UserRole, User } from '@/services/api/models';
import { RestApi } from '@/services/RestApi';
import { computed } from '@vue/reactivity';
import { DateTime } from 'luxon';
import { onMounted, ref } from 'vue';
import { useStore } from '@/store/main.store';
import UserAvatar from './UserAvatar.vue';
import { storeToRefs } from 'pinia';

const store = useStore();

const props = defineProps<{
    post: SocialPostViewModel
}>();

const emit = defineEmits<{
    (e: 'onCommentSaved'): void
}>();

const { currentUser } = storeToRefs(store);

const currentComment = ref('')

const user = ref({} as User);


async function saveComment() {
    const loader = LoadingHelper.showLoader();

    try {
        const post = {
            userId: currentUser.value.id,
            post: currentComment.value,
            postType: SocialPostType.Comment,
            parentPostId: props.post.socialPost.id,
            socialPostAttributes: {
                images: [],
                videos: []
            }      
        } as SocialPost;

        await RestApi.Social.savePost(post);

        currentComment.value = '';

        emit('onCommentSaved')
    } catch (err) {
        ToastHelper.error('There was an error saving your comment. Please try again.')
    }

    LoadingHelper.hideLoader(loader);
}

onMounted(() => {
    user.value = CommonHelper.getUserFromSocialPost(props.post.socialPost);
})

</script>

<style scoped>
::placeholder {
    color: #fff !important;
}

.bg-jk-post-card .text-white {
    color: #16192c !important;
}

.bg-jk-post-card ::placeholder {
    color: #16192c !important;
}
</style>