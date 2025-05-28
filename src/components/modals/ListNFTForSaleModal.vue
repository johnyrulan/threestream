<template>
<div class="modal fade" id="listForSaleModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="listForSaleModal" style="display: none" aria-hidden="true">
    <div class="modal-dialog listforsale-modal">
        <div class="modal-content shadow-3">
            <div class="modal-body">
                <div class="card shadow-none" v-if="currentWalletAssetId">
                    <div class="row justify-content-center">
                        <h6 class="font-bold mb-2 text-center">{{ currentNFTAsset.name }}</h6>
                        <div class="col-6">
                            <a href="#" class="d-block" v-if="currentNFTAsset.mainVideoUrl">
                                <video class="img-fluid rounded-2" autoplay playsinline loop muted alt="..." :src="currentNFTAsset.mainVideoUrl" />
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
                <div class="my-2">
                    <label class="form-label text-dark" for="listingPrice">Sale Type</label>
                    <div class="vstack gap-4">
                        <div class="d-flex gap-3">
                            <input class="form-check-input flex-shrink-0 text-lg" type="radio" name="projecy-privacy" checked="checked"  data-form-type="other" v-model="saleType" :value="SaleType.DirectSale">
                            <div class="pt-1 form-checked-content">
                                <h6 class="mb-1 lh-relaxed text-dark">Buy Now</h6>
                                <span class="d-block text-muted text-sm">
                                    <i class="bi bi-cash-stack me-1"></i> Buyers can immediately purchase the NFT
                                </span>
                            </div>
                        </div>
                        <div class="d-flex gap-3">
                            <input class="form-check-input flex-shrink-0 text-lg" type="radio" name="projecy-privacy" 
                            data-form-type="other" v-model="saleType" :value="SaleType.DirectAuction">
                            <div class="pt-1 form-checked-content">
                                <h6 class="mb-1 lh-relaxed text-dark">Auction</h6>
                                <span class="d-block text-muted text-sm">
                                    <i class="bi bi-people-fill me-1"></i> 
                                    Buyers can bid on the NFT
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="my-2">
                    <label class="form-label text-dark" for="listingPrice">Price</label>

                    <div class="">
                    <div class="input-group position-relative">
                        <span class="input-group-text" id="">&dollar;</span>
                        <input v-model="listingPrice" class="form-control" placeholder="Price" aria-label="Price">
                        <span class="input-group-text" id="">USD</span>
                    </div>
                    <span class="mt-2 valid-feedback">Looks good!</span>
                    </div>
                </div>
                <div class="my-2" v-if="(saleType === SaleType.DirectAuction)">
                    <label class="form-label text-dark">Duration</label>
                    <VueMultiselect
                        v-model="selectedDuration"
                        :options="durations">
                    </VueMultiselect>
                </div>
            </div>
            <div class="modal-footer py-1">
                <button  type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal">
                    Cancel
                </button>
                <button type="button" class="btn btn-sm btn-success" @click.prevent="listForSale">
                    List for sale
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import ToastHelper from '@/helpers/ToastHelper';
import useEmitter from '@/helpers/useEmitter';
import { toggleModal } from '@/hooks/BootstrapHooks';
import NFTAsset from '@/models/NFTAsset';
import { Sale, SaleStatus, SaleType, SaleWithAssets, TransferStatus, WalletAsset } from '@/services/api/models';
import SaleService from '@/services/domain/SaleService';
import WalletAssetService from '@/services/domain/WalletAssetService';
import WalletService from '@/services/WalletService';
import { ref } from 'vue';
import NumberHelper from '@/helpers/NumberHelper';
import store from '@/store/store';
import router from '@/router';
import ErrorLogger from '@/helpers/ErrorLogger';
import VueMultiselect from 'vue-multiselect'
import { DateTime } from 'luxon';


const emitter = useEmitter();

const currentWalletAssetId = ref('');
const currentNFTAsset = ref({} as NFTAsset);
const currentWalletAsset = ref({} as WalletAsset);
const currentSale = ref({} as SaleWithAssets);
const listingPrice = ref(0);

emitter.on('OpenListForSaleModal', async (value: { asset: NFTAsset, assetId: string }) => {
    currentNFTAsset.value = value.asset;
    currentWalletAssetId.value = value.assetId;
    await setListingStatus(value.assetId);
    toggleModal('listForSaleModal', 'show');
})

async function setListingStatus(assetId: string) {
    try {
        currentWalletAsset.value = await WalletAssetService.getById(assetId);

        if (currentWalletAsset.value.saleId) {
            currentSale.value = await SaleService.getById(currentWalletAsset.value.saleId);
            listingPrice.value = currentSale.value.sale?.floorPrice ?? 0
        }
    } catch (err) {
        console.error(err)
        ToastHelper.error('There was an error retrieving your sale. Please try again later');
    }
}

const saleType = ref(SaleType.DirectSale)

const durations = [
    '12hr',
    '24hr',
    '48hr',
    '72hr'
]

const selectedDuration = ref(durations[0])

function getDuration() {
    let hoursToAdd = 12;

    if (selectedDuration.value === durations[1]) hoursToAdd = 24;
    if (selectedDuration.value === durations[2]) hoursToAdd = 48;
    if (selectedDuration.value === durations[3]) hoursToAdd = 72;

    return DateTime.now().plus({ hours: hoursToAdd }).toJSDate();
}

async function listForSale () {
    if (listingPrice.value <= 0) {
        ToastHelper.warning('Price must be greater than 0');
        return;
    }

    const assetTransferStatus = currentWalletAsset.value.transferStatus;

    if (!currentWalletAsset.value
        || assetTransferStatus === TransferStatus.Sold
        || assetTransferStatus === TransferStatus.TransferPending
        || assetTransferStatus === TransferStatus.Transferred) {

            ToastHelper.error('There was an error listing your NFT for sale');
            toggleModal('listForSaleModal', 'hide');
            return;
    }

    try {
        if (!currentWalletAsset.value.saleId) {
            const sale: Sale = {
                saleType: saleType.value,
                floorPrice: NumberHelper.normalizeCurrencyToSave(listingPrice.value),
                sellerUserId: currentUser.value.id,
                saleStatus: SaleStatus.Unsold
            }

            if (sale.saleType === SaleType.DirectAuction) {
                sale.endTime = getDuration();
            }

            const saleAsset = currentWalletAsset.value;            
            saleAsset.saleId = '00000000-0000-0000-0000-000000000000';

            currentSale.value.sale = await SaleService.listForSale(sale, [saleAsset], currentWalletAsset.value.id, currentNFTAsset.value.name + ' Mint ' + currentNFTAsset.value.mintNumber);
        } else {
            currentSale.value.sale.saleStatus = SaleStatus.Unsold;               
            currentSale.value.sale.floorPrice = NumberHelper.normalizeCurrencyToSave(listingPrice.value);
            currentSale.value.sale = await SaleService.listForSale(currentSale.value.sale, currentSale.value.saleAssets, currentWalletAsset.value.id, currentNFTAsset.value.name + ' Mint ' + currentNFTAsset.value.mintNumber);      
        }

        toggleModal('listForSaleModal', 'hide');
        ToastHelper.success('NFT successfully listed for sale.');
        router.push({ name: 'MarketplaceSale', params: { id: currentSale.value.sale.id }});
    } catch (err) {
        const error = await ErrorLogger.logApiError(err)
        ToastHelper.error(error[0]);
    }
}
</script>

<style scoped>

</style>>