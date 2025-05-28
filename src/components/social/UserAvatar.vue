<template>
<div class="w-full h-full bg-dark rounded-circle text-white text-uppercase text-center" style="padding-top: 25%" v-if="!props.user.userAttributes || !props.user.userAttributes.profilePicUrl">{{ StringHelper.getFirst(props.user.name) }}</div>
<video 
    v-else-if="props.user.userAttributes.isProfilePicVideo"
    class="w-10 h-10 rounded-circle object-cover" autoplay playsinline loop muted alt="..." 
    :src="ImageHelper.optimizeIPFSMedia(props.user.userAttributes.profilePicUrl, 'video')" />
<img v-else class="img-fluid rounded-circle w-10 h-10" 
    :src="ImageHelper.optimizeIPFSMedia(props.user.userAttributes.profilePicUrl, 'image')" />
</template>

<script lang="ts" setup>
import { User } from '@/services/api/models';
import StringHelper from '@/helpers/StringHelper';
import ImageHelper from '@/helpers/ImageHelper';

const props = defineProps<{
    user: User
}>()
</script>

<style scoped></style>