<template>
    <header>
  <div class="container-fluid">
    <div class="">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0 d-flex justify-content-center align-items-center">
          <!-- Title -->
          <img src="https://media.discordapp.net/attachments/1007104215547658353/1070391456000380958/Junkie_Video_Icon_Sample_3.png"/>
          <h1 class="h2 ls-tight text-center">
             JUNKIE Flicks
          </h1>
        </div>
      </div>
    </div>
  </div>
</header>
<div class="container-fluid mt-3">
    <div class="card border-base">
    <div class="card-body">
        <h4 class="text-warning mb-2">Welcome to JUNKIE Flicks</h4>
        <p class="text-md font-light">
            You can now watch exclusive content from your favorite JUNKIE creators! JUNKIE Flicks has educational & entertainment content to  connect with your favorite hosts outside of the live shows. Start watching now & please contact us if you have any questions or feedback at <a href="mailto:info@junkieapp.xyz">info@junkieapp.xyz</a>!
        </p>
    </div>
    </div>
</div>
<main class="py-6">
  <!-- Container -->
  <div class="container-fluid">
    <div class="vstack gap-6">
      <!-- Items -->
      <div class="row g-6" id="lightgallery">
        <div class="col-xl-3 col-sm-4 pointer-cursor" v-for="(video, index) in flicks" :key="index">
            <FlickCard :video="video" />
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
import { onMounted, ref } from 'vue';
import ImageHelper from '@/helpers/ImageHelper';
import StringHelper from '@/helpers/StringHelper';
import FlickCard from '@/components/social/FlickCard.vue';

const flicks = ref([] as SocialPostViewModel[])

async function getUserVideos() {
  try {
    flicks.value = (await RestApi.Social.getLatestPosts(SocialPostType.Flick, true)).data;
  } catch (err) {
    ToastHelper.error('There was an error retreiving flicks. Please try again.')
  }
}

onMounted(() => {
  getUserVideos();
})
</script>