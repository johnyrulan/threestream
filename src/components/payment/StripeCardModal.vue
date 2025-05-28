<template>
<div
    class="modal fade"
    id="addNewCardModal"
    data-bs-backdrop="static"
    tabindex="-1"
    aria-labelledby="addNewCardModal"
    style="display: none"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content shadow-3">
        <div class="modal-header">
          <div
            class="
              icon icon-shape
              rounded-3
              bg-soft-primary
              text-primary text-lg
              me-4
            "
          >
            <i class="bi bi-credit-card-2-front"></i>
          </div>
          <div class="me-auto">
            <h5 class="mb-1 text-dark">Connect your card</h5>
          </div>

        </div>
        <div class="modal-body">
          <!-- Text -->
          <div class="align-items-center mb-5">
            <div class="w-full">
              <label class="form-label text-dark" for="formInputExample">Card details</label>
            </div>
            <div id="card-element"></div>
            <div></div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-sm btn-neutral"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click.prevent="savePaymentMethod()"
          >
            Save Card
          </button>
        </div>
      </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { loadStripe, Stripe, StripeCardElement } from "@stripe/stripe-js";
import { onMounted } from "@vue/runtime-core";
import { PaymentMethod, Merchant } from "@/services/api/models";
import PaymentService from "@/services/PaymentService";
import eventBus from '@/events/EventBus';
import { toggleModal } from "@/hooks/BootstrapHooks";
import ToastHelper from "@/helpers/ToastHelper";
import LoadingHelper from "@/helpers/LoadingHelper";
import { useStore } from "@/store/main.store";
import { storeToRefs } from 'pinia';

const emit = defineEmits<{
  (e: 'cardSaved'): void
}>();

const store = useStore();
const { currentUser } = storeToRefs(store);

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string;
let stripe = {} as Stripe;
let cardElement = {} as StripeCardElement;

async function savePaymentMethod() {
  const loader = LoadingHelper.showLoader();

  try {
    let response = await stripe.createToken(cardElement);

    if (response.token?.card?.funding === 'prepaid') {
      ToastHelper.error('Prepaid funding cards are not allowed!');

      LoadingHelper.hideLoader(loader);

      return;
    }

    await PaymentService.saveCustomerPayment({
      userId: currentUser.value.id,
      cardToken: response.token?.id,
      type: PaymentMethod.Card,
      provider: Merchant.Stripe,
    });

    toggleModal('addNewCardModal', 'hide');

    emit('cardSaved');
  } catch (err) {
    ToastHelper.error('There was an error saving your card. Please try again.')
  }

  LoadingHelper.hideLoader(loader);
}

async function loadStripeCardElement() {
  const loader = LoadingHelper.showLoader();

  try {
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string;
    const s = await loadStripe(stripeKey);
    if (!s) {
      throw Error("Could not load Stripe object");
      return;
    }
    stripe = s;

    const elements = stripe.elements({});
    const style = {
      base: {
        color: "#32325d",
        fontFamily: "Noto Sans, Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "15px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        fontFamily: "Noto Sans, Arial, sans-serif",
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };
    cardElement = elements.create("card", { style: style });
    cardElement.mount("#card-element");
  } catch (err) {
    // ToastHelper.error('There was error loading the credit card form. Please refresh & try again')
  }

  LoadingHelper.hideLoader(loader);
}

onMounted(async () => {
  await loadStripeCardElement();
});
</script>

<style scoped>
</style>