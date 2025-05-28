<template>
<div class="modal fade" id="transferJunkieWalletModal" tabindex="-1" aria-labelledby="transferJunkieWalletModal" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLongTitle">Transfer to Junkie Wallet</h3>
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
                          label="name"
                          track-by="id"
                          v-model="selectedUser"
                          @select="(user: any) => selectedUser = user"
                          placeholder="Select user">
                        </VueMultiselect>
                        <div v-if="selectedUser.name" class="mt-2">Selected: {{ selectedUser.name }}</div>
                    </div>
                </div>
            </div>

            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-primary float-end" @click="transferNFT">Transfer</button>
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import eventBus from '@/events/EventBus';
import ErrorLogger from '@/helpers/ErrorLogger';
import ToastHelper from '@/helpers/ToastHelper';
import useEmitter from '@/helpers/useEmitter';
import { toggleModal } from '@/hooks/BootstrapHooks';
import { RestApi } from '@/services/RestApi';
import { PublicUser } from '@/services/api/models';
import { computed, ref } from 'vue';
import VueMultiselect from 'vue-multiselect'
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';

const emitter = useEmitter()
const store = useStore()

const { currentUser } = storeToRefs(store);

const allUsers = ref([])
const currentWalletId = ref('');
const selectedUser = ref({} as PublicUser)



async function getAllUsers() {
    try {
        const retrievedUsers = (await RestApi.User.getPublicUsers()).data;

        allUsers.value = retrievedUsers.filter(u => u.id != currentUser.value.id)
    } catch (err) {
        await ErrorLogger.logApiError(err)
    }
}

async function transferNFT() {
    try {
        await RestApi.Wallet.transferToJunkieWallet(currentWalletId.value, selectedUser.value.id);
        ToastHelper.success('Your NFT has been successfully transferred')
        toggleModal('transferJunkieWalletModal', 'hide');  
    } catch (err) {
        await ErrorLogger.logApiError(err)
        ToastHelper.error('There was an error transferring your NFT')
    }
}

eventBus.on('onTransferJunkieAsset', async (value: { walletAssetId: string }) => {
    currentWalletId.value = value.walletAssetId;  
    toggleModal('transferJunkieWalletModal', 'show');  
    await getAllUsers();
})

</script>

<style scoped>

</style>