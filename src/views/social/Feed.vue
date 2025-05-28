<template>
<div class="bg-dark overflow-x-hidden">
<div class="d-xl-flex">
    <div class="min-w-0 flex-xl-fill">
    <!-- Navbar -->
    <header>
        <div class="container-fluid px-xl-16">
            <!-- <header>
            <div class="container-fluid mx-0 px-0">
                <div class="pt-6">
                <div class="row align-items-center">
                    <div class="col-12 mb-4 mb-sm-0">

                    <h1 class="h2 ls-tight text-white">
                        Latest Marketplace Listings <i class="bi bi-shop text-danger"></i>
                    </h1>
                    </div>
                </div>
                </div>
            </div>
            </header>

            <div class="py-6 rounded-3 bg-dark d-flex gap-4 overflow-x-scroll">
                <MarketplaceNFTCard class="flex-shrink-0" v-for="sale in latestSales" :key="sale.id" :sale="sale" :sale-assets="sale.saleAssets"/>
            </div>   -->
        <div class="pt-6">
            <div class="row align-items-center">
            <div class="col-sm col-12 text-center">
                <!-- Title -->
                <h1 class="h2 ls-tight">Feeds <i class="bi bi-newspaper text-info"></i>
                </h1>
                <p class="text-sm mb-3 text-white">
                The JUNKIE Feed is your one-stop-shop news feed across all Collectibles!
                </p>
                <p class="text-sm font-italic text-info">
                    Feeds is an alpha feature release. There will be new additions in the next few days. Enjoy & please give any helpful feedback!
                </p>
            </div>
            <!-- Actions -->
            <div class="col-sm-auto col-12 mt-4 mt-sm-0">
                <div class="hstack gap-2 justify-content-sm-end">
                <!-- <a href="#modalExport" class="btn btn-sm btn-neutral border-base" data-bs-toggle="modal">
                    <span class="pe-2">
                    <i class="bi bi-people-fill"></i>
                    </span>
                    <span>Share</span>
                </a> -->
                </div>
            </div>
            </div>
        </div>
        </div>
    </header>
    <!-- Main -->
    <main class="py-6">
        <!-- Modal -->
        <div class="modal fade" id="modalExport" tabindex="-1" aria-labelledby="modalExport" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-3">
            <div class="modal-header">
                <div class="icon icon-shape rounded-3 bg-soft-primary text-primary text-lg me-4">
                <i class="bi bi-globe"></i>
                </div>
                <div>
                <h5 class="mb-1">Share to web</h5>
                <small class="d-block text-xs text-muted">Publish and share link with anyone</small>
                </div>
                <div class="ms-auto">
                <div class="form-check form-switch me-n2">
                    <input class="form-check-input" type="checkbox" id="switchShareToWeb" checked>
                    <label class="form-check-label" for="switchShareToWeb"></label>
                </div>
                </div>
            </div>
            <div class="modal-body">
                <!-- Text -->
                <div class="d-flex align-items-center mb-5">
                <div>
                    <p class="text-sm">
                    Anyone with this link <span class="font-bold text-heading">can view</span>
                    </p>
                </div>
                <div class="ms-auto">
                    <a href="#" class="text-sm font-semibold">Settings</a>
                </div>
                </div>
                <!-- Form group -->
                <div>
                <div class="input-group input-group-inline">
                    <input type="email" class="form-control" placeholder="username" value="https://clever.io/your-amazing-link">
                    <span class="input-group-text">
                    <i class="bi bi-clipboard"></i>
                    </span>
                </div>
                <span class="mt-2 valid-feedback">Looks good!</span>
                </div>
            </div>
            <div class="modal-footer">
                <div class="me-auto">
                <a href="#" class="text-sm font-semibold"><i class="bi bi-clipboard me-2"></i>Copy link</a>
                </div>
                <button type="button" class="btn btn-sm btn-neutral" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-sm btn-success">Share file</button>
            </div>
            </div>
        </div>
        </div>
        <!-- Container -->
        <div class="d-flex px-8 px-xl-16 vstack gap-3 align-items-center">
            <div class="card border-2 border-jk-primary w-full w-xxl-2/3">
                <!-- Card Body -->
                <div class="card-body">
                    <h5 class="card-title mb-7 text-dark">New post</h5>
                    <div class="d-flex align-items-center">
                    <div>
                        <a href="#" class="avatar rounded-circle">
                            <UserAvatar :user="currentUser" />
                        </a>
                    </div>
                    <div class="ps-3">
                        <h6 class="mb-1 font-semibold text-dark">{{ currentUser.name }}</h6>
                        <!-- <div class="dropdown">
                        <button class="btn btn-sm px-2 py-1 text-xs btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-people-fill me-1"></i>Friends
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                        </div> -->
                    </div>
                    </div>
                    <form class="mt-7">
                        <div class="textarea-autosize pb-4" @click="(showEmojiPicker = false)">
                            <textarea v-model="currentPost" class="form-control border-0 shadow-none p-0" rows="4" resize="none" placeholder="What's on your mind?" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
                        </div>
                    </form>
                    <div class="d-flex mx-n2 justify-content-center">
                        <div class="mx-2 position-relative">
                            <img alt="..." class="w-16 card-img" v-for="(img, index) in postImages" :key="index" :src="ImageHelper.getPostImage(img)" />
                            <!-- <button class="btn btn-square btn-neutral rounded-circle text-xs w-6 h-6 position-absolute top-0 start-0 transform translate-x-n1/2 translate-y-n1/2">
                            <i class="bi bi-trash"></i>
                            </button> -->
                        </div>
                        <!-- <div class="ms-auto">
                            <a href="#" class="btn btn-square btn-outline-primary card-img border-2 text-xl border-dashed w-16 h-16">
                            <i class="bi bi-plus"></i>
                            </a>
                        </div> -->
                    </div>
                    <div class="d-flex mx-n2 justify-content-center">
                        <div class="mx-2 position-relative">
                            <video alt="..." class="rounded-3" v-for="(video, index) in postVideos" :key="index" controls autoPlay playsinline loop muted style="max-height: 300px;">
                                <source :src="ImageHelper.getPostVideo(video)" type="video/mp4">
                            </video>
                            <!-- <button class="btn btn-square btn-neutral rounded-circle text-xs w-6 h-6 position-absolute top-0 start-0 transform translate-x-n1/2 translate-y-n1/2">
                            <i class="bi bi-trash"></i>
                            </button> -->
                        </div>
                        <!-- <div class="ms-auto">
                            <a href="#" class="btn btn-square btn-outline-primary card-img border-2 text-xl border-dashed w-16 h-16">
                            <i class="bi bi-plus"></i>
                            </a>
                        </div> -->
                    </div>
                    <hr class="my-5" />
                    <div class="d-flex align-items-center">
                    <div class="flex-fill d-flex align-items-center">
                        <h6 class="font-semibold mb-0 text-dark">Add to your post</h6>
                    </div>
                    <div class="text-end">
                        <div class="d-inline-flex align-items-center">
                        <input id="post_image_upload" name="post_image_upload" type="file" class="visually-hidden"
                                @change="onImageUpload($event)">
                        <button class="px-2 text-lg link-primary bg-white"
                            @click="onImageUploadClick"
                            data-bs-trigger="hover focus"
                            data-bs-toggle="popover"
                            data-bs-placement="top"
                            data-bs-content="Upload an Image"
                        >
                            <i class="bi bi-images"></i>
                        </button>
                        <input id="post_video_upload" name="post_video_upload" type="file" class="visually-hidden"
                                @change="onVideoUpload($event)">
                        <button class="px-2 text-lg link-info bg-white"
                            @click="onVideoUploadClick"
                            data-bs-trigger="hover focus"
                            data-bs-toggle="popover"
                            data-bs-placement="top"
                            data-bs-content="Upload a Video"
                        >
                            <i class="bi bi-film"></i>
                        </button>
                        <button class="px-2 text-lg link-danger bg-white"
                            @click="AnalyticsService.track('feed_audio_spaces', currentUser)"
                            data-bs-trigger="hover focus"
                            data-bs-toggle="popover"
                            data-bs-placement="top"
                            data-bs-content="Audio Spaces (Coming Soon)"
                        >
                            <i class="bi bi-vinyl-fill"></i>
                        </button>
                        <button class="px-2 text-lg link-success bg-white"
                            @click="AnalyticsService.track('feed_go_live', currentUser)"
                            data-bs-trigger="hover focus"
                            data-bs-toggle="popover"
                            data-bs-placement="top"
                            data-bs-content="Go Live (Coming Soon)"
                        >
                            <i class="bi bi-camera-reels"></i>
                        </button>
                        <button @click="(showEmojiPicker = !showEmojiPicker)"
                        class="px-2 text-lg link-tertiary bg-white"
                            data-bs-trigger="hover focus"
                            data-bs-toggle="popover"
                            data-bs-placement="top"
                            data-bs-content="Emojis"
                        >
                            <i class="bi bi-emoji-smile"></i>
                            <EmojiPicker id="popover-content" v-show="showEmojiPicker"
                                :native="true"
                                @select="selectEmoji"
                                class="popover-emoji"/>
                        </button>
                        <button class="px-2 text-lg link-warning bg-white"
                            @click="AnalyticsService.track('feed_promote_listing', currentUser)"
                            data-bs-trigger="hover focus"
                            data-bs-toggle="popover"
                            data-bs-placement="top"
                            data-bs-content="Prmote your NFT Listing (Premium Feature Coming Soon)"
                        >
                            <i class="bi bi-tag-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-primary ms-3" @click="savePost">Post</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <h3 class="text-warning font-italic">We're excited to announce</h3>
            <div class="mb-3 d-flex flex-wrap flex-md-nowrap gap-4 justify-content-center pb-6 w-xxl-2/3">
                <div class="card border-2 border-jk-primary rounded-3 flex-shrink-0 bg-jk-champion" style="width: 350px;max-height: 750px;">
                    <!-- Cover -->
                    <div class="p-2 text-center">
                        <!-- <img alt="..." src="@/assets/featured_sellers/mike_champion.png" class="card-img" style="max-width:300px; max-height: 400px;"> -->
                    </div>
                    <!-- Profile Image -->
                    <div class="transform mx-auto translate-y-n1/2" style="margin-top: 25%">
                        <a href="#" class="text-white">
                        <img alt="..." src="https://media.discordapp.net/attachments/1007104215547658353/1070391456000380958/Junkie_Video_Icon_Sample_3.png">
                        </a>
                    </div>
                    <!-- Card Body -->
                    <div class="card-body text-white pb-4 pt-1 mt-n10">
                        <!-- Title -->
                        <h5 class="h4 mb-1 text-center text-white text-wrap">JUNKIE Flicks</h5>
                        <div class="text-center">
                            <p class="text-white">
                                You can now watch exclusive video content 
                                from your favorite JUNKIE creators uploaded weekly! These are longer form content
                                meant to entertain & educate the community! 
                            </p>
                            <router-link :to="{ name: 'Flicks' }" class="btn btn-lg btn-secondary mt-3">Start Watching Now <i class="bi bi-fast-forward-circle-fill ms-2 font-lg"></i></router-link>
                        </div>
                    </div>
                </div> 
                <!-- <div class="card border-2 border-jk-primary rounded-3 flex-shrink-0 bg-jk-champion mt-3 mt-md-0" style="width: 350px;max-height: 750px;">

                    <div class="p-2 text-center">
                    </div>

                    <div class="transform mx-auto translate-y-n1/2" style="margin-top: 25%">
                        <a href="#" class="text-white">
                        <img alt="..." src="https://media.discordapp.net/attachments/1007104215547658353/1070391456000380958/Junkie_Video_Icon_Sample_3.png">
                        </a>
                    </div>

                    <div class="card-body text-white pb-4 pt-1 mt-n10">
                        <h5 class="h4 mb-1 text-center text-white text-wrap">JUNKIE Snips</h5>
                        <div class="text-center">
                            <p class="text-white">
                                Snips are short-form videos uploaded by JUNKIE creators 
                                daily! If you follow creators & members on JUNKIE,
                                you can watch hilariously funny, entertaining, & engaging
                                short videos
                            </p>
                            <a href="https://7bf13qngjg9.typeform.com/to/E6HfBTrd" target="_blank" class="btn btn-lg btn-secondary mt-3">Start watching Snips <i class="bi bi-lightning-fill ms-2 font-lg"></i></a>
                        </div>
                    </div>
                </div>               -->
                <div class="card border-2 border-jk-primary rounded-3 flex-shrink-0 bg-jk-champion mt-3 mt-md-0" style="width: 350px;max-height: 750px;">
                    <!-- Cover -->
                    <div class="p-2 text-center">
                        <!-- <img alt="..." src="@/assets/featured_sellers/mike_champion.png" class="card-img" style="max-width:300px; max-height: 400px;"> -->
                    </div>
                    <!-- Profile Image -->
                    <div class="transform mx-auto translate-y-n1/2" style="margin-top: 25%">
                        <a href="#" class="text-white">
                        <img alt="..." style="max-height: 100px" src="https://media.discordapp.net/attachments/1007104215547658353/1070715073162641468/Junkie_Collections_Icon_v2.png">
                        </a>
                    </div>
                    <!-- Card Body -->
                    <div class="card-body text-white pb-4 pt-1 mt-n10">
                        <!-- Title -->
                        <h5 class="h4 mb-1 text-center text-white text-wrap">JUNKIE Collections</h5>
                        <div class="text-center">
                            <p class="text-white">
                                Add your collectibles in JUNKIE & track real-time prices
                                for your collectibles. You'll be able to scan your collectibles by barcode
                                & see a Live graph of your collection's value based on sale data
                                collected across major marketplaces.
                            </p>
                            <button data-bs-toggle="modal" data-bs-target="#request-access-modal" class="btn btn-lg btn-secondary mt-3">Request Early Access <i class="bi bi-lightning-fill ms-2 font-lg"></i></button>
                        </div>
                        <!-- <hr class="mt-7" />
                        <div class="row align-items-center">
                        <div class="col-6">
                            <button type="button" class="btn btn-sm btn-neutral">
                            Message
                            </button>
                        </div>
                        <div class="col-6 text-end">
                            <button type="button" class="btn btn-sm btn-primary">
                            Follow
                            </button>
                        </div>
                        </div> -->
                    </div>
                </div>                      
            </div>                                             
            <!-- Social Card -->
            <SocialPostCard v-for="(post, index) in latestPosts" :key="index" :post="post" @on-comment-saved="getLatestPosts" />

        </div>
    </main>
    </div>
    <div class="flex-xl-none w-xl-96 bg-dark h-xl-calc position-sticky top-xl-18" style="--x-h-xl: 4.5rem;">
    <aside class="p-8 h-full overflow-y-xl-auto">
        <div class="vstack gap-6">
        <div>
            <div class="d-flex align-items-center mb-3">
            <!-- <h5 class="me-auto">Welcome to the JUNKIE Feed!</h5> -->
            </div>
            <!-- Text -->
            <!-- Title -->
            <!-- <h6 class="text-white font-semibold mb-3">Tags</h6> -->
            <!-- Tags -->
            <!-- <div class="d-flex gap-2 flex-wrap">
            <a href="#" class="bg-white border rounded px-3 py-1 font-semibold text-heading text-xs">Project</a>
            </div> -->
        </div>
        </div>
    </aside>
    </div>
