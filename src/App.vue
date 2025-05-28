<template>
<div class="d-flex flex-column flex-lg-row h-lg-full bg-jk-bg-dark" id="mainContainer"
  @click="eventBus.emit('onAppClick')">
  <SideNav v-if="!removeSideNavigation(routeName)"></SideNav>
  <!-- Content -->
  <div class="flex-lg-1 h-full h-lg-screen overflow-y-lg-auto overflow-x-hidden">
    <!-- Navbar -->
    <TopNav v-if="!removeTopNavigation(routeName)"></TopNav>
    <!-- Navbar -->
    <router-view/>
  </div>

  <AuthModal/>

</div>
</template>

<script setup lang="ts">
import { initializeDropDown, initializePopover } from '@/hooks/BootstrapHooks'
import { useRoute } from 'vue-router'
import { computed, onMounted } from '@vue/runtime-core'
import 'v-calendar/dist/style.css';
import SideNav from '@/components/SideNav.vue'
import TopNav from '@/components/TopNav.vue'
import WalletService from './services/WalletService';
import AuthModal from './views/auth/AuthModal.vue';

import { removeSideNavigation, removeTopNavigation } from './hooks/CommonHooks';
import eventBus from './events/EventBus';
import PWAHelper from './helpers/PWAHelper';
import AnalyticsService from './services/AnalyticsService';

const route = useRoute();
const routeName = computed(() => route.name as string)

onMounted(() => {
  initializeDropDown()
  initializePopover()
  PWAHelper.initializePWAHook();
  WalletService.initialize();
  // AnalyticsService.initialize();
})
</script>


<style>
#app {
  font-family: var(--body-font);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #1C1520;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font);
}

.pointer-cursor:hover {
  cursor: pointer !important;
}

a:hover {
  cursor: pointer;
}

</style>
