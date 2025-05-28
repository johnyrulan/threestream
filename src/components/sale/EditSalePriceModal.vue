<template>
<div class="modal fade" id="editSalePriceModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="editSalePriceModal" style="display: none" aria-hidden="true">
    <div class="modal-dialog listforsale-modal">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                    <div class="card shadow-none" v-if="currentNFTAsset.name">
                <div class="row justify-content-center">
                    <h6 class="font-bold mb-2 text-center">{{ currentNFTAsset.name }}</h6>
                    <div class="col-6">
                        <a href="#" class="d-block" v-if="currentNFTAsset.mainVideoUrl">
                            <video class="img-fluid rounded-2" muted alt="..." :src="currentNFTAsset.mainVideoUrl" />
                        </a>
                        <a href="#" class="d-block" v-else>
                            <img class="img-fluid rounded-2 w-full h-full" :src="currentNFTAsset.mainImgUrl" />
                        </a>
                    </div>
                    <div class="px-4 pt-2 pb-4 text-center">
                        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2 me-2" v-if="currentNFTAsset.rarity">Rarity: {{ currentNFTAsset.rarity }}</span>
                        <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 mb-1 shadow-2" v-if="currentNFTAsset.mintNumber && currentNFTAsset.totalSupply">Mint {{ currentNFTAsset.mintNumber }} of {{ currentNFTAsset.totalSupply }}</span>
                    </div>
                </div>
                </div>
                <div class="mt-2">
                    <label class="form-label" for="listingPrice">Sale Type</label>
                    <div>
                        <input class="form-check-input" type="radio" :value="SaleType.LiveAuction" v-model="selectedSaleType"> Auction
                        <br/>
                        <input class="form-check-input" type="radio" :value="SaleType.LiveSale" v-model="selectedSaleType"> Buy Now  
                        <br/>          
                        <input class="form-check-input" type="radio" :value="SaleType.LiveGiveaway" v-model="selectedSaleType"> Giveaway
                    </div>
                </div>                  
                <div class="my-2" v-if="selectedSaleType !== SaleType.LiveGiveaway">
                    <label class="form-label" for="listingPrice">Price</label>

                    <div class="">
                        <div class="input-group position-relative">
                            <span class="input-group-text" id="">&dollar;</span>
                            <input v-model="price" class="form-control" placeholder="Price" aria-label="Price">
                            <span class="input-group-text" id="">USD</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer py-1">
                <button  type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal">
                    Cancel
                </button>
                <button @click.prevent="updateSalePrice" type="button" class="btn btn-sm btn-success">
                    Save
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import NumberHelper from "@/helpers/NumberHelper";
import ToastHelper from "@/helpers/ToastHelper";
import useEmitter from "@/helpers/useEmitter";
import { toggleModal } from "@/hooks/BootstrapHooks";
import NFTAsset from "@/models/NFTAsset";
import { SaleType } from "@/services/api/models";
import SaleService from "@/services/domain/SaleService";
import { ref } from "vue";

const emitter = useEmitter();

const saleId = ref('');
const currentNFTAsset = ref({} as NFTAsset);
const price = ref(0);
const selectedSaleType = ref(SaleType.LiveSale)

emitter.on('OpenEditSalePriceModal', (value: { asset: NFTAsset, saleId: string, price: number, saleType: SaleType }) => {
    currentNFTAsset.value = value.asset;
    saleId.value = value.saleId;
    price.value = value.price;
    selectedSaleType.value = value.saleType;
    toggleModal('editSalePriceModal', 'show');
});

async function updateSalePrice () {
    try {
        await SaleService.updateSalePrice(saleId.value,  NumberHelper.normalizeCurrencyToSave(price.value), selectedSaleType.value);
        ToastHelper.success('Sale price updated successfully.');
        toggleModal('editSalePriceModal', 'hide');
        emitter.emit('SalePriceUpdated', {saleId: saleId.value, newPrice: price.value});
    } catch (err) {
        ToastHelper.error('There was an error updating the sale price.');
    }
}
</script>