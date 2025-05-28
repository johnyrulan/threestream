<template>
<div class="modal fade" id="sendMessageModal" tabindex="-1" aria-labelledby="sendMessageModal" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLongTitle">Search Users</h3>
            </div>

            <div class="modal-body">
                <div>
                    <div class="mb-5">
                        <label class="form-label" for="name">User</label>
                        <!-- <select v-model="airdropGiveAwayUserId" type="text" class="form-control form-control-muted">
                            <option v-for="user in usersWhoJoinedLiveStream" :key="user.id" :value="user.id">{{ user.name }}</option>
                        </select> -->
                        <VueMultiselect
                            :options="allUsers"
                            @search-change="findUsers"
                            label="name"
                            track-by="id"
                            v-model="selectedUser"
                            :loading="isLoading"
                            :internal-search="false"
                            @select="(user: any) => selectedUser = user.id"
                            placeholder="Select user">
                        </VueMultiselect>
                        <div v-if="selectedUser.name" class="mt-2">Selected: {{ selectedUser.name }}</div>
                    </div>
                </div>
            </div>

            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-primary float-end" @click="startMessageThread">Start Messaging</button>
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import eventBus from '@/events/EventBus';
import ErrorLogger from '@/helpers/ErrorLogger';
import StringHelper from '@/helpers/StringHelper';
import ToastHelper from '@/helpers/ToastHelper';
import useEmitter from '@/helpers/useEmitter';
import { toggleModal } from '@/hooks/BootstrapHooks';
import { RestApi } from '@/services/RestApi';
import { PublicUser } from '@/services/api/models';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import VueMultiselect from 'vue-multiselect'

const store = useStore()

const { currentUser } = storeToRefs(store);
const isLoading = ref(false)

const emit = defineEmits<{
    (e: 'startThread', user: PublicUser): void    
}>();


const allUsers = ref([])
const selectedUser = ref({} as PublicUser)

async function findUsers(val: any) {
    if (StringHelper.isNullOrEmpty(val)) {
        return;
    }

    isLoading.value = true;

    try {
        const users = (await RestApi.User.searchByFollowerName(val)).data;
        
        allUsers.value = users.filter(u => u.id !== currentUser.value.id)
    } catch (err) {
        await ErrorLogger.logApiError(err)
        ToastHelper.error('There was an error searching that value')
    }

    isLoading.value = false;
}

function startMessageThread() {
    emit('startThread', selectedUser.value)
    toggleModal('sendMessageModal', 'hide')
}



// async function getAllUsers() {
//     try {
//         const retrievedUsers = (await RestApi.User.getPublicUsers()).data;

//         allUsers.value = retrievedUsers.filter(u => u.id != currentUser.value.id)
//     } catch (err) {
//         await ErrorLogger.logApiError(err)
//     }
// }


</script>

<style scoped>

</style>