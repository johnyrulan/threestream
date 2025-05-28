<template>
<header>
  <div class="container-fluid">
    <div class="pt-6">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0">
          <!-- Title -->
          <h1 class="h2 ls-tight text-center">
            Upcoming Livestreams
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
        <div class="col-xl-3 col-sm-4" v-for="(stream, index) in upcomingLivestreams" :key="index">
          <div class="card h-full shadow-4-hover" >
              <!-- Image -->
              <div class="px-3 pt-3 d-flex align-items-center">
                <img v-if="stream?.imageUrl" autoplay loop :src="ImageHelper.getLivestreamCoverImage(stream)" class="card-img">
                <img v-else autoplay loop src="@/assets/default-livestream-image.png" class="card-img">
              </div>
              <!-- Card Body -->
              <div class="card-body">
                  <!-- Title -->
                  <div class="d-flex">
                    <h3 class="h4 text-black">{{ stream.name }}</h3>
                    <span class="badge badge-pill j-bg-secondary ms-auto h-fit-content float-right" v-if="stream.totalSales">
                        ${{ NumberHelper.normalizeCurrencyFromAPI(stream.totalSales) }}
                    </span>
                  </div>
                  <!-- Subtitle -->
                  <span class="d-block text-muted text-sm font-semibold">{{ CommonHelper.formatDate(stream?.startTime, 'MMMM D, YYYY hh:mm A') }}</span>
                  <router-link :to="{ name: 'PresentLivestream', params: { id: stream.id } }" href="#" class="btn btn-sm btn-success mx-1 my-1">
                      Join Stream
                  </router-link>
                  <router-link :to="{ name: 'EditLivestream', params: { livestreamId: stream.id } }" href="#" class="btn btn-sm btn-success mx-1 my-1">
                      Edit
                  </router-link>
                  <button class="btn btn-sm btn-success mx-1 my-1" @click.prevent="deleteLivestream(stream.id)">Delete</button>
                  <button v-if="currentUser.role === UserRole.Admin" class="btn btn-sm btn-success mx-1 my-1" @click.prevent="openAssignModal(stream.id)">Assign</button>
              </div>
              <p v-if="currentUser.role === UserRole.Admin" class="text-semibold text-warning pb-3 ps-7">Hosted by {{ getHostUserName(stream.hostUserId) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<div class="modal fade" id="userAssignModal" tabindex="-1" aria-labelledby="userAssignModal" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <h2 class="text-center mb-5">Assign to</h2>
                <VueMultiselect
                    :options="users"
                    label="name"
                    track-by="id"
                    @select="(user: any) => assignToUser(user)"
                    placeholder="Select user">
                </VueMultiselect>
            </div>
            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { Livestream, LiveStreamWithTotalSales, User, UserRole } from "@/services/api/models";
import LivestreamService from "@/services/domain/LivestreamService";
import { computed, onMounted, ref } from "vue";
import CommonHelper from "@/helpers/CommonHelper";
import ImageHelper from "@/helpers/ImageHelper";
import UserService from "@/services/domain/UserService";
import { toggleModal } from "@/hooks/BootstrapHooks";
import VueMultiselect from 'vue-multiselect';
import ToastHelper from "@/helpers/ToastHelper";
import { RestApi } from "@/services/RestApi";
import NumberHelper from "@/helpers/NumberHelper";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";


const upcomingLivestreams = ref([] as LiveStreamWithTotalSales[])
const users = ref([] as User[]);
const currentLivestreamId = ref('');

const store = useStore()
const { currentUser } = storeToRefs(store);

function openAssignModal (livestreamId: string) {
  currentLivestreamId.value = livestreamId;
  toggleModal('userAssignModal', 'show');
}

function getHostUserName (userId: string) {
  return (users.value.find(user => user.id === userId))?.name;
}

async function assignToUser(user: User) {
  try {
    await RestApi.Livestream.assign(currentLivestreamId.value, user.id);
    toggleModal('userAssignModal', 'hide');
    ToastHelper.success('Livestream was successfully assigned');
    await getUpcomingLivestreams();
  } catch (err) {
    ToastHelper.success('There was an error assigning livestream. Please try again');
  }
}

async function getUpcomingLivestreams() {
  upcomingLivestreams.value = currentUser.value.role === UserRole.Admin ?
  await LivestreamService.getAllWithTotalSales() :
  await LivestreamService.getLivestreamsByUserId(currentUser.value.id);
}

async function deleteLivestream(id: string) {
  await LivestreamService.deleteLivestream(id);
}

async function getAllUsers () {
  users.value = await UserService.getAllUsers() ?? [];
}

onMounted(async () => {
  await getUpcomingLivestreams();

  if (currentUser.value.role === UserRole.Admin) {
    await getAllUsers();
  }

})

</script>

<style scoped>
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>