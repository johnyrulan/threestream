<template>
<tr>
    <td>
        <span class="font-semibold">{{ props.sellerShipment.sellerShipments[0].buyerName }}</span>
        <span class="d-block text-xs text-muted">
            {{ FormatHelper.convertAddressToString(props.sellerShipment.sellerShipments[0].buyerAttributes?.buyerAddress) }}
        </span>
    </td>
    <td>
        <span class="font-semibold">{{ props.sellerShipment.shipmentId }}</span>
    </td>
    <td>{{ props.sellerShipment.sellerShipments.length }}</td>
    <td>
        <span class="badge rounded-pill bg-opacity-30 bg-info text-dark" 
            v-if="props.sellerShipment.packageDeliveryStatus === PackageDeliveryStatus.Unknown">Pre-Transit</span>
        <span class="badge rounded-pill bg-opacity-30 bg-success text-success" 
            v-else>{{ props.sellerShipment.packageDeliveryStatus }}</span>            
    </td>
    <td>
        <button class="btn d-inline-flex btn-sm btn-dark rounded-pill" @click="toggleCollapse(props.sellerShipment.shipmentId)">
            <span class=" pe-2">
                <i class="bi bi-chevron-double-down"></i>
            </span>
            <span>View Details</span>
        </button>
        <a :href="props.sellerShipment.shipmentAttributes?.LabelURL" target="_blank" class="btn d-inline-flex btn-sm btn-secondary rounded-pill ms-2">
            <span class=" pe-2">
                <i class="bi bi-file-earmark-arrow-down"></i>
            </span>
            <span>Download Label</span>
        </a>
        <a :href="props.sellerShipment.shipmentAttributes?.TrackingUrlProvider" target="_blank" class="btn d-inline-flex btn-sm btn-secondary rounded-pill ms-2">
            <span class=" pe-2">
                <i class="bi bi-box-seam-fill"></i>
            </span>
            <span>Track Package</span>
        </a>        
    </td>
</tr>

<tr>
    <td colspan="12">
        <div class="collapse rounded-3" :id="props.sellerShipment.shipmentId">
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
                    <tr v-for="shipment in props.sellerShipment.sellerShipments">
                        <th scope="row">{{ shipment.orderId }}</th>
                        <td>{{ shipment.productName }}</td>
                        <td>{{ new Date(shipment.orderCreated).toDateString() }}</td>
                        <td>{{ shipment.livestreamName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </td>
</tr>
</template>

<script lang="ts" setup>
import { SellerShipmentViewModel, PackageDeliveryStatus } from '@/services/api/models';
import FormatHelper from '@/helpers/FormatHelper';
import { toggleCollapse } from '@/hooks/BootstrapHooks';
import { onMounted } from 'vue';

const props = defineProps<{
    sellerShipment: SellerShipmentViewModel
}>();

</script>

<style scoped>

</style>