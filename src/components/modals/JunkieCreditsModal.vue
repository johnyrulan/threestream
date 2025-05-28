<template>
<div class="modal fade" id="purchaseCreditsModal" tabindex="-1" aria-labelledby="purchaseCreditsModal" style="display: none" aria-hidden="true">
    <div class="modal-dialog purchaseCredits-modal">
        <div class="modal-content">
            <div class="modal-body">
                <div class="card">
                    <div class="row justify-content-center">
                        <h6 class="font-bold mb-2 text-center">Purchase JUNKIE Credits</h6>

                    </div>
                </div>
                <div class="my-2 text-center">
                    <h3>JUNKIE Credits can be used to purchase digital goods!</h3>
                </div>
                <div class="my-2">
                    <label class="form-label text-dark" for="listingPrice">Purchase Amount: ${{ amount  }}</label>
                    <div class="vstack gap-4">
                        <div class="d-flex gap-3">
                            <input class="form-check-input flex-shrink-0 text-lg" type="radio" name="projecy-privacy" checked="checked"  data-form-type="other" v-model="amount" :value="5">
                            <div class="pt-1 form-checked-content">
                                <h6 class="mb-1 lh-relaxed text-dark">$5 Credits</h6>
                            </div>
                        </div>
                        <div class="d-flex gap-3">
                            <input class="form-check-input flex-shrink-0 text-lg" type="radio" name="projecy-privacy" 
                            data-form-type="other" v-model="amount" :value="10">
                            <div class="pt-1 form-checked-content">
                                <h6 class="mb-1 lh-relaxed text-dark">$10 Credits</h6>
                            </div>
                        </div>
                        <div class="d-flex gap-3">
                            <input class="form-check-input flex-shrink-0 text-lg" type="radio" name="projecy-privacy" 
                            data-form-type="other" v-model="amount" :value="25">
                            <div class="pt-1 form-checked-content">
                                <h6 class="mb-1 lh-relaxed text-dark">$25 Credits</h6>
                            </div>
                        </div>     
                        <div class="d-flex gap-3">
                            <input class="form-check-input flex-shrink-0 text-lg" type="radio" name="projecy-privacy" 
                            data-form-type="other" v-model="amount" :value="50">
                            <div class="pt-1 form-checked-content">
                                <h6 class="mb-1 lh-relaxed text-dark">$50 Credits</h6>
                            </div>
                        </div>
                        <div class="d-flex gap-3">
                            <input class="form-check-input flex-shrink-0 text-lg" type="radio" name="projecy-privacy" 
                            data-form-type="other" v-model="amount" :value="100">
                            <div class="pt-1 form-checked-content">
                                <h6 class="mb-1 lh-relaxed text-dark">$100 Credits</h6>
                            </div>
                        </div>                                           
                    </div>
                </div>

                <div id="paypalButtons" class="my-2"></div>

            <div class="modal-footer py-1">
                <button  type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>
</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { loadScript } from "@paypal/paypal-js";
import ErrorLogger from '@/helpers/ErrorLogger';
import { RestApi } from '@/services/RestApi';
import eventBus from '@/events/EventBus';
import { toggleModal } from '@/hooks/BootstrapHooks';
import ToastHelper from '@/helpers/ToastHelper';

const amount = ref(10)

async function initializePayPal() {
    let paypal;

    try {
        paypal = await loadScript({ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID });
    } catch (error) {
        console.error("failed to load the PayPal JS SDK script", error);
    }

    if (paypal) {
        try {
            await paypal.Buttons({
                async createOrder() {
                    return await createOrder();
                },
                async onApprove(data) {
                    await captureOrder(data.orderID);
                }
            }).render("#paypalButtons");            
        } catch (error) {
            console.error("failed to render the PayPal Buttons", error);
        }
    }
}

async function createOrder() {
    try {
        const orderId = (await RestApi.PaymentCredit.createOrder(amount.value)).data;

        return orderId;
    } catch (err) {
        await ErrorLogger.logApiError(err)
    }
}

async function captureOrder(orderId: string) {
    try {
        var isSuccessful = (await RestApi.PaymentCredit.captureOrder(orderId)).data;

        if (isSuccessful) {
            eventBus.emit('onJunkieBalanceUpdated')
            toggleModal('purchaseCreditsModal', 'hide')
            ToastHelper.success('Your credits have been successfully added!')
        }        
        else {
            ToastHelper.error('There was an error with your payment. Please check your card & try again')
        }
    } catch (err) {
        ToastHelper.error('There was an error with your payment. Please check your card & try again')
        await ErrorLogger.logApiError(err)
    }
}

onMounted(() => {
    initializePayPal()    
})
</script>

<style scoped>

</style>