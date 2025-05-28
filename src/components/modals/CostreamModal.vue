<template>
<div class="modal fade" id="costreamModal" tabindex="-1" aria-labelledby="costreamModal" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLongTitle">Add Co-Streamer</h3>
            </div>

            <div class="modal-body">
                <div>
                    <div class="mb-5">
                        <label class="form-label" for="name">Users</label>
                        <VueMultiselect
                            :options="allUsers"
                            label="name"
                            track-by="id"
                            v-model="selectedUser"
                            :loading="isLoading"
                            clear-on-select="true"
                            @select="(user: any) => selectedUser = user"
                            placeholder="Select user">
                        </VueMultiselect>
                        <div v-if="selectedUser.name" class="mt-2">Selected: {{ selectedUser.name }}</div>
                    </div>
                </div>
            </div>

            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-primary float-end" @click="costream">Invite</button>
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import ErrorLogger from '@/helpers/ErrorLogger';
import ToastHelper from '@/helpers/ToastHelper';
import { toggleModal } from '@/hooks/BootstrapHooks';
import RealtimeService from '@/services/RealtimeService';
import { RestApi } from '@/services/RestApi';
import { Livestream } from '@/services/api/models';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import VueMultiselect from 'vue-multiselect'

const isLoading = ref(false)

const props = defineProps<{
    livestreamId: string,
    refresh: number
}>();

const allUsers = ref([])
const selectedUser = ref({} as { id: string, name: string })

const store = useStore()

const { currentUser } = storeToRefs(store);

watch(props, async () => {
    await getAllUsers();
})

async function getAllUsers() {
    isLoading.value = true;
    selectedUser.value = { id: '', name: '' };

    try {
        const groupUsers = await RealtimeService.getAllGroupMembers() ?? [];

        allUsers.value = groupUsers.filter(u => u.id !== currentUser.value.id).map(u => {
            return {
                id: u.id,
                name: u.name
            }
        });                       
    } catch (err) {
        await ErrorLogger.logApiError(err)
        ToastHelper.error('There was an error fetching users')
    }

    isLoading.value = false;
}

async function costream() {
    if (!selectedUser.value) {
        return;
    }    
    
    try {
        const members = (await RestApi.Room.getRoomStatistics(props.livestreamId)).data;

        if (members.broadcastersCount >= 5) {
            ToastHelper.warning('Max number of costreamers reached')
            return;
        }

        await RestApi.Livestream.costream(props.livestreamId, selectedUser.value.id)
        ToastHelper.success('Invited ' + selectedUser.value.name + ' to CoStream');
    } catch (err) {
        await ErrorLogger.logApiError(err)
        ToastHelper.error('There was an error sending costream invite')    
    }

    toggleModal('costreamModal', 'hide')
}

onMounted(async () => {
    await getAllUsers();    
})

</script>

<style scoped>

</style>