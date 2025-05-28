<template>
<tr>
    <td>
        <span class="font-semibold">{{ props.sellerOrder.buyerName }}</span>
        <span class="d-block text-xs text-muted">
            {{ FormatHelper.convertAddressToString(props.sellerOrder.buyerAttributes?.buyerAddress) }}
        </span>
    </td>
    <td>{{ props.sellerOrder.sellerOrders.length }}</td>
    <td>
        <span class="badge rounded-pill bg-opacity-30 bg-success text-success">Success</span>
    </td>
    <td>
        <button class="btn d-inline-flex btn-sm btn-dark rounded-pill" @click="toggleCollapse(props.sellerOrder.buyerId)">
            <span class=" pe-2">
                <i class="bi bi-chevron-double-down"></i>
            </span>
            <span>View Details</span>
        </button>
        <button class="btn d-inline-flex btn-sm btn-primary rounded-pill ms-2" @click="createShipment">
            <span class=" pe-2">
                <i class="bi bi-truck"></i>
            </span>
            <span>Create Shipment</span>
        </button>
    </td>
</tr>

<tr>
    <td colspan="12">
        <div class="collapse rounded-3" :id="props.sellerOrder.buyerId">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Order Id</th>
                        <th scope="col">Product</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Livestream</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pendingOrder in props.sellerOrder.sellerOrders">
                        <th scope="row">{{ pendingOrder.orderId }}</th>
                        <td>{{ pendingOrder.productName }}</td>
                        <td>{{ new Date(pendingOrder.orderCreated).toDateString() }}</td>
                        <td>{{ pendingOrder.livestreamName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </td>
</tr>
</template>

<script lang="ts" setup>
import { SellerOrdersViewModel } from '@/services/api/models';
import FormatHelper from '@/helpers/FormatHelper';
import { toggleCollapse } from '@/hooks/BootstrapHooks';
import eventBus from '@/events/EventBus';


const props = defineProps<{
    sellerOrder: SellerOrdersViewModel
}>();

function createShipment() {
    eventBus.emit('onCreateShipment', { orders: props.sellerOrder.sellerOrders })
}


</script>

<style scoped>

</style>