</div>
</div>
<div class="modal fade" id="request-access-modal" tabindex="-1" aria-labelledby="request-access-modal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content shadow-4">
      <div class="modal-body">
        <div class="text-center py-5 px-5">
          <!-- Icon -->
          <div class="icon icon-shape rounded-circle bg-opacity-30 bg-success text-success text-lg">
            <i class="bi bi-check-square-fill"></i>
          </div>
          <!-- Title -->
          <h3 class="mt-7 mb-4">Get Early Access to JUNKIE Collections!</h3>
          <!-- Text -->
          <p class="text-sm text-muted">
            Follow 3 easy steps to get in the early access waitlist:
          </p>

          <p class="mt-2">
            ✅ Step 1: Follow us on Instagram: <a href="https://www.instagram.com/junkie_app/" target="_blank">@junkie_app</a>
          </p>
          <p class="mt-2">
            ✅ Step 2: Like & Comment on 5 of our Instagram Posts saying that you'd like early access to JUNKIE Collections (make sure to mention your JUNKIE Name)
          </p>
          <p class="mt-2">
            ✅ Step 3: Tag 5 friends on our Instagram posts
          </p>

          <p class="mt-2">
            ✅ Bonus (moves you up the waitlist): Have one of your friends join JUNKIE & make their first post on the Feed saying that they were referred by you.
          </p>

          <p class="text-sm text-muted mt-2">
            Currently there are 58 users ahead of you. We will reach out to you as soon as your waitlist spot opens up for JUNKIE Collections! 
          </p>
        </div>
      </div>
      <div class="modal-footer">
        <!-- <button type="button" class="btn btn-sm btn-neutral" data-bs-dismiss="modal">Cancel</button> -->
        <button type="button" class="btn btn-sm btn-success" data-bs-dismiss="modal">Ok</button>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import MarketplaceNFTCard from '@/components/marketplace/MarketplaceNFTCard.vue';
