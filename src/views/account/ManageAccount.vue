<template>
<header>
<div class="container-fluid">
    <div>
        <div class="row align-items-center mt-5">
            <div class="col-sm-6 col-12">
            <!-- Title -->
            <h1 class="h2 ls-tight">
                {{ routeHeading }}
            </h1>
            </div>
        </div>
        <!-- Nav -->
        <ul class="nav nav-tabs overflow-x border-0">
            <li class="nav-item">
                <router-link class="text-white" :class="route.name === 'EditProfile' ? 'nav-link active' : 'nav-link'" :to="{ name: 'EditProfile' }">Profile</router-link>
            </li>
            <li class="nav-item">
                <router-link class="text-white" :class="route.name === 'BillingInfo' ? 'nav-link active' : 'nav-link'" :to="{ name: 'BillingInfo' }">Billing</router-link>
            </li>
            <li class="nav-item">
                <router-link class="text-white" :class="route.name === 'ManageShipping' ? 'nav-link active' : 'nav-link'" :to="{ name: 'ManageShipping' }">Shipping</router-link>
            </li>
            <li class="nav-item">
                <router-link class="text-white" :class="route.name === 'SalesHistory' ? 'nav-link active' : 'nav-link'" :to="{ name: 'SalesHistory' }">Sales History</router-link>
            </li>
        </ul>
    </div>
</div>
</header>
<router-view />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const routeHeading = ref('');

function parseRouteHeading() {
    if (route.name === 'EditProfile') routeHeading.value = 'Profile';
    else if (route.name === 'BillingInfo') routeHeading.value = 'Billing';
    else if (route.name === 'SalesHistory') routeHeading.value = 'Sales History';
    else if (route.name === 'ManageShipping') routeHeading.value = 'Shipping';
}

router.afterEach(() => {
    parseRouteHeading();
})

onMounted(() => {
    parseRouteHeading();
})

</script>

<style scoped>

</style>