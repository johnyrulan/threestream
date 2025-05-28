<template>
<header>
  <div class="container-fluid">
    <div class="pt-6">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0">
          <!-- Title -->
          <h1 class="h2 ls-tight">
            Pending Orders
          </h1>
        </div>
      </div>
    </div>
  </div>
</header> 

<div class="container-fluid mt-3">
<div class="table-responsive rounded-3">
  <table class="table table-hover table-nowrap table-light">
    <thead class="table-light">
      <tr>        
        <th scope="col">Buyer</th>
        <th scope="col">Total Orders</th>
        <th scope="col">Status</th>        
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <PendingOrderTableRow v-for="sellerOrder in pendingOrders" :seller-order="sellerOrder" :key="sellerOrder.buyerId" />
    </tbody>
  </table>
</div>
</div>

<header>
  <div class="container-fluid">
    <div class="pt-6">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0">
          <!-- Title -->
          <h1 class="h2 ls-tight">
            Shipments
          </h1>
        </div>
      </div>
    </div>
  </div>
</header> 

<div class="container-fluid mt-3">
<div class="table-responsive rounded-3">
  <table class="table table-hover table-nowrap table-light">
    <thead class="table-light">
      <tr>        
        <th scope="col">Buyer</th>
        <th scope="col">Shipment Id</th>
        <th scope="col">Total Orders</th>
        <th scope="col">Status</th>        
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <SellerShipmentTableRow v-for="(shipment, index) in sellerShipments" :seller-shipment="shipment" :key="shipment.shipmentId" />
    </tbody>
  </table>
</div>
</div>

<ShipmentModal/>
</template>

<script lang="ts" setup>
import { SellerOrdersViewModel, SellerShipmentViewModel } from '@/services/api/models';
import { RestApi } from '@/services/RestApi';
import { onMounted, ref } from 'vue';
import PendingOrderTableRow from '@/components/seller/PendingOrderTableRow.vue';
import SellerShipmentTableRow from '@/components/seller/SellerShipmentTableRow.vue';
import ShipmentModal from '@/components/modals/ShipmentModal.vue';
import eventBus from '@/events/EventBus';


const pendingOrders = ref([] as SellerOrdersViewModel[])

async function getPendingOrders() {
  pendingOrders.value = (await RestApi.Seller.getPendingOrders()).data;
}

const sellerShipments = ref([] as SellerShipmentViewModel[])

async function getSellerShipments() {
  sellerShipments.value = (await RestApi.Seller.getSellerShipments()).data;
}

async function fetchData() {
  await getPendingOrders();
  await getSellerShipments()
}

eventBus.on('onShipmentCreated', async () => {
  await fetchData();
})

onMounted(async () => {
  await fetchData();
})

</script>

<style scoped>

</style>