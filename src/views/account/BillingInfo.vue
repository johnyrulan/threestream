<template>
<main class="main-content mt-0">
  <div class="flex-lg-1 h-screen">
    <main class="py-6 bg-dark">
      <div class="container-fluid max-w-screen-md vstack gap-6">
          <div class="card">
            <div class="card-body py-4">
              <!-- Icon + Dropdown -->
              <div class="d-flex align-items-center justify-content-between mb-5">
                <div class="flex-1">
                  <!-- Title -->
                  <h6 class="h5 font-semibold mb-1 text-dark">Payout Balance</h6>
                  <!-- Text -->
                  <p class="text-sm text-muted">Your eligible balance that can be withdrawn</p>
                  <p class="text-sm text-muted">Your total pending balance: ${{ pendingBalance }}</p>
                  <!-- <p class="text-sm text-muted font-italic"><span class="text-underline">Digitals</span>: Must have a minimum of $75 to request payout</p> -->
                  <p class="text-sm text-muted font-italic"><span class="text-underline">Packs</span>: All Packs must be opened to request a payout</p>

                  <p class="text-sm text-muted font-italic"><span class="text-underline">Physicals</span>: Payouts become available after the product has been delivered</p>
                  <!-- <p class="text-sm text-muted font-italic">ACH Payouts require setup. PayPal payouts do not require ACH setup.</p> -->

                  <!-- <div class="mt-2" v-if="currentUser.role !== UserRole.Buyer">
                    <span v-if="isChargesEnabled" class="badge bg-success text-white">✅ ACH Payout Setup Complete</span>
                    <span v-else class="badge bg-warning text-white">ACH Payout Setup Incomplete</span>
                  </div> -->


                </div>
                <div class="ms-auto">
                  <div class="d-flex align-items-center mt-5 mb-3 lh-none  text-heading d-block display-5 ls-tight mb-0">
                    <span class="font-semibold text-2xl align-self-start mt-1 mt-sm-1 me-1">$</span>
                    <span>{{ payoutBalance }}</span>
                  </div>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-5">
                <div class="flex-1">
                  <!-- Title -->
                  <h6 class="h5 font-semibold mb-1 text-dark">JUNKIE Credits</h6>
                  <!-- Text -->
                  <p class="text-sm text-muted">Your credit to be able to use to purchase NFTs</p>
                </div>
                <div class="ms-auto">
                  <div class="d-flex align-items-center mt-5 mb-3 lh-none  text-heading d-block display-5 ls-tight mb-0">
                    <span class="font-semibold text-2xl align-self-start mt-1 mt-sm-1 me-1">$</span>
                    <span>{{ creditBalance }}</span>
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <div class="d-flex align-items-center justify-content-between gap-3">
                <!-- <button v-if="isChargesEnabled" class="btn btn-sm btn-primary" @click="toggleModal('requestPayoutModal', 'show')" :disabled="payoutBalance <= 0">Request Payout</button> -->
                <!-- <button v-if="isChargesEnabled" class="btn btn-sm btn-primary" @click="payout(true)" :disabled="totalBalance <= 0">⚡Instant Payout</button> -->

                <div v-if="currentUser.role !== UserRole.Buyer">
                  <!-- <button v-if="isChargesEnabled" class="btn btn-sm btn-secondary" @click="setupPayoutAccount" >Payout Dashboard <i class="bi bi-arrow-right-circle"></i></button>                        
                  <button v-else class="btn btn-sm btn-secondary" @click="setupPayoutAccount" >Setup Payout Account <i class="bi bi-arrow-right-circle"></i></button>   -->
                  <!-- <button v-if="isChargesEnabled && currentUser.role === UserRole.Admin" class="btn btn-sm btn-primary ms-2" @click="payout(false)" :disabled="totalBalance <= 0">Standard Payout</button> -->
                  <button                     
                    class="btn btn-sm btn-primary ms-2" @click="toggleModal('requestPayoutModal', 'show')" 
                    :disabled="payoutBalance <= 0">Request PayPal Payout
                  </button>                  
                </div>

                <button class="btn btn-sm btn-primary" @click="toggleModal('purchaseCreditsModal', 'show')">Purchase JUNKIE Credits</button>                
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body pb-4">
              <!-- Icon + Dropdown -->
              <div class="d-flex align-items-center justify-content-between mb-5">
                <div class="flex-1">
                  <!-- Title -->
                  <h4 class="mb-1 text-dark">Cards</h4>
                  <!-- Text -->
                  <p class="text-sm text-muted">Your payment methods on JUNKIE</p>
                </div>
              </div>
              <div v-if="cards.length > 0">
                <div v-for="(card, index) in cards" :key="index"
                  class="p-3 border border-dashed rounded-2 d-flex align-items-center mb-2">
                  <div class="d-flex w-full">
                    <div class="ms-4 flex-fill">
                      <div class="d-block text-sm text-heading font-semibold mb-1">xxxx-xxxx-xxxx-{{ card.last4 }}</div>
                      <div class="d-block text-sm text-muted">
                        Expiry date: {{ card.expMonth }}/{{ card.expYear }}
                      </div>
                    </div>
                    <div class="d-flex my-auto">
                      <span v-if="card.isDefault" class="badge badge-lg badge-pill bg-success">
                        <i class="bi bi-check2 me-1"></i> Default
                      </span>
                      <button v-else class="btn btn-sm btn-neutral" @click.prevent="setDefaultCard(card.customerId, card.cardId)">Set Default</button>
                      <button class="btn btn-sm btn-danger ms-2" @click="deleteCard(card.customerId, card.cardId)">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="p-3 border border-dashed rounded-2 d-flex align-items-center mb-2">
                <div class="d-flex w-full">
                  <div class="ms-4 flex-fill text-center">
                    <div class="d-block text-sm text-heading font-semibold mb-1">You haven't added any cards yet!</div>
                  </div>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-end pt-4">
                <button class="btn btn-sm btn-primary" @click="toggleModal('addNewCardModal', 'show')">Add New Card</button>
              </div>
            </div>
          </div>
      </div>
    </main>
  </div>

