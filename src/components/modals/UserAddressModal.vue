<template>
<div class="modal fade" id="userAddressModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="userAddressModal" style="display: none" aria-hidden="true">
    <div class="modal-dialog userAddressModal-modal">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <div class="card shadow-none">
                    <!-- <div class="row justify-content-center">
                        <h6 class="font-bold mb-2 text-center">Update your Shipping Information</h6>
                    </div> -->
                </div>
                <div class="my-2">
                    <h3>Shipping Information</h3>

                    <!-- <div class="mt-3">
                        <label for="firstName" class="form-label">First Name</label>
                        <input type="text" class="form-control" id="firstName" placeholder="Funko" v-model="firstName">
                    </div>

                    <div class="mt-3">
                        <label for="lastName" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="lastName" placeholder="Master" v-model="lastName">
                    </div> -->

                    <div class="mt-3">
                        <label for="phone" class="form-label">Phone</label>
                        <input type="text" class="form-control" id="phone" placeholder="999-999-9999" v-model="phone">
                    </div>
                    
                    <div class="mt-3">
                        <label for="address" class="form-label">Address</label>
                        <input type="text" class="form-control" id="address" placeholder="111 King Street" v-model="address">
                    </div>
                    
                    <div class="mt-3">
                        <label for="city" class="form-label">City</label>
                        <input type="text" class="form-control" id="city" placeholder="Pallet Town" v-model="city">
                    </div>
                    
                    <div class="mt-3">
                        <label for="state" class="form-label">State</label>
                        <input type="text" class="form-control" id="state" placeholder="Kanto" v-model="state">
                    </div>
                    
                    <div class="mt-3">
                        <label for="zip" class="form-label">Zip</label>
                        <input type="text" class="form-control" id="zip" placeholder="33333" v-model="zip">
                    </div>                         
                </div>
            </div>
            <div class="modal-footer py-1">
                <button  type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal">
                    Cancel
                </button>
                <button type="button" class="btn btn-sm btn-success" @click.prevent="saveAddress">
                    Save
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import LoadingHelper from '@/helpers/LoadingHelper';
import StringHelper from '@/helpers/StringHelper';
import ToastHelper from '@/helpers/ToastHelper';
import { toggleModal } from '@/hooks/BootstrapHooks';
import { Address } from '@/services/api/models';
import { RestApi } from '@/services/RestApi';
import { useStore } from '@/store/main.store';
import StoreMutations from '@/store/store.constants';
import { ref } from 'vue';


const firstName = ref('');
const lastName = ref('');
const address = ref('');
const city = ref('');
const state = ref('');
const zip = ref('');
const phone = ref('');
const country = ref('')

const store = useStore()

async function saveAddress() {
    if (StringHelper.isNullOrEmpty(phone.value)) {
        ToastHelper.error('Phone number is required')
        return;
    }    

    if (StringHelper.isNullOrEmpty(address.value)
        || StringHelper.isNullOrEmpty(city.value) 
        || StringHelper.isNullOrEmpty(state.value) 
        || StringHelper.isNullOrEmpty(zip.value) 
    ) {
        ToastHelper.error('Some address values are missing. Please enter all address values to save.')
        return;
    }
    
    const loader = LoadingHelper.showLoader();

    try {

        const userAddress = {
            phone: phone.value,
            street1: address.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
            country: 'USA'
        } as Address;

        await RestApi.User.saveAddress(userAddress, false);

        await setCurrentUser();

        ToastHelper.success('Your address has been successfully saved')        

        toggleModal('userAddressModal', 'hide')
    } catch (err) {
        ToastHelper.error('There was an error saving your address')
    }

    LoadingHelper.hideLoader(loader)
}

async function setCurrentUser() {
    try {
        const currentUser = (await RestApi.User.getCurrentUser()).data
        store.setCurrentUser(currentUser);
    } catch (err) {

    }
}

</script>

<style scoped>

</style>