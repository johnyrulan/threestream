<template>
<header>
  <div class="container-fluid">
    <div class="pt-6">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0">
          <!-- Title -->
          <h1 class="h2 ls-tight text-center">
            Your Flicks
          </h1>
        </div>
      </div>
    </div>
  </div>
</header>
<main class="py-6">
  <!-- Container -->
  <div class="container-fluid">
    <div class="vstack gap-6">
      <!-- Items -->
      <div class="row g-6" id="lightgallery">
        <div class="col-xl-3 col-sm-4" v-for="(video, index) in userVideos" :key="index">
          <div class="card h-full shadow-4-hover" >
              <!-- Image -->
              <div class="px-3 pt-3 d-flex align-items-center">
                <img v-if="video?.socialPost?.socialPostAttributes.coverImageUrl" autoplay loop :src="ImageHelper.getVidCoverImage(video.socialPost)" class="card-img" style="max-height: 200px; aspect-ratio: 1/1">
                <img v-else autoplay loop src="@/assets/default-livestream-image.png" class="card-img">
              </div>
              <!-- Card Body -->
              <div class="card-body">
                  <!-- Title -->
                  <div class="d-flex">
                    <h3 class="h4 text-black">{{ video.socialPost.name }}</h3>
                    <!-- <span class="badge badge-pill j-bg-secondary ms-auto h-fit-content float-right" v-if="stream.totalSales">
                        ${{ NumberHelper.normalizeCurrencyFromAPI(stream.totalSales) }}
                    </span> -->
                  </div>
                  <!-- Subtitle -->
                  <!-- <span class="d-block text-muted text-sm font-semibold">{{ CommonHelper.formatDate(stream?.startTime, 'MMMM D, YYYY hh:mm A') }}</span> -->
                  <router-link :to="{ name: 'Vid', params: { id: video.socialPost.id } }" href="#" class="btn btn-sm btn-success me-1 my-1">
                      View Video
                  </router-link>
                  <router-link :to="{ name: 'ManageVideo', params: { id: video.socialPost.id } }" href="#" class="btn btn-sm btn-success me-1 my-1">
                      Edit
                  </router-link>
                  <!-- <router-link :to="{ name: 'EditLivestream', params: { livestreamId: stream.id } }" href="#" class="btn btn-sm btn-success mx-1 my-1">
                      Edit
                  </router-link> -->
                  <!-- <button class="btn btn-sm btn-success mx-1 my-1" @click.prevent="deleteLivestream(stream.id)">Delete</button> -->
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

</template>

<script lang="ts" setup>
import ToastHelper from '@/helpers/ToastHelper';
import { SocialPostType, SocialPostViewModel } from '@/services/api/models';
import { RestApi } from '@/services/RestApi';
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@/store/main.store';
import ImageHelper from '@/helpers/ImageHelper';
import { storeToRefs } from 'pinia';

const store = useStore();

const { currentUser } = storeToRefs(store);

const userVideos = ref([] as SocialPostViewModel[])

async function getUserVideos() {
  try {
    userVideos.value = (await RestApi.Social.getByUserId(currentUser.value.id, SocialPostType.Flick)).data;
  } catch (err) {
    ToastHelper.error('There was an error retreiving your videos. Please try again.')
  }
}

onMounted(() => {
  getUserVideos();
})

</script>

<style scoped>

</style>