import LoadingHelper from '@/helpers/LoadingHelper';
import ToastHelper from '@/helpers/ToastHelper';
import { MarketplaceFilterRequest, MarketplaceSale, SocialPost, SocialPostType, SocialPostViewModel } from '@/services/api/models';
import MarketplaceService from '@/services/domain/MarketplaceService';
import { RestApi } from '@/services/RestApi';
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@/store/main.store';
import SocialPostCard from '@/components/social/SocialPostCard.vue';
import EmojiPicker from 'vue3-emoji-picker';
import { initializePopover } from '@/hooks/BootstrapHooks';
import UserAvatar from '@/components/social/UserAvatar.vue';
import AnalyticsService from '@/services/AnalyticsService';
import { UploadType } from '@/enums/CommonEnums';
import ErrorLogger from '@/helpers/ErrorLogger';
import { v4 as uuidv4 } from 'uuid';
import ImageHelper from '@/helpers/ImageHelper';
import { storeToRefs } from 'pinia';

const store = useStore()

const { currentUser } = storeToRefs(store);

const showEmojiPicker = ref(false)

const latestSales = ref([] as MarketplaceSale[]);

async function getSales() {
   const sales = await MarketplaceService.getSales({ page: 1 } as MarketplaceFilterRequest);
   latestSales.value = sales.marketplaceSales.slice(0, 9);
}

