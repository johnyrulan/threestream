<template>
<nav class="navbar show navbar-vertical h-lg-screen navbar-expand-lg px-0 py-3 navbar-dark bg-jk-dark" id="sidebar">
    <div class="container-fluid">
    <!-- Toggler -->
    <button class="navbar-toggler ms-n2" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <!-- Brand -->
    <router-link id="mainLogo" class="navbar-brand py-lg-2 mb-lg-5 px-lg-6 text-center mx-auto" :to="{ name: 'Home' }">
        <img src="@/assets/junkie_logo.png">
    </router-link>
    <!-- User menu (mobile) -->
    <div class="navbar-user d-lg-none">        
    </div>
    <!-- Collapse -->
    <div class="collapse navbar-collapse" id="sidebarCollapse">
        <NavLogin/>
        <!-- Navigation -->
        <ul class="navbar-nav">
        <!-- <li>
            <span class="nav-link text-xs font-semibold text-uppercase text-muted ls-wide">
            Buy
            </span>
        </li> -->
        <li class="nav-item">
            <router-link :to="{ name: 'Home' }" class="nav-link" role="button" @click="collapseNav">
                <font-awesome-icon icon="fa-solid fa-bolt-lightning" class="h-5" /> <span class="ms-1">Livestreams</span>
            </router-link>
        </li>
        <!-- <li class="nav-item">
            <router-link disabed :to="{ name: 'Home' }" class="nav-link" role="button" @click="collapseNav">
                <font-awesome-icon icon="fa-solid fa-shop" class="h-5" /> <span class="ms-1">Marketplace</span> <span class="badge badge-sm gradient-bottom-right start-green-500 end-blue-500 rounded-pill ms-2 text-xs">Coming Soon</span>
            </router-link>
        </li>             -->
        <!-- <li class="nav-item">
            <router-link :to="{ name: 'Marketplace' }" class="nav-link" role="button" @click="collapseNav">
                <i class="bi bi-shop"></i> <span>Marketplace</span>
            </router-link>
        </li> -->
        <!-- <li class="nav-item">
            <router-link :to="{ name: 'Auctions' }" class="nav-link" role="button" @click="collapseNav">
                <i class="bi bi-lightning"></i> Auctions
            </router-link>
        </li> -->
        <li class="nav-item">
            <a class="nav-link" role="button">
                <i class="bi bi-broadcast"></i> Top Streamers
                <span class="badge badge-sm bg-success rounded-pill ms-auto">LIVE</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" role="button">
                <i class="bi bi-calendar-event"></i> Drop Calendar
            </a>
        </li>
        <!-- <li class="nav-item">
            <a class="nav-link" href="#sidebar-files" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebar-files">
            <i class="bi bi-box-arrow-right"></i> Categories
            </a>
            <div class="collapse" id="sidebar-files">
            <ul class="nav nav-sm flex-column">
                <li class="nav-item">
                <a href="/pages/files/overview.html" class="nav-link">
                    Funko Pops
                </a>
                </li>
                <li class="nav-item">
                <a href="/pages/files/table-view.html" class="nav-link">
                    Streetfighter
                </a>
                </li>
                <li class="nav-item">
                <a href="/pages/files/media-gallery.html" class="nav-link">
                    Marvel
                </a>
                </li>
            </ul>
            </div>
        </li> -->
        <!-- <li class="nav-item">
            <a class="nav-link">
                <i class="bi bi-box-arrow-right"></i> Categories
            </a>
            <div class="mx-4 d-flex flex-wrap gap-3">
                <a id="funko" href="#" class="btn btn-outline-primary btn-sm rounded-pill">
                    Funko
                </a>
                <a id="marvel" href="#" class="btn btn-outline-primary btn-sm rounded-pill">
                    Marvel
                </a>
                <a id="street-fighter" href="#" class="btn btn-outline-primary btn-sm rounded-pill">
                    Street Fighter
                </a>
                <a id="gaming" href="#" class="btn btn-outline-primary btn-sm rounded-pill">
                    Gaming
                </a>
                <a id="nba-topshot" href="#" class="btn btn-outline-primary btn-sm rounded-pill">
                    NBA Topshot
                </a>
                <a id="topps-baseball" href="#" class="btn btn-outline-primary btn-sm rounded-pill">
                    Topps Baseball
                </a>
                <a id="music" href="#" class="btn btn-outline-primary btn-sm rounded-pill">
                    Music
                </a>
            </div>
        </li> -->
        </ul>
        <ul class="navbar-nav">
            <li>
                <span class="nav-link text-xs font-semibold text-uppercase text-white ls-wide">
                Profile
                </span>
            </li>
            <li class="nav-item">
                <a :href="`/profile/${currentUser.name}`" class="nav-link" role="button" @click="collapseNav">
                    <font-awesome-icon icon="fa-solid fa-user" class="h-5" /> <span class="ms-1">My Profile</span>
                </a>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'Feed' }" class="nav-link" role="button" @click="collapseNav">
                    <i class="bi bi-newspaper"></i> Feed
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'Messages' }" class="nav-link" role="button" @click="collapseNav">
                    <font-awesome-icon icon="fa-solid fa-comment-dots" class="h-5" /> <span class="ms-1">Messages</span>
                    <span class="ms-auto" v-if="unreadMessageCount === 0"><font-awesome-icon icon="fa-solid fa-check" style="color: var(--accent-color)" /></span>
                    <span class="badge badge-sm gradient-bottom-right start-yellow-500 end-orange-500 rounded-pill ms-auto" v-else>{{ unreadMessageCount }}</span>
                </router-link>
            </li>            
            <!-- <li class="nav-item">
                <router-link :to="{ name: 'UserOrders' }" class="nav-link" role="button" @click="collapseNav">
                    <font-awesome-icon icon="fa-solid fa-box-open" class="h-5" /> <span class="ms-1">My Orders</span>
                </router-link>
            </li> -->
            <li class="nav-item">
                <router-link :to="{ name: 'NFTs' }" class="nav-link" role="button" @click="collapseNav">
                    <font-awesome-icon icon="fa-solid fa-robot" class="h-5" /> <span class="ms-1">My Digitals</span>
                </router-link>
            </li>
            <!-- <li class="nav-item">
                <router-link :to="{ name: 'Offers' }" class="nav-link" role="button" @click="collapseNav">
                    <i class="bi bi-gift"></i> My Offers
                </router-link>
            </li> -->
            <li class="nav-item">
                <router-link :to="{ name: 'ManageAccount' }" class="nav-link" role="button" @click="collapseNav">
                    <font-awesome-icon icon="fa-solid fa-gear" class="h-5" /> <span class="ms-1">Account Settings</span>
                </router-link>
            </li>
            <!-- <li class="nav-item">
                <router-link class="nav-link py-2" :to="{ name: 'ManageFlicks' }" @click="collapseNav">
                    <i class="bi bi-box-arrow-up-right"></i> Flicks
                </router-link>
            </li>           -->
            <!-- <li class="nav-item text-center my-2">
                <router-link :to="{ name: 'CreateVideo' }" class="btn d-inline-flex btn-secondary">
                    <span class=" ps-2 order-2">
                        <i class="bi bi-fast-forward-circle-fill"></i>
                    </span>
                    <span>Upload Flick</span>
                </router-link>
            </li>               -->
            <li class="nav-item text-center my-2">
                <a href="https://7bf13qngjg9.typeform.com/to/E6HfBTrd" target="_blank" class="btn d-inline-flex btn-primary">
                    <span class=" ps-2 order-2">
                        <i class="bi bi-currency-exchange"></i>
                    </span>
                    <span>Become a Seller</span>
                </a>
            </li>
        </ul>
        <!-- Seller -->
        <ul class="navbar-nav">
        <li>
            <span class="nav-link text-xs font-semibold text-uppercase text-white ls-wide">
            Seller
            </span>
        </li>
        <li class="nav-item">
            <router-link class="nav-link py-2" :to="{ name: 'ImportNFTs' }" @click="collapseNav">
                <font-awesome-icon icon="fa-solid fa-cloud-arrow-down" class="h-5" /> <span class="ms-1">Import Digitals</span>
            </router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link py-2" :to="{ name: 'ReBreaks' }" @click="collapseNav">
                <font-awesome-icon icon="fa-solid fa-face-grin-stars" class="h-5" /> <span class="ms-1">ReBreaks</span>
            </router-link>
        </li>         
        <!-- <li class="nav-item">
            <router-link :to="{ name: 'SellerDashboard' }" class="nav-link" role="button" @click="collapseNav">
                <font-awesome-icon icon="fa-solid fa-truck-fast" class="h-5" /> <span class="ms-1">Shipments</span>
            </router-link>
        </li> -->
          
        <li class="nav-item">
            <router-link class="nav-link py-2" :to="{ name: 'SellerLivestreams' }" @click="collapseNav">
                <font-awesome-icon icon="fa-solid fa-bolt" class="h-5" /> <span class="ms-1">My Livestreams</span>
            </router-link>
        </li>         
        <li class="nav-item text-center my-2">
            <router-link :to="{ name: 'CreateLivestream' }" class="btn d-inline-flex btn-primary">
                <span class=" ps-2 order-2">
                    <font-awesome-icon icon="fa-solid fa-bolt" class="h-5" />
                </span>
                <span>Create Livestream</span>
            </router-link>
        </li>   
        </ul>
        <!-- Divider -->        
        <ul class="navbar-nav">
            <li>
                <span class="nav-link text-xs font-semibold text-uppercase text-white ls-wide">
                About
                </span>
            </li>
            <li class="nav-item">
                <a class="nav-link py-2" target="_blank" href="https://www.junkieapp.xyz/">
                    <font-awesome-icon icon="fa-solid fa-users" class="h-5" /> <span class="ms-1">Company</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link py-2 d-flex align-items-center" target="_blank" href="https://www.junkieapp.xyz/contact">
                <font-awesome-icon icon="fa-solid fa-code-fork" class="h-5" /> <span class="ms-1">Careers</span>
                </a>
            </li>
        </ul>
        <!-- Push content down -->
        <div class="mt-auto"></div>
    </div>
    </div>
</nav>
</template>

<script setup lang="ts">
import { UserRole } from '@/services/api/models';
import { computed } from '@vue/runtime-core';
import NavLogin from './nav/NavLogin.vue';
import { collapse } from '@/hooks/BootstrapHooks';
import RealtimeService from '@/services/RealtimeService';
import { onMounted, ref } from 'vue';
import eventBus from '@/events/EventBus';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia'

const store = useStore()

const { currentUser } = storeToRefs(store)

function collapseNav() {
    collapse('sidebarCollapse', 'hide');
}

const unreadMessageCount = ref(0)

async function getUnreadMessages() {
    if (currentUser?.value?.id) {
        unreadMessageCount.value = await RealtimeService.getUnreadMessageCount(currentUser.value);
    }
}

onMounted(async () => {
    await getUnreadMessages();
})

RealtimeService.client.on(async (event) => {    
    if (event.type === 'notification.mark_read') {
        unreadMessageCount.value = event.total_unread_count;
    }
})

</script>

<style scoped>
.navbar-brand img {
    height: auto !important;
}

.nav-item a.nav-link {
    font-size: 12pt;
}

@media (max-width: 992px) {
    #mainLogo img {
        height: 60px !important;
    }
}
</style>
