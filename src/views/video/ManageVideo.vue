<template>
<div class="bg-dark">
    <div class="container py-10">
        <div class="row">
            <div class="col-lg-7 mx-auto">
                <div class="card shadow border-0 mb-10">
                    <div class="card-body">
                        <div class="mb-7">
                            <h3 class="font-semibold mb-1">Create a Flick</h3>
                            <!-- <p class="text-sm text-muted">Create a new Live Show</p> -->
                        </div>
                        <div class="row g-5">
                            <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="title">Title</label>
                                    <input v-model="currentVideo.name" type="text" class="form-control" id="title">
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="description">Description</label>
                                    <!-- <textarea v-model="livestream.description" class="form-control" id="livestreamDescription" placeholder="What's your livestream about?" rows="3"></textarea> -->
                                    <vue-editor v-model="currentVideo.description" :editorToolbar="customToolbar"></vue-editor>
                                </div>
                            </div>
                            <div class="col-md-12">

                                <label class="form-label">Video Type</label>
                                <div class="hstack gap-3">
                                    <div class="form-item-checkable">
                                        <input class="form-item-check" type="radio" name="videoType" id="flick-video-type" v-model="selectedVideoType" :value="SocialPostType.Flick" > 
                                        <label class="form-item" for="flick-video-type">
                                            <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-24 h-24 text-center text-muted pointer-cursor">
                                                <img alt="..." src="https://media.discordapp.net/attachments/1007104215547658353/1070391456000380958/Junkie_Video_Icon_Sample_3.png">                                              
                                            </span>
                                        </label>
                                        <h5 class="mt-2 text-center">Flick</h5>
                                    
                                    </div>
                                    <div class="form-item-checkable">
                                        <input disabled class="form-item-check" type="radio" name="videoType" id="snip-video-type" v-model="selectedVideoType" :value="SocialPostType.Snip"> 
                                        <label class="form-item" for="snip-video-type">
                                            <span class="form-item-click d-inline-flex align-items-center justify-content-center form-control w-24 h-24 text-center text-muted pointer-cursor">
                                                <img alt="..." src="https://media.discordapp.net/attachments/1007104215547658353/1070391455006347355/Junkie_Video_Icon_Sample_6.png" style="max-height: 54px;">                                             
                                            </span>
                                        </label>
                                        <h5 class="mt-2 text-center">Snip</h5>
                                    </div>
                            </div>

                            </div>
                           
                            <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="formInputExample">Video</label>
                                    <div class="progress" role="progressbar" aria-label="Example 20px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="height: 20px">
                                        <div class="progress-bar bg-primary" :style="{ width: uploadProgress + '%' }"></div>
                                    </div>                                    
                                    <div class="mt-2 card border-2 border-dashed border-primary-hover position-relative">
                                        <div class="d-flex justify-content-center px-5 py-5">
                                            <label for="video_file_upload" class="position-absolute w-full h-full top-0 start-0 cursor-pointer">
                                                <input id="video_file_upload" name="video_file_upload" type="file" class="visually-hidden" @change="onVideoUpload" @click="(ev) => { ev.target.value = null }">
                                            </label>
                                            <div class="text-center">
                                                <div class="text-2xl text-muted">
                                                    <i class="bi bi-upload"></i>
                                                </div>
                                                <div class="d-flex text-sm mt-3">
                                                    <p class="font-semibold">Upload a file or drag and drop</p>
                                                </div>
                                                <p class="text-xs text-gray-500">
                                                    MP4 upto 1GB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="formInputExample">Cover Image (optional)</label>
                                    <div class="card border-2 border-dashed border-primary-hover position-relative">
                                        <div class="d-flex justify-content-center px-5 py-5">
                                            <label for="cover_file_upload" class="position-absolute w-full h-full top-0 start-0 cursor-pointer">
                                                <input id="cover_file_upload" name="cover_file_upload" type="file" class="visually-hidden" @change="onImageUpload" @click="(ev) => { ev.target.value = null }">
                                            </label>
                                            <div class="text-center">
                                                <div class="text-2xl text-muted">
                                                    <i class="bi bi-upload"></i>
                                                </div>
                                                <div class="d-flex text-sm mt-3">
                                                    <p class="font-semibold">Upload a file or drag and drop</p>
                                                </div>
                                                <p class="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 3MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <!-- <div class="alert alert-danger mt-5" role="alert" v-for="err in livestreamErrors" :key="err">
                            {{ err }}
                        </div> -->
                    </div>
                    <div class="card-footer text-end py-4">
                        <!-- <button type="button" class="btn btn-sm btn-neutral me-2">Cancel</button> -->
                        <!-- <button id="saveAsDraftBtn" type="submit" class="btn btn-sm btn-primary me-2" @click.prevent="saveVideo(LivestreamStatus.Draft)">Save as draft</button>
                        <button v-if="currentUser.role === UserRole.Seller || currentUser.role === UserRole.Admin" id="saveAsPrivateBtn" type="submit" class="btn btn-sm btn-primary me-2" @click.prevent="saveVideo(LivestreamStatus.Private)">Save as private</button> -->
                        <button id="publishBtn" type="submit" class="btn btn-sm btn-primary" @click.prevent="saveVideo()">Publish</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
    