<StripeCardModal @card-saved="listCustomerCards" />
</main>

<div class="modal fade" id="requestPayoutModal" tabindex="-1" aria-labelledby="requestPayoutModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="requestPayoutModal">Request Payout</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div>
          <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" border="0" alt="PayPal Logo"/>
        </div>

        <p class="my-3">
            We currently support Payouts via Paypal! Please make sure to enter
            your PayPal email to receive your Payout balance.
        </p>
        <p class="mt-2 mb-3">
            We will process the payment within 24-48 hours.
        </p>

        <div class="mt-2 mb-3 text-muted font-italic font-sm">We're working on making this faster in the coming few weeks!</div>

        <div class="mb-3">
          <label for="paypal-email" class="col-form-label">Paypal Email:</label>
          <input type="text" class="form-control" id="paypal-email" v-model="payPalEmail" @keyup.enter="requestPayout">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click="requestPayout">Payout</button>
      </div>
    </div>
  </div>
</div>

<JunkieCreditsModal/>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { toggleModal } from "@/hooks/BootstrapHooks";
import StripeCardModal from "@/components/payment/StripeCardModal.vue";
import { CustomerCard, UserRole } from "@/services/api/models";
import PaymentService from "@/services/PaymentService";
import ToastHelper from "@/helpers/ToastHelper";
import { RestApi } from "@/services/RestApi";
import LoadingHelper from "@/helpers/LoadingHelper";
import NumberHelper from "@/helpers/NumberHelper";
import ErrorLogger from "@/helpers/ErrorLogger";
import StringHelper from "@/helpers/StringHelper";
import JunkieCreditsModal from "@/components/modals/JunkieCreditsModal.vue";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";

const store = useStore();

const { currentUser } = storeToRefs(store);
const cards = ref([] as CustomerCard[]);

const payoutBalance = ref(0)
const pendingBalance = ref(0)
const creditBalance = ref(0)
const payPalEmail = ref(currentUser.value.userAttributes.paypalEmail ?? '');
const isChargesEnabled = ref(false)

async function deleteCard(customerId: string, cardId: string) {
  const loader = LoadingHelper.showLoader();

  try {
    await RestApi.Payment.deleteCustomerCard(customerId, cardId);

    ToastHelper.success('Card deleted successfully!');

    await listCustomerCards();

  } catch(err) {
    ToastHelper.error('There was an error while deleting your card');
  }

  LoadingHelper.hideLoader(loader);
}

