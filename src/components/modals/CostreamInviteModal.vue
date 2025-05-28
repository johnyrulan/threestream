<template>
<div class="modal fade" id="costreamInviteModal" tabindex="-1" aria-labelledby="costreamInviteModal" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLongTitle">Go Live</h3>
            </div>

            <div class="modal-body">
                <div>
                    <div class="mb-5">
                        <h4>You've been invited to Co-Stream</h4>
                    </div>
                </div>
            </div>

            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-primary float-end" @click="acceptInvite">Join Live</button>
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const isLoading = ref(false)

const props = defineProps<{
    livestreamId: string,
    inviteId: string    
}>();

const store = useStore()

const { currentUser } = storeToRefs(store);

function acceptInvite() {
    const baseUrl = import.meta.env.VITE_URL;

    window.location.href = `${baseUrl}/livestream/${props.livestreamId}/costream/${props.inviteId}`;
}

</script>

<style scoped>

</style>