<script setup lang="ts">
import { initializePopover } from '@/hooks/BootstrapHooks'
import { onMounted } from '@vue/runtime-core'
import { ref } from 'vue'
import { Sale, SocialPost, UserRole, SocialPostType, FileRequestType } from '@/services/api/models'
import NFTAsset from '@/models/NFTAsset'
import ToastHelper from '@/helpers/ToastHelper'
import ErrorLogger from '@/helpers/ErrorLogger'
import { v4 as uuidv4 } from 'uuid';
import { RestApi } from '@/services/RestApi'
import { VueEditor } from "vue3-editor";
import { useRoute, useRouter } from 'vue-router'
import { computed } from '@vue/reactivity'
import LoadingHelper from '@/helpers/LoadingHelper'
import StringHelper from '@/helpers/StringHelper'
import { useStore } from '@/store/main.store'
import { storeToRefs } from 'pinia'
    
const customToolbar = [
        [{ size: [ 'small', false, 'large', 'huge' ]}],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ]

interface SaleWithNFTAsset {
    sale: Sale,
    asset: NFTAsset
}

const route = useRoute();
const router = useRouter();
const store = useStore()

const videoId = route.params.id as string;

const { currentUser } = storeToRefs(store);

const uploadProgress = ref(0)

async function onVideoUpload(event: any) {
    const file = event.target.files[0]
    let extention = '';

    if (file.type === "video/mp4") extention = '.mp4'
    else {
        ToastHelper.error("Only MP4 files allowed at this time")
        return
    }

    const videoName = uuidv4() + extention;

    uploadProgress.value = 0;    

    const loader = LoadingHelper.showLoader()

    try {        
        ToastHelper.success('Video is processing')

        await RestApi.Upload.uploadWithProgress(videoName, file, FileRequestType.Vids, (progress: number) => { uploadProgress.value = progress })
        currentVideo.value.socialPostAttributes.videos = [videoName];

        ToastHelper.success('Video successfully uploaded')
    } catch (err) {
        ToastHelper.error('There was an error uploading the video. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
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
        await RestApi.Upload.uploadImage(imageName, file, FileRequestType.VidCover)

        currentVideo.value.socialPostAttributes.coverImageUrl = imageName;

        ToastHelper.success('Image successfully uploaded')
    } catch (err) {
        ToastHelper.error('There was an error uploading the image. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}


const currentVideo = ref({ socialPostAttributes: { videos: [] } } as SocialPost)
const selectedVideoType = ref(SocialPostType.Flick as SocialPostType)

async function getVideo() {
    try {
        currentVideo.value = ((await RestApi.Social.getByPostId(videoId)).data).socialPost;        
    } catch (err) {
        ToastHelper.error('There was an error retrieving the Flick');
    }
}

async function saveVideo() {
    
    if (StringHelper.isNullOrEmpty(currentVideo.value.name)) {
        ToastHelper.error('You must enter a name before publishing')
        return;
    }

    if (currentVideo.value.socialPostAttributes?.videos?.length === 0) {
        ToastHelper.error('You must have upload a video before publishing')
        return;
    }    
    
    currentVideo.value.postType = selectedVideoType.value;

    const loader = LoadingHelper.showLoader()

    try {
        const post = (await RestApi.Social.savePost(currentVideo.value)).data;
        
        await router.push({ name: 'Vid', params: { id: post.id } })

        ToastHelper.success('Your video was saved successfully')
    } catch (err) {
        ToastHelper.error('There was an error saving the video. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}

onMounted(async () => {
    initializePopover()

    if (currentUser.value.role !== UserRole.Admin && currentUser.value.role !== UserRole.Seller) {
        router.push({ name: 'Home' })
    }

    if (videoId) await getVideo()    
})
</script>
    
    
<style scoped>
h1, h2, h3, h4, h5, h6, label {
    color: black !important;
}
</style>
    