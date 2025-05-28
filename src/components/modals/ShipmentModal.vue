<template>
<div class="modal fade" id="shipmentModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="shipmentModal"  aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg shipmentModal-modal">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <div class="card shadow-none">
                    <!-- <div class="row justify-content-center">
                        <h6 class="font-bold mb-2 text-center">Update your Shipping Information</h6>
                    </div> -->
                    <img src="https://www.ups.com/assets/resources/webcontent/images/shipment-size-weight-measure-package-B-1224353-Q421.jpg" alt="">
                </div>
                <div class="my-2">
                    <h3 class="text-center mt-2">Create a Shipment</h3>

                    <p class="text-muted font-semibold font-italic text-sm mt-3">
                        Creating a Shipment will generate your shipping label. We will shop for the most competitive rate with shipping providers to send your package. However, please note that the package information has be accurate - if it isn't re-generating a label will incur a cost to the seller.
                    </p>

                    <table class="table table-primary mt-3">
                        <thead>
                            <tr>
                                <th scope="col">Order Id</th>
                                <th scope="col">Product</th>
                                <th scope="col">Order Date</th>
                                <th scope="col">Livestream</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders">
                                <th scope="row">{{ order.orderId }}</th>
                                <td>{{ order.productName }}</td>
                                <td>{{ new Date(order.orderCreated).toDateString() }}</td>
                                <td>{{ order.livestreamName }}</td>
                            </tr>
                        </tbody>
                    </table>                    

                    <div class="mt-3">
                        <label for="length" class="form-label">Length</label>
                        <input type="number" class="form-control" id="length" placeholder="12" v-model="length">
                    </div>
                    
                    <div class="mt-3">
                        <label for="width" class="form-label">Width</label>
                        <input type="number" class="form-control" id="width" placeholder="8" v-model="width">
                    </div>
                    
                    <div class="mt-3">
                        <label for="height" class="form-label">Height</label>
                        <input type="number" class="form-control" id="height" placeholder="1" v-model="height">
                    </div>

                    <div class="mt-3">
                        <label for="packageSizeUnit" class="form-label">Package Size Unit</label>
                        <select class="form-select" v-model="packageSizeUnit">
                            <option v-for="unit of PackageSizeUnit">{{ unit }}</option>                                                    
                        </select>
                    </div>
                    
                    <div class="mt-3">
                        <label for="weight" class="form-label">Weight</label>
                        <input type="number" class="form-control" id="weight" placeholder="2" v-model="weight">
                    </div>

                    
                    <div class="mt-3">
                        <label for="packageSizeUnit" class="form-label">Package Weight Unit</label>
                        <select class="form-select" v-model="packageWeightUnit">
                            <option v-for="unit of PackageWeightUnit">{{ unit }}</option>                                                    
                        </select>
                    </div>
                                          
                </div>
            </div>
            <div class="modal-footer py-1">
                <button  type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal">
                    Cancel
                </button>
                <button type="button" class="btn btn-sm btn-success" @click.prevent="createShipment">
                    Create Shipment
                </button>
            </div>
        </div>
    </div>
</div>
<div class="offcanvas offcanvas-end w-full w-lg-1/3" data-bs-scroll="true" data-bs-backdrop="true" tabindex="-1" id="offcanvasCreateShipment" aria-labelledby="offcanvasCreateShipment">
    <div class="offcanvas-header border-bottom py-5 bg-surface-secondary">
    <h5 class="offcanvas-title" id="offcanvasCreateShipment">Create Shipment</h5>
    <button type="button" class="btn-close text-reset text-xs" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body vstack gap-5">
        <div class="card shadow-none">
            <img src="https://www.ups.com/assets/resources/webcontent/images/shipment-size-weight-measure-package-B-1224353-Q421.jpg" alt="">
        </div>
        <div class="my-2">
            <h3 class="mt-2">Create a Shipment</h3>

            <p class="text-muted font-semibold font-italic text-sm mt-2">
                Creating a Shipment will generate your shipping label. We will shop for the most competitive rate with shipping providers to send your package. However, please note that the package information has be accurate - if it isn't, re-generating a label will incur a cost to the seller.
            </p>

            <h4 class="mt-3">Order Details</h4>
            <table class="table table-primary table-sm mt-3">
                <thead>
                    <tr>
                        <th scope="col">Order Id</th>
                        <th scope="col">Product</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Livestream</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders">
                        <th scope="row">{{ order.orderId }}</th>
                        <td>{{ order.productName }}</td>
                        <td>{{ new Date(order.orderCreated).toDateString() }}</td>
                        <td>{{ order.livestreamName }}</td>
                    </tr>
                </tbody>
            </table>                    

            <div class="mt-3">
                <label for="length" class="form-label">Length</label>
                <input type="number" class="form-control" id="length" placeholder="12" v-model="length">
            </div>
            
            <div class="mt-3">
                <label for="width" class="form-label">Width</label>
                <input type="number" class="form-control" id="width" placeholder="8" v-model="width">
            </div>
            
            <div class="mt-3">
                <label for="height" class="form-label">Height</label>
                <input type="number" class="form-control" id="height" placeholder="1" v-model="height">
            </div>

            <div class="mt-3">
                <label for="packageSizeUnit" class="form-label">Package Size Unit</label>
                <select class="form-select" v-model="packageSizeUnit">
                    <option v-for="unit of PackageSizeUnit">{{ unit }}</option>                                                    
                </select>
            </div>
            
            <div class="mt-3">
                <label for="weight" class="form-label">Weight</label>
                <input type="number" class="form-control" id="weight" placeholder="2" v-model="weight">
            </div>

            
            <div class="mt-3">
                <label for="packageSizeUnit" class="form-label">Package Weight Unit</label>
                <select class="form-select" v-model="packageWeightUnit">
                    <option v-for="unit of PackageWeightUnit">{{ unit }}</option>                                                    
                </select>
            </div>      
            
            <div class="mt-3">
                <label for="labelType" class="form-label">Label Type</label>
                <select class="form-select" v-model="isThermal">
                    <option :value="true">Thermal</option>                                               
                    <option :value="false">Regular</option>                                               
                </select>
            </div>      
            
            <div class="mt-3">
                <label for="payType" class="form-label">Payment Option</label>
                <select class="form-select" v-model="isSellerPaid">
                    <option :value="false">Regular</option>                                               
                    <option :value="true">Seller Paid</option>                                               
                </select>
            </div>               
        </div>
    </div>
    <div class="modal-footer py-2 bg-surface-secondary">
    <button type="button" class="btn btn-sm btn-danger" data-bs-dismiss="offcanvas">Close</button>
    <button type="button" class="btn btn-sm btn-success" @click.prevent="createShipment">
        Create Shipment
    </button>
    </div>
</div>
</template>

<script lang="ts" setup>
import { CreateShipmentRequestModel, PackageSizeUnit, PackageWeightUnit, SellerOrderDTO } from '@/services/api/models';
import { ref } from 'vue';
import eventBus from '@/events/EventBus';
import { toggleOffCanvas, toggleModal } from '@/hooks/BootstrapHooks';
import LoadingHelper from '@/helpers/LoadingHelper';
import { RestApi } from '@/services/RestApi';
import ToastHelper from '@/helpers/ToastHelper';

const length = ref(0)
const width = ref(0)
const height = ref(0)
const weight = ref(0)

const packageSizeUnit = ref(PackageSizeUnit.Inches)
const packageWeightUnit = ref(PackageWeightUnit.Oz)
const isThermal = ref(true)
const isSellerPaid = ref(false)

const orders = ref([] as SellerOrderDTO[])

eventBus.on('onCreateShipment', (value: { orders: SellerOrderDTO[] }) => {
    orders.value = value.orders;

    resetValues()

    toggleOffCanvas('offcanvasCreateShipment', 'show')
    // toggleModal('shipmentModal', 'show')
})

function resetValues() {
    length.value = 0;
    width.value = 0;
    height.value = 0;
    weight.value = 0
    packageSizeUnit.value = PackageSizeUnit.Inches;
    packageWeightUnit.value = PackageWeightUnit.Oz;
}

async function createShipment() {
    const loader = LoadingHelper.showLoader()

    try {
        const request: CreateShipmentRequestModel = {
            buyerId: orders.value[0].buyerId,
            orderIds: orders.value.map(o => o.orderId),
            isThermal: isThermal.value,
            isSellerPaid: isSellerPaid.value,
            shipment: {
                length: length.value,
                width: width.value,
                height: height.value,
                packageSizeUnit: packageSizeUnit.value,
                weight: weight.value,
                packageWeightUnit: packageWeightUnit.value,                
            }
        }

        await RestApi.Seller.createShipment(request);

        ToastHelper.success('Shipment was successfully created')

        toggleOffCanvas('offcanvasCreateShipment', 'hide')

        eventBus.emit('onShipmentCreated')
    } catch (err) {
        ToastHelper.error('There was an error generating your shipment. Please check your dimensions/weight and try again')
    }

    LoadingHelper.hideLoader(loader)
}

</script>

<style scoped>

</style>