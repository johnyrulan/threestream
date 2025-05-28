<template>
<div class="h-screen flex-grow-1">
    <div class="bg-dark">
        <div class="d-xl-flex">
            <div class="min-w-0 flex-xl-fill">
                <!-- Navbar -->
                <header>
                    <div class="container-fluid">
                        <div class="py-4">
                            <div class="row align-items-center">
                                <div class="col-sm col-12">
                                    <!-- Title -->
                                    <h1 class="h2 ls-tight text-light">
                                    {{ video.socialPost?.name }}
                                    </h1>
                                </div>
                                <!-- Actions -->
                                <div class="col-sm-auto col-12 mt-4 mt-sm-0">
                                    <div class="hstack gap-2 justify-content-sm-end">
                                    <router-link                                        
                                        :to="{ name: 'Flicks' }" class="btn btn-sm btn-secondary"
                                        role="button">
                                            <span class="pe-2"><i class="bi bi-arrow-left"></i></span>
                                        <span>Back to Flicks</span>
                                    </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <!-- Main -->
                <main class="pb-3">
                    <!-- Container -->
                    <div class="container-fluid vstack gap-3">
                        <div class="w-full text-center rounded-2 py-2" style="background-color: black;" v-if="video.socialPost">
                            <video id="videoPlayer" class="" style="max-height: 70vh;" controls playsinline  alt="..." v-if="video.socialPost.socialPostAttributes && video.socialPost.socialPostAttributes.videos.length > 0">
                                <source :src="ImageHelper.getVideo(video.socialPost.socialPostAttributes.videos[0])" type="video/mp4" />
                            </video>
                        </div>
                    </div>
                </main>
            </div>
            <div class="flex-xl-none w-xl-96 border-start-xl border-2 border-jk-primary rounded-3 bg-surface-primary h-xl-screen position-sticky top-0 shadow-3" style="--x-h-xl: 4.5rem;">
            <aside class="p-6 h-full overflow-y-xl-auto">
                <div class="vstack gap-6">
                    <div>
                        <div class="d-flex align-items-center mb-3">
                            <h5 class="me-auto text-dark">{{ video.socialPost?.name }}</h5>
                            <!-- <a @click.prevent="copyLink()" class="link-primary font-bold text-sm">
                                <i class="bi bi-clipboard-check me-2"></i>Copy link
                            </a> -->
                        </div>
                        <!-- Image -->                        
                        <div class="d-flex align-items-center my-3">
                            <div class="flex-none">
                                <span class="avatar rounded-circle border j-border-primary">
                                    <div class="w-full h-full bg-dark rounded-circle text-white text-uppercase text-center" style="padding-top: 25%" v-if="!video.socialPost?.profilePicUrl">{{ StringHelper.getFirst(video.socialPost?.userName) }}</div>
                                    <video 
                                        v-else-if="video.socialPost?.isProfilePicVideo"
                                        class="w-full h-full rounded-circle object-cover" autoplay playsinline loop muted alt="..." 
                                        :src="ImageHelper.optimizeIPFSMedia(video.socialPost?.profilePicUrl, 'video')" />
                                    <img v-else class="img-fluid rounded-circle w-full h-full" 
                                        :src="ImageHelper.optimizeIPFSMedia(video.socialPost?.profilePicUrl, 'image')" />
                                </span>
                            </div>
                            <div class="flex-fill ms-3">
                                <a :href="`/profile/${video.socialPost?.userId}`" class="text-sm text-heading mb-0">
                                    {{ video.socialPost?.userName }}
                                </a>
                            </div>
                        </div>
                        <div class="d-flex mt-3 gap-3 align-items-center">
                            <!-- <button class="btn btn-sm btn-secondary"><i class="bi bi-heart"></i> 13</button> -->
                            <button class="btn btn-sm btn-secondary " 
                                :class="{ 'opacity-70': doesLikeReactionExist }"
                                @click="toggleReaction(ReactionType.Like)">
                                <i class="bi bi-hand-thumbs-up"></i> {{ likeCount }}
                            </button>
                            <button class="btn btn-sm btn-secondary" 
                                :class="{ 'opacity-70': doesDislikeReactionExist }"
                                @click="toggleReaction(ReactionType.Dislike)">
                                <i class="bi bi-hand-thumbs-down"></i> {{ dislikeCount }}
                            </button>                            
                            <div class="font-semibold">{{ viewCount }} Views</div>
                        </div>
                        <!-- Title -->
                        <!-- <h6 class="text-muted font-semibold mb-3">Description</h6> -->
                        <!-- Text -->
                        <!-- <p class="text-sm mb-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p> -->
                        <ul class="nav nav-tabs" id="nft-tab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" href="#"
                                    data-bs-toggle="tab" data-bs-target="#nav-flicks"
                                    role="tab" aria-controls="nav-flicks">
                                    🎥 Flicks
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#"
                                    data-bs-toggle="tab" data-bs-target="#nav-comments"
                                    role="tab" aria-controls="nav-comments">
                                    🔥 Comments
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#"
                                    data-bs-toggle="tab" data-bs-target="#nav-about"
                                    role="tab" aria-controls="nav-about">
                                    📜 About
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="tab-content" id="nftTabContent">
                        <div class="tab-pane fade show active pb-5" id="nav-flicks" role="tabpanel" aria-labelledby="flicks-tab" tabindex="0">
                            <div class="d-flex flex-column gap-3">
                                <FlickHorizontalCard v-for="(video, index) in recommendedVideos" :key="index" :video="video"/>
                            </div>                                                      
                        </div>
                        <div class="tab-pane fade pb-5" id="nav-comments" role="tabpanel" aria-labelledby="comments-tab" tabindex="0">
                            <div class="d-flex gap-2 flex-wrap">
                                <div class="col-8 col-md-9 d-flex align-items-center">
                                    <div class="pe-3">
                                        <a :href="`/profile/${currentUser.id}`" class="avatar avatar-sm rounded-circle" v-if="currentUser">
                                            <UserAvatar :user="currentUser" />
                                        </a>
                                    </div>
                                    <form class="card-comment-box" role="form" @keydown.enter.prevent="saveComment">
                                        <input class="form-control" placeholder="Add a comment..." v-model="currentComment">
                                    </form>
                                </div>                                
                            </div>
                            <button class="btn btn-sm btn-primary mt-2" @click="saveComment">
                                Post
                            </button>         
                            <div class="list-group-item px-0 border-0 py-2 mt-3" v-for="(comment, index) in video.comments" :key="index">
                                <div class="row">
                                <div class="col-auto">
                                    <a :href="`/profile/${CommonHelper.getUserFromSocialPost(comment).id}`" class="avatar avatar-sm rounded-circle">
                                        <UserAvatar :user="CommonHelper.getUserFromSocialPost(comment)" />
                                    </a>
                                </div>
                                <div class="col ms-n3">
                                    <div class="text-sm">
                                        <a :href="`/profile/${CommonHelper.getUserFromSocialPost(comment).id}`" class="h6 text-sm">{{ comment.userName }}</a>
                                    </div> 
                                    <div class="d-flex">
                                    <div>
                                        <span class="text-xs d-block">{{ CommonHelper.formatDateAsWeekday(comment.created) }}</span>
                                    </div>
                                    </div>
                                    <div class="mt-2">
                                    <p class="text-sm mb-0 lh-150">
                                        {{ comment.post }}
                                    </p>
                                    </div>
                                </div>
                                </div>
                            </div>                                                        
                        </div>
                        <div class="tab-pane fade" id="nav-about" role="tabpanel" aria-labelledby="about-tab" tabindex="0">
                            <p class="text-sm"><span v-html="video.socialPost?.description"></span></p>
                        </div>
                    </div>
                </div>
            </aside>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import { Reaction, ReactionObjectType, ReactionType, SocialPost, SocialPostType, SocialPostViewModel } from '@/services/api/models';
