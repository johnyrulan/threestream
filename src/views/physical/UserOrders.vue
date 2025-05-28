<template>
<header>
  <div class="container-fluid">
    <div class="pt-6">
      <div class="row align-items-center">
        <div class="col-12 mb-4 mb-sm-0">
          <!-- Title -->
          <h1 class="h2 ls-tight">
            Your Orders
          </h1>
        </div>
      </div>
    </div>
  </div>
</header>  

<div class="container-fluid">
  <div class="table-responsive">
    <table class="table table-hover table-nowrap">
      <thead class="table-light">
        <tr>
          <th scope="col"></th>
          <th scope="col">Order Id</th>
          <th scope="col">Name</th>
          <th scope="col">Seller</th>
          <th scope="col">Order Date</th>
          <th scope="col">Status</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white" v-for="(order, index) in orders" :key="index">
          <td>
            <div class="d-flex align-items-center">
              <div class="ms-3">     
                <img :src="ImageHelper.getAssetByType(order.productAttributes?.images[0], FileRequestType.PhysicalAssetImage)"
                  class="h-24 w-24 rounded-3"
                />          
              </div>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <div class="ms-3">
                <span class="text-heading font-semibold text-uppercase">
                  {{ order.orderId }}
                </span>                
              </div>
            </div>
          </td>          
          <td>
            <div class="d-flex align-items-center">
              <div class="ms-3">
                <span class="text-heading font-semibold text-uppercase">
                  {{ order.name }}
                </span>                
              </div>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <div class="ms-3">
                <span class="text-heading font-semibold text-uppercase">
                  {{ order.sellerName }}
                </span>                
              </div>
            </div>
          </td>          
          <td>
            <span class="text-current">{{ new Date(order.created).toDateString() }}</span>
          </td>
          <td>
            <span class="badge rounded-pill bg-opacity-30 bg-success text-success">
              {{ order.packageDeliveryStatus === PackageDeliveryStatus.Unknown ? 'Awaiting Shipment' : order.packageDeliveryStatus }}
            </span>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <div class="ms-3">
                <a v-if="order.trackingUrl" :href="order.trackingUrl" target="_blank" class="btn d-inline-flex btn-sm btn-secondary rounded-pill ms-2">
                    <span class=" pe-2">
                        <i class="bi bi-box-seam-fill"></i>
                    </span>
                    <span>Track Package</span>
                </a>               
              </div>
            </div>
          </td>             
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script lang="ts" setup>
import { FileRequestType, PackageDeliveryStatus, UserOrder } from '@/services/api/models';
import { RestApi } from '@/services/RestApi';
import { onMounted, ref } from 'vue';
import ImageHelper from '@/helpers/ImageHelper';

const orders = ref([] as UserOrder[])

onMounted(async () => {
  orders.value = (await RestApi.Sales.getUserOrders()).data;
})

</script>

<style scoped>

</style>