const latestPosts = ref([] as SocialPostViewModel[])

async function getLatestPosts() {
    latestPosts.value = (await RestApi.Social.getLatestPosts(SocialPostType.Post)).data;
}

const currentPost = ref('');

async function savePost() {
    const loader = LoadingHelper.showLoader();

    try {
        const post = {
            userId: currentUser.value.id,
            post: currentPost.value,
            postType: SocialPostType.Post,
            socialPostAttributes: {
                images: postImages.value,
                videos: postVideos.value
            }
        } as SocialPost;

        await RestApi.Social.savePost(post);

        currentPost.value = '';
        postImages.value = [];
        postVideos.value = [];

        await getLatestPosts();
    } catch (err) {
        ToastHelper.error('There was an error saving your post. Please try again.')
    }

    LoadingHelper.hideLoader(loader);
}

async function saveComment(postId: string) {

}

function selectEmoji(emoji: any) {
    currentPost.value = currentPost.value.toString() + emoji.i;
    // showEmojiPicker.value = false;
}

const postImages = ref([] as string[])

function onImageUploadClick() {
    document.getElementById('post_image_upload').click()
}

async function onImageUpload(event: any) {
    const file = event.target.files[0]
    let extention = '';

    if (file.type === "image/png") extention = '.png'
    else if (file.type === "image/jpeg") extention = '.jpg'
    else if (file.type === "image/gif") extention = '.gif'
    else {
        ToastHelper.error("Only JPG, PNG & GIF files allowed")
        return
    }

    const imageName = uuidv4() + extention;

    const loader = LoadingHelper.showLoader();

    try {
        await RestApi.Upload.uploadImage(imageName, file,UploadType.ImagePost)

        postImages.value.push(imageName)

        ToastHelper.success('Image successfully uploaded')
    } catch (err) {
        ToastHelper.error('There was an error uploading the image. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}

const postVideos = ref([] as string[])

function onVideoUploadClick() {
   document.getElementById('post_video_upload')?.click();
}

async function onVideoUpload(event: any) {
    const file = event.target.files[0]
    let extention = '';

    if (file.type === "video/mp4") extention = '.mp4'
    else if (file.type === "video/m4v") extention = '.m4v'
    else {
        ToastHelper.error("Only mp4 & m4v files allowed");
        return;
    }

    const fileName = uuidv4() + extention;

    const loader = LoadingHelper.showLoader();

    try {
        await RestApi.Upload.upload(fileName, file, UploadType.VideoPost);

        postVideos.value.push(fileName);

        ToastHelper.success('Media successfully uploaded');
    } catch (err) {
        ToastHelper.error('There was an error uploading the media. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}

function playVideo() {
    document.getElementById('a').play()
}

onMounted(async () => {
    initializePopover();

    await getSales();
    await getLatestPosts();
})

</script>

<style scoped>

.popover-emoji{
    position: absolute;
    bottom: 73px;
    right: 50px;
 }
 </style>