import { computed, onMounted, ref } from 'vue';
import CommonHelper from '@/helpers/CommonHelper';
import { RestApi } from '@/services/RestApi';
import { useRoute } from 'vue-router';
import ToastHelper from '@/helpers/ToastHelper';
import ImageHelper from '@/helpers/ImageHelper';
import Plyr from 'plyr'
import 'plyr/dist/plyr.css';
import StringHelper from '@/helpers/StringHelper';
import { useStore } from '@/store/main.store';
import LoadingHelper from '@/helpers/LoadingHelper';
import UserAvatar from '@/components/social/UserAvatar.vue';
import { toggleModal } from '@/hooks/BootstrapHooks';
import eventBus from '@/events/EventBus';
import FlickHorizontalCard from '@/components/social/FlickHorizontalCard.vue';
import { storeToRefs } from 'pinia';

const store = useStore()
const route = useRoute();

const { currentUser } = storeToRefs(store);

const videoId = route.params.id as string;

const video = ref({} as SocialPostViewModel)

async function getVideo() {
    try {
        video.value = (await RestApi.Social.getByPostId(videoId)).data
    } catch (err) {
        ToastHelper.error('There was an error fetching your video. Please try again.')
    }
}

const likeCount = ref(0)
const dislikeCount = ref(0)
const viewCount = ref(0)

