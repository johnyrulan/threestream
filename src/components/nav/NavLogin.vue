<template>
<div class="d-flex flex-wrap gap-3 mx-auto">
    <!-- <button class="btn btn-sm btn-secondary" @click="PWAHelper.installPWA()">Install the app on your phone <i class="bi bi-phone"></i></button> -->
    <div class="dropdown" v-if="currentUser">
        <a class="d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
            <!-- <div v-show="currentUser" class="avatar avatar-sm bg-warning rounded-circle text-white">
                <img alt="..." :src="ImageHelper.getProfilePicForUser(currentUser)">
            </div> -->
            <div class="d-sm-block ms-3">
                <span class="avatar rounded-circle border">
                    <UserAvatar :user="currentUser"/>
                </span>
            <span class="h6 text-white ms-3 d-none d-lg-inline-block">
                <span v-if="currentUser">{{currentUser.name}}</span>
            </span>
            </div>
            <div v-if="currentUser" class="d-md-block ms-2">
                <i class="bi bi-chevron-down text-white text-xs"></i>
            </div>
        </a>
        <div v-if="currentUser" class="dropdown-menu dropdown-menu-end">
            <div class="dropdown-header">
                <span class="d-block text-sm text-muted mb-1">Signed in as</span>
                <span class="d-block text-heading font-semibold">{{currentUser.name}}</span>
            </div>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click.prevent="router.push({ name: 'Home' })">
                <i class="bi bi-house me-3"></i>Home
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click.prevent="router.push({ name: 'EditProfile' })">
                <i class="bi bi-person-circle me-3"></i>Account
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click.prevent="logout()">
                <i class="bi bi-person me-3"></i>Logout
            </a>
        </div>
    </div>
    <button v-else data-bs-toggle="modal" data-bs-target="#authModal" class="btn btn-sm btn-primary">Login</button>
</div>
</template>

<script setup lang="ts">
import eventBus from "@/events/EventBus";
import { RestApi } from "@/services/RestApi";
import { useRouter } from "vue-router";
import UserAvatar from "../social/UserAvatar.vue";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";

const store = useStore();
const router = useRouter();

const { currentUser } = storeToRefs(store);

async function searchUsers(searchValue: any) {
    console.log(searchValue)
}

async function logout() {
    await RestApi.User.signOut();

    store.setCurrentUser(undefined);

    eventBus.emit('onLogout', {});

    window.location.href = '/';
}

</script>