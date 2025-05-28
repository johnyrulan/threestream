<template>
    <div class="card h-full shadow-4-hover border-4 border-jk-primary transform translate-y-n3-hover" @click="goToVideo(props.video.socialPost.id)">
        <!-- Image -->
        <div class="px-3 pt-3 d-flex align-items-center">
        <img v-if="props.video?.socialPost?.socialPostAttributes.coverImageUrl" autoplay loop :src="ImageHelper.getVidCoverImage(props.video.socialPost)" class="card-img" style="max-height: 200px; aspect-ratio: 1/1">
        <img v-else autoplay loop src="@/assets/default-livestream-image.png" class="card-img" style="max-height: 200px; aspect-ratio: 1/1">
        </div>
        <!-- Card Body -->
        <div class="card-body">
            <!-- Title -->
            <div class="d-flex flex-wrap">
                <h3 class="h4 text-black">{{ props.video.socialPost.name }}</h3>
                <div class="badge badge-pill j-bg-secondary ms-auto h-fit-content float-right">
                    {{ viewCount }} Views
                </div>
            </div>
            <div class="d-flex align-items-center mt-3">
                <div class="flex-none">
                    <span class="avatar rounded-circle border j-border-primary">
                        <div class="w-full h-full bg-dark rounded-circle text-white text-uppercase text-center" style="padding-top: 25%" v-if="!props.video.socialPost?.profilePicUrl">{{ StringHelper.getFirst(props.video.socialPost?.userName) }}</div>
                        <video 
                            v-else-if="props.video.socialPost?.isProfilePicVideo"
                            class="w-full h-full rounded-circle object-cover" autoplay playsinline loop muted alt="..." 
                            :src="ImageHelper.optimizeIPFSMedia(props.video.socialPost?.profilePicUrl, 'video')" />
                        <img v-else class="img-fluid rounded-circle w-full h-full" 
                            :src="ImageHelper.optimizeIPFSMedia(props.video.socialPost?.profilePicUrl, 'image')" />
                    </span>
                </div>
                <div class="flex-fill ms-3">
                    <a href="#" class="text-sm text-heading mb-0">
                        {{ props.video.socialPost?.userName }}
                    </a>
                </div>
            </div>                  
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ReactionType, SocialPostViewModel } from '@/services/api/models';
import ImageHelper from '@/helpers/ImageHelper';
import { useRouter } from 'vue-router';
import StringHelper from '@/helpers/StringHelper';
import { onMounted, ref } from 'vue';
import { RestApi } from '@/services/RestApi';

const router = useRouter()

const props = defineProps<{
    video: SocialPostViewModel
}>();

function goToVideo(id: string) {
    router.push({ name: 'Vid', params: { id } })
}

const viewCount = ref(0)

async function getViewCount() {
    try {
        viewCount.value = (await RestApi.Social.getReactionCount(props.video.socialPost?.id, ReactionType.View)).data;
    } catch (err) {

    }    
}

onMounted(async () => {
    await getViewCount()
})

</script>