async function getReactionCounts() {
    try {
        likeCount.value = (await RestApi.Social.getReactionCount(videoId, ReactionType.Like)).data;
        dislikeCount.value = (await RestApi.Social.getReactionCount(videoId, ReactionType.Dislike)).data;
        viewCount.value = (await RestApi.Social.getReactionCount(videoId, ReactionType.View)).data;
    } catch (err) {

    }
}

const doesLikeReactionExist = ref(false)
const doesDislikeReactionExist = ref(false)

async function getReactionExists() {
    try {
        doesLikeReactionExist.value = (await RestApi.Social.doesReactionExist(videoId, ReactionType.Like)).data;
        doesDislikeReactionExist.value = (await RestApi.Social.doesReactionExist(videoId, ReactionType.Dislike)).data;        
    } catch (err) {

    }
}

async function toggleReaction(reactionType: ReactionType) {
    if (!currentUser.value) {
        toggleModal('authModal', 'show');
        return;
    }

    try {
        const reaction: Reaction = {
            objectId: videoId,
            reactionObjectType: ReactionObjectType.Flick,
            reactionType: reactionType
        }

        await RestApi.Social.toggleReaction(reaction)

        await getReactionExists()
        await getReactionCounts()
    } catch (err) {
        ToastHelper.error('There was an error saving the reaction. Please try again.')
    }
}

const currentComment = ref('')

async function saveComment() {
    if (!currentUser.value) {
        toggleModal('authModal', 'show');
        return;
    }

    const loader = LoadingHelper.showLoader();

    try {
        const post = {
            userId: currentUser.value.id,
            post: currentComment.value,
            postType: SocialPostType.Comment,
            parentPostId: videoId,
            socialPostAttributes: {
                images: [],
                videos: []
            }      
        } as SocialPost;

        await RestApi.Social.savePost(post);
        
        currentComment.value = '';        

        await getVideo();
    } catch (err) {
        ToastHelper.error('There was an error saving your comment. Please try again.')
    }

    LoadingHelper.hideLoader(loader);
}

function viewTimer() {
    setTimeout(async () => {
        if (currentUser.value.id !== video.value?.socialPost?.userId)
            await toggleReaction(ReactionType.View)
    }, 10000)
}

const recommendedVideos = ref([] as SocialPostViewModel[])

async function getRecommendedVideos() {
  try {
    const allFlicks = (await RestApi.Social.getLatestPosts(SocialPostType.Flick)).data;

    while (recommendedVideos.value.length < 5) {
        const randomVideo = allFlicks[Math.floor(Math.random()*allFlicks.length)];

        const videoExists = recommendedVideos.value.filter(v => v.socialPost?.id === randomVideo?.socialPost?.id).length > 0;

        if (randomVideo.socialPost?.id !== videoId && !videoExists) {
            recommendedVideos.value.push(randomVideo)
        }
    }
  } catch (err) {
    ToastHelper.error('There was an error retreiving flicks. Please try again.')
  }    
}


eventBus.on('onLogin', async () => {
    viewTimer()
})

onMounted(async () => {
    await getVideo()

    const videoEl = document.getElementById('videoPlayer')
    const player = new Plyr(videoEl, { }) 
          
    await getReactionExists()
    await getReactionCounts()
    await getRecommendedVideos()

    if (currentUser.value) {
        viewTimer()
    }
    // else {        
    //     toggleModal('authModal', 'show');
    // }
})

</script>

<style scoped>

</style>