async function setDefaultCard(customerId: string, cardId: string) {

  const loader = LoadingHelper.showLoader();

  try {
    await RestApi.Payment.setDefautlCustomerCard(customerId, cardId);

    ToastHelper.success('Default card updated!');

    await listCustomerCards();
  } catch(err) {
    ToastHelper.error('There was an error while updating the default card');
  }

  LoadingHelper.hideLoader(loader);
}

async function listCustomerCards() {
  const loader = LoadingHelper.showLoader();

  try {
    cards.value = await PaymentService.listCustomerCards(currentUser.value.id);
  } catch (err) {
      ToastHelper.error('There was an error retrieving your cards')
  }

  LoadingHelper.hideLoader(loader);
}

async function getPayoutBalance() {
  const loader = LoadingHelper.showLoader();

  try {
    const payout = (await RestApi.PaymentCredit.getPayoutBalanceForCurrentUser()).data;

    payoutBalance.value = payout.availableBalance;
    pendingBalance.value = payout.pendingBalance;
  } catch (err) {
      ToastHelper.error('There was an error retrieving your payout balance')
  }

  LoadingHelper.hideLoader(loader);
}

async function getCreditBalance() {
  const loader = LoadingHelper.showLoader();

  try {
    creditBalance.value = NumberHelper.normalizeCurrencyFromAPI((await RestApi.PaymentCredit.getCreditBalanceForCurrentUser()).data);
  } catch (err) {
      ToastHelper.error('There was an error retrieving your payout balance')
  }

  LoadingHelper.hideLoader(loader);
}

async function requestPayout()
{
  if (StringHelper.isNullOrEmpty(payPalEmail.value)) {
    ToastHelper.error('PayPal email cannot be empty')
    return;
  }

  const loader = LoadingHelper.showLoader();

  try {

    if (payPalEmail.value != currentUser.value.userAttributes.paypalEmail) {
      const user = currentUser.value;

      user.userAttributes.paypalEmail = payPalEmail.value;

      await RestApi.User.saveUser(user);
    }

    await RestApi.PaymentCredit.requestPayout(payPalEmail.value);
    ToastHelper.success('Your payout request has been recieved. You should receive it momentarily. Thank you!')
    toggleModal('requestPayoutModal', 'hide')
    await getPayoutBalance();
  } catch (err) {
    const error = await ErrorLogger.logApiError(err)
    ToastHelper.error(error[0])    
  }

  LoadingHelper.hideLoader(loader);
}

async function fetchChargesEnabled() {

  if (currentUser.value.role === UserRole.Buyer) {
    return;
  } 

  const loader = LoadingHelper.showLoader()

  try {
    isChargesEnabled.value = (await RestApi.Payment.isChargesEnabled()).data;
  } catch (err) {
    await ErrorLogger.logApiError(err)
  }

  LoadingHelper.hideLoader(loader)
}

async function setupPayoutAccount() {
  const loader = LoadingHelper.showLoader()

  try {
    const url = (await RestApi.Payment.createAccountLink()).data;
    
    window.location.replace(url);
  } catch (err) {
    await ErrorLogger.logApiError(err)
    ToastHelper.error('There was an error setting up your account')
  }

  LoadingHelper.hideLoader(loader);
}

async function payout(isInstant: boolean) {
  const loader = LoadingHelper.showLoader()

  try {
    await RestApi.Payment.requestPayout(isInstant)
    ToastHelper.success('Payout successful')
  } catch (err) {
    ToastHelper.error('There was an error with the payout. Please try again or contact support at info@junkieapp.xyz')
  }

  await getPayoutBalance()

  LoadingHelper.hideLoader(loader);
}

onMounted(async () => {
  await getPayoutBalance();
  await getCreditBalance()    
  await fetchChargesEnabled()
  await listCustomerCards();
});
</script>

<style scoped>
.greentext {
    color: #00a36d;
  }
  .card.selected {
    background-color:rgba(0,163,109,0.2);
  }
  .badge-secondary {
    color: #fff;
    background-color: #abb3b9;
    font-weight: 500;
  }
</style>