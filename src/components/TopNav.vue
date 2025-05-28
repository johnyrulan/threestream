<template>
<nav class="navbar navbar-dark bg-top-nav position-lg-sticky top-lg-0 d-lg-block overlap-10 flex-none border-0 border-bottom px-0 py-3" id="topbar" :class="{ 'd-none': !showTopNavLogo(routeName) }">
    <div class="container-fluid">
        <div class="me-auto" v-if="showTopNavLogo(routeName)">
            <router-link id="mainLogo" class="navbar-brand py-lg-2 mb-lg-5 px-lg-6 me-0 text-center" :to="{ name: 'Home' }">
                <img src="@/assets/junkie_logo.png">
            </router-link>
        </div>
        <!-- Right menu -->
        <div class="navbar-user d-sm-block ms-auto" :class="{ 'd-none': !showTopNavLogo(routeName) }">
            <div class="hstack gap-3 ms-4">
                <!-- <ul class="nav mx-n3 d-none d-lg-flex" v-if="showAltNav(routeName)">
                    <li class="nav-item">
                        <a class="nav-link" href="https://www.junkieapp.xyz/#how-it-works" target="_blank">How it Works</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://www.junkieapp.xyz/frequently-asked-questions" target="_blank">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://www.junkieapp.xyz/about" target="_blank">FAQ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://www.junkieapp.xyz/contact" target="_blank">Contact</a>
                    </li>
                </ul> -->                
            </div>
        </div>
    </div>
</nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import NavLogin from "./nav/NavLogin.vue";
import { showTopNavLogo, showAltNav } from "@/hooks/CommonHooks";
import { computed } from "vue";

const route = useRoute();
const routeName = computed(() => route.name as string)

</script>

<style scoped>
.navbar-brand img {
    max-height: 60px !important;
}

.nav-item a.nav-link {
    font-size: 12pt;
}

@media (max-width: 992px) {
    #mainLogo img {
        max-height: 60px !important;
    }
}
</style>
