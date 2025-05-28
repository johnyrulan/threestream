<template>
<main class="main-content mt-0">
<section>
    <div class="flex-lg-1 h-screen overflow-y-lg-auto">
    <main class="py-6 bg-dark">
        <div class="container-fluid max-w-screen-md vstack gap-6">
            <div>
                <div class="mb-5">
                    <h4>Shipping Info</h4>
                </div>

                <div class="row g-5">
                    <div class="col-md-12">
                        <div>
                            <label class="form-label">Full Name</label> 
                            <input type="text" v-model="buyerFullName" class="form-control" id="fullName">
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">Address</label> 
                            <input type="text" v-model="buyerAddress" class="form-control" id="address">
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">City</label> 
                            <input type="text" v-model="buyerCity" class="form-control" id="city">
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">State</label> 
                            <VueMultiselect
                                v-model="buyerState"
                                :options="States.USStates"
                                :searchable="true"
                                :show-labels="false"
                                :allow-empty="false">
                            </VueMultiselect>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">Zip</label> 
                            <input type="text" v-model="buyerZip" class="form-control" id="zip">
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">Country</label> 
                            <input type="text" value="US" class="form-control" id="country" disabled>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <p class="text-light font-italic font-semibold text-center">
                            Currently, only US addresses are supported. International shipping is coming soon.
                        </p>
                    </div>

                    <div class="col-12 text-end">
                        <button class="btn btn-sm btn-primary" @click.prevent="saveAddress(false)">Save</button>
                    </div>
                </div>

            </div>
            <hr>
            <div>
                <div class="mb-5">
                    <h4>Seller Shipping Info</h4>
                </div>

                <div class="row g-5">
                    <div class="col-md-12">
                        <div>
                            <label class="form-label">Full Name/Business Name</label> 
                            <input type="text" v-model="sellerFullName" class="form-control" id="sellerFullName">
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">Address</label> 
                            <input type="text" v-model="sellerAddress" class="form-control" id="sellerAddress">
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">City</label> 
                            <input type="text" v-model="sellerCity" class="form-control" id="sellerCity">
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">State</label> 
                            <VueMultiselect
                                v-model="sellerState"
                                :options="States.USStates"
                                :searchable="true"
                                :show-labels="false"
                                :allow-empty="false">
                            </VueMultiselect>                          
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">Zip</label> 
                            <input type="text" v-model="sellerZip" class="form-control" id="sellerZip">
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div>
                            <label class="form-label">Country</label> 
                            <input type="text" value="US" class="form-control" id="sellerCountry" disabled>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <p class="text-light font-italic font-semibold text-center">
                            Currently, only US addresses are supported. International shipping is coming soon.
                        </p>
                    </div>

                    <div class="col-12 text-end">
                        <button class="btn btn-sm btn-primary" @click.prevent="saveAddress(true)">Save</button>
                    </div>
                </div>

            </div>
            <hr>
        </div>
    </main>
</div>
</section>
</main>

</template>

<script lang="ts" setup>
import LoadingHelper from '@/helpers/LoadingHelper';
import StringHelper from '@/helpers/StringHelper';
import ToastHelper from '@/helpers/ToastHelper';
import { toggleModal } from '@/hooks/BootstrapHooks';
import User from '@/models/User';
import { Address, UserAttributes } from '@/services/api/models';
import { RestApi } from '@/services/RestApi';
import StoreMutations from '@/store/store.constants';
import { computed, onMounted, ref, watch } from 'vue';
import States from '@/enums/States';
import VueMultiselect from 'vue-multiselect'
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';

const store = useStore();

const { currentUser } = storeToRefs(store);

const buyerFullName = ref('');
const buyerAddress = ref('');
const buyerCity = ref('');
const buyerState = ref('');
const buyerZip = ref('');
const buyerPhone = ref('');

const sellerFullName = ref('');
const sellerAddress = ref('');
const sellerCity = ref('');
const sellerState = ref('');
const sellerZip = ref('');
const sellerPhone = ref('');

function initializeValues() {    
    const userAttributes = currentUser.value.userAttributes as UserAttributes;

    buyerFullName.value = userAttributes?.buyerAddress?.fullName ?? '';
    buyerAddress.value = userAttributes?.buyerAddress?.street1 ?? '';
    buyerCity.value = userAttributes?.buyerAddress?.city ?? '';
    buyerState.value = userAttributes?.buyerAddress?.state ?? States.USStates[0];
    buyerZip.value = userAttributes?.buyerAddress?.zip ?? '';    

    sellerFullName.value = userAttributes?.sellerAddress?.fullName;
    sellerAddress.value = userAttributes?.sellerAddress?.street1;
    sellerCity.value = userAttributes?.sellerAddress?.city;
    sellerState.value = userAttributes?.sellerAddress?.state ?? States.USStates[0];
    sellerZip.value = userAttributes?.sellerAddress?.zip;
}

async function saveAddress(isSellerAddress: boolean) {

    const currentFullName = isSellerAddress ? sellerFullName.value : buyerFullName.value;
    const currentAddress = isSellerAddress ? sellerAddress.value : buyerAddress.value;
    const currentCity = isSellerAddress ? sellerCity.value : buyerCity.value;
    const currentState = isSellerAddress ? sellerState.value : buyerState.value;
    const currentZip = isSellerAddress ? sellerZip.value : buyerZip.value;

    // if (StringHelper.isNullOrEmpty(phone.value)) {
    //     ToastHelper.error('Phone number is required')
    //     return;
    // }    

    // if (StringHelper.isNullOrEmpty(address.value)
    //     || StringHelper.isNullOrEmpty(city.value) 
    //     || StringHelper.isNullOrEmpty(state.value) 
    //     || StringHelper.isNullOrEmpty(zip.value) 
    // ) {
    //     ToastHelper.error('Some address values are missing. Please enter all address values to save.')
    //     return;
    // }
    
    const loader = LoadingHelper.showLoader();

    try {

        const userAddress = {
            // phone: phone.value,
            fullName: currentFullName,
            street1: currentAddress,
            city: currentCity,
            state: currentState,
            zip: currentZip,
            country: 'US'
        } as Address;

        await RestApi.User.saveAddress(userAddress, isSellerAddress);

        await setCurrentUser();

        ToastHelper.success('Your address has been successfully saved')                
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

onMounted(() => {
    initializeValues()
})

</script>

<style scoped>

</style>