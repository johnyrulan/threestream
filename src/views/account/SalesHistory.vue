<template>
<main class="main-content mt-0">
  <div class="flex-lg-1">
    <main class="pt-6 pb-3 bg-dark">
      <div class="container-fluid max-w-screen-md vstack gap-6">
          <div class="card">
              <div class="card-body">
                  <div class="mb-3">
                      <h4 class="text-dark">Marketplace Sales</h4>
                      <h5>Total Sale Amount: ${{ NumberHelper.normalizeCurrencyFromAPI(totalSaleAmount) }}</h5>
                  </div>
                  <div class="list-group list-group-flush" v-for="(sale, index) in marketplaceSales" :key="index">
                      <div class="list-group-item d-flex">
                          <div class="flex-fill"><span class="d-block h6 font-semibold mb-1">{{ sale.nftName }}</span>
                              <p class="text-sm">Sold to <span class="text-muted">{{ sale.buyerName }}</span> on {{ (new Date(sale.purchaseDate)).toLocaleDateString() }}</p>
                          </div>
                          <div class="ms-auto text-end align-self-center">
                              <div class="d-flex align-items-center gap-4">
                                  <div>
                                    <span class="font-semibold text-base text-heading">${{ NumberHelper.normalizeCurrencyFromAPI(sale.amount) }}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="text-center text-muted font-italic" v-if="marketplaceSales.length === 0">
                    You don't have any marketplace sales yet
                  </div>
              </div>
          </div>

      </div>
    </main>
  </div>
</main>
</template>

<script lang="ts" setup>
import LoadingHelper from '@/helpers/LoadingHelper';
import ToastHelper from '@/helpers/ToastHelper';
import NumberHelper from '@/helpers/NumberHelper';
import { UserSaleResponseModel } from '@/services/api/models';
import SaleService from '@/services/domain/SaleService';
import { computed, onMounted, ref } from 'vue';

const marketplaceSales = ref([] as UserSaleResponseModel[]);
const totalSaleAmount = ref(0)

function calculateTotalSaleAmount() {
    totalSaleAmount.value = 0;

    marketplaceSales.value.forEach((val) => {
        totalSaleAmount.value += val.amount;
    })
}

async function getSalesSoldInMarketplace() {
  const loader = LoadingHelper.showLoader();

  try {
    marketplaceSales.value = await SaleService.getSalesSoldInMarketplace();
    calculateTotalSaleAmount();
  } catch (err) {
      ToastHelper.error('There was an error while getting your marketplace sales')
  }

  LoadingHelper.hideLoader(loader);
}

onMounted(async () => {
    await getSalesSoldInMarketplace();
})
</script>

<style scoped>

</style>