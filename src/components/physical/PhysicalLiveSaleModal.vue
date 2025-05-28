<template>
<div class="modal fade" id="addPhysicalAssetModal" tabindex="-1" aria-labelledby="addPhysicalAssetModal" aria-hidden="true" @keyup.enter="savePhysicalAsset">
  <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content shadow-3">

          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Add a Physical Product</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click.prevent="toggleModal('addPhysicalAssetModal', 'hide')">
              <span aria-hidden="true">&times;</span>
              </button>
          </div>

          <div class="modal-body">
              <div>
                  <div class="mb-5">
                      <label class="form-label" for="password">Name</label>
                      <input v-model="currentPhysicalAssset.name" type="text" class="form-control form-control-muted" />
                  </div>
                  <div class="mb-5">
                      <label class="form-label" for="password">Description</label>
                      <input v-model="currentPhysicalAssset.description" type="text" class="form-control form-control-muted" />
                  </div>
                  <div class="mb-5">
                      <label class="form-label" for="formInputExample">Product Image (optional)</label>
                      <div>                        
                          <img 
                            class="rounded-2 max-h-32 mb-4"
                            :src="ImageHelper.getAssetByType(currentPhysicalAssset.physicalAssetAttributes?.images[0], FileRequestType.PhysicalAssetImage)" 
                            alt="">
                      </div>
                      <div class="card border-2 border-dashed border-primary-hover position-relative">
                          <div class="d-flex justify-content-center px-5 py-5">
                              <label for="product_image_file_upload" class="position-absolute w-full h-full top-0 start-0 cursor-pointer">
                                  <input id="product_image_file_upload" name="product_image_file_upload" type="file" class="visually-hidden" @change="onProductImageUpload($event)">
                              </label>
                              <div class="text-center">
                                  <div class="text-2xl text-muted">
                                      <i class="bi bi-upload"></i>
                                  </div>
                                  <div class="d-flex text-sm mt-3">
                                      <p class="font-semibold">Upload a file or drag and drop</p>
                                  </div>
                                  <p class="text-xs text-gray-500">
                                      PNG, JPG, GIF up to 3MB
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="mb-5">
                    <label class="form-label" for="listingPrice">Quantity</label>

                    <div class="">
                        <div class="input-group position-relative">
                            <input v-model="quantity" type="number" class="form-control" placeholder="Starting Price" aria-label="Starting Price">
                        </div>
                    </div>
                </div>                  
                  <div class="mb-5">
                    <label class="form-label" for="listingPrice">Starting Price</label>

                    <div class="">
                        <div class="input-group position-relative">
                            <span class="input-group-text" id="">&dollar;</span>
                            <input v-model="currentPrice" class="form-control" placeholder="Starting Price" aria-label="Starting Price">
                            <span class="input-group-text" id="">USD</span>
                        </div>
                    </div>
                </div>
              </div>
              <!-- <div class="alert alert-danger mb-5" role="alert" v-for="err in saveWalletAssetErrors" :key="err">
                  {{ err }}
              </div> -->
          </div>

          <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click.prevent="toggleModal('addPhysicalAssetModal', 'hide')">Close</button>
              <button type="button" class="btn btn-primary" @click.prevent="savePhysicalAsset">Save</button>
          </div>
      </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { UploadType } from "@/enums/CommonEnums";
import eventBus from "@/events/EventBus";
import ErrorLogger from "@/helpers/ErrorLogger";
import LoadingHelper from "@/helpers/LoadingHelper";
import NumberHelper from "@/helpers/NumberHelper";
import ToastHelper from "@/helpers/ToastHelper";
import { toggleModal } from "@/hooks/BootstrapHooks";
import { PhysicalAsset, Sale, SaleAssetType, SaleStatus, SaleType, PhysicalAssetStatus, PhysicalAssetType, SaleWithPhysicalAsset, FileRequestType } from "@/services/api/models";
import { RestApi } from "@/services/RestApi";
import { ref } from "@vue/reactivity";
import { computed } from "vue";
import { v4 as uuidv4 } from 'uuid';
import ImageHelper from "@/helpers/ImageHelper";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";

const props = defineProps<{
    livestreamId: string
}>();

const emit = defineEmits<{
    (e: 'onAssetSaved'): void
}>()

const store = useStore()

const { currentUser } = storeToRefs(store);

const currentPhysicalAssset = ref({} as PhysicalAsset)
const currentSale = ref({ floorPrice: 0 } as Sale)
const currentPrice = ref(0)

const quantity = ref(1)

eventBus.on('onEditPhysicalAsset', (value: { saleWithPhysicalAsset: SaleWithPhysicalAsset }) => {
    currentSale.value = value.saleWithPhysicalAsset.sale;
    currentPhysicalAssset.value = value.saleWithPhysicalAsset.physicalAsset;

    currentPrice.value = NumberHelper.normalizeCurrencyFromAPI(value.saleWithPhysicalAsset.sale.floorPrice)

    toggleModal('addPhysicalAssetModal', 'show')
})

async function savePhysicalAsset() {

  if (quantity.value < 1) {
    ToastHelper.error('Quantity must be atleast 1 or more')
  }

  const loader = LoadingHelper.showLoader();

  try {
    const sale: Sale = {
      id: currentSale.value.id,
      floorPrice: NumberHelper.normalizeCurrencyToSave(currentPrice.value),
      saleAssetType: SaleAssetType.Physical,
      saleStatus: SaleStatus.Unsold,
      saleType: SaleType.LiveAuction,
      livestreamId: props.livestreamId,
      sellerUserId: currentUser.value.id,
      quantity: quantity.value
    }

    currentPhysicalAssset.value.physicalAssetStatus = PhysicalAssetStatus.ListedForSale;
    currentPhysicalAssset.value.physicalAssetType = PhysicalAssetType.Physical;
    currentPhysicalAssset.value.userId = currentUser.value.id;

    await RestApi.Sales.savePhysicalProduct({
      sale: sale,
      physicalAsset: currentPhysicalAssset.value
    });
    
    toggleModal('addPhysicalAssetModal', 'hide')

    currentPhysicalAssset.value = {}

    ToastHelper.success('Physical Product added successfully');
    
    emit('onAssetSaved')
  } 
  catch (err) {
    ToastHelper.error('There was an error saving your product. Please try again.')
    await ErrorLogger.logApiError(err)
  }  

  LoadingHelper.hideLoader(loader)
}

async function onProductImageUpload(event: any) {
    const file = event.target.files[0]
    let extention = '';

    if (file.type === "image/png") extention = '.png'
    else if (file.type === "image/jpeg") extention = '.jpg'
    else if (file.type === "image/gif") extention = '.gif'
    else {
        ToastHelper.error("Only JPG, PNG & GIF files allowed")
        return
    }

    const imageName = uuidv4() + extention;

    const loader = LoadingHelper.showLoader();

    try {
        await RestApi.Upload.uploadImage(imageName, file, FileRequestType.PhysicalAssetImage)

        currentPhysicalAssset.value.physicalAssetAttributes = { 
          images: [imageName],
          videos: []
        }

        ToastHelper.success('Image successfully uploaded')
    } catch (err) {
        ToastHelper.error('There was an error uploading the image. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}


</script>

<style scoped>

</style>