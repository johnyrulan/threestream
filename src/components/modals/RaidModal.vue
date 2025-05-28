<template>
<div class="modal fade" id="raidModal" tabindex="-1" aria-labelledby="raidModal" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content shadow-3">
            <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLongTitle">Raid</h3>
            </div>

            <div class="modal-body">
                <div>
                    <div class="mb-5">
                        <label class="form-label" for="name">Livestream</label>
                        <VueMultiselect
                            :options="allStreams"
                            label="name"
                            track-by="id"
                            v-model="selectedStream"
                            :loading="isLoading"
                            @select="(stream: any) => selectedStream = stream"
                            placeholder="Select livestream">
                        </VueMultiselect>
                        <div v-if="selectedStream.name" class="mt-2">Selected: {{ selectedStream.name }}</div>
                    </div>
                </div>
            </div>

            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-primary float-end" @click="raid">Raid</button>
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
import { RestApi } from '@/services/RestApi';
import { Livestream } from '@/services/api/models';
import { onMounted, ref, watch } from 'vue';
import VueMultiselect from 'vue-multiselect'

const isLoading = ref(false)

const props = defineProps<{
    livestreamId: string,
    refresh: number
}>();

watch(props, async () => {
    await getAllStreams();
})

const allStreams = ref([])
const selectedStream = ref({} as Livestream)

async function getAllStreams() {
    isLoading.value = true;

    try {
        allStreams.value = (await RestApi.Livestream.getCurrentLivestreams({ page: 1, pageSize: 20 })).data;
        
    } catch (err) {
        await ErrorLogger.logApiError(err)
        ToastHelper.error('There was an error fetching livestreams')
    }

    isLoading.value = false;
}

async function raid() {
    if (!selectedStream.value) {
        return;
    }
    
    try {
        await RestApi.Livestream.raid(props.livestreamId, selectedStream.value.id)
        ToastHelper.success('Raiding ' + selectedStream.value.name);
    } catch (err) {
        await ErrorLogger.logApiError(err)
        ToastHelper.error('There was an error raiding that stream')    
    }

    toggleModal('sendMessageModal', 'hide')
}

onMounted(async () => {
    await getAllStreams();
})

</script>

<style scoped>

</style>