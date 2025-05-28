<template>
<div class="modal fade" id="redeemNFTModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="redeemNFTModal" style="display: none" aria-hidden="true">
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
                    <h3>Shipping Information</h3>

                    <div class="mt-3">
                        <label for="firstName" class="form-label">First Name</label>
                        <input type="text" class="form-control" id="firstName" placeholder="Funko" v-model="firstName">
                    </div>

                    <div class="mt-3">
                        <label for="lastName" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="lastName" placeholder="Master" v-model="lastName">
                    </div>

                    <div class="mt-3">
                        <label for="phone" class="form-label">Phone</label>
                        <input type="text" class="form-control" id="phone" placeholder="999-999-9999" v-model="phone">
                    </div>
                    
                    <div class="mt-3">
                        <label for="address" class="form-label">Address</label>
                        <input type="text" class="form-control" id="address" placeholder="111 King Street" v-model="address">
                    </div>
                    
                    <div class="mt-3">
                        <label for="city" class="form-label">City</label>
                        <input type="text" class="form-control" id="city" placeholder="Pallet Town" v-model="city">
                    </div>
                    
                    <div class="mt-3">
                        <label for="state" class="form-label">State</label>
                        <input type="text" class="form-control" id="state" placeholder="Kanto" v-model="state">
                    </div>
                    
                    <div class="mt-3">
                        <label for="zip" class="form-label">Zip</label>
                        <input type="text" class="form-control" id="zip" placeholder="33333" v-model="zip">
                    </div>         
                    
                    <div class="mt-3 font-bold text-danger">
                        Once redeemed, this NFT can no longer be accessed!
                    </div>

                    <div class="mt-1 text-muted">
                        The item usually ships within 24-48 hours. 
                        Shippping is free
                    </div>
                </div>
            </div>
            <div class="modal-footer py-1">
                <button  type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal">
                    Cancel
                </button>
                <button type="button" class="btn btn-sm btn-success" @click.prevent="redeemNFT">
                    Redeem
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
import { WalletAsset, SaleWithAssets, RedemptionStatus, RedeemNFTRequest } from '@/services/api/models';
import { RestApi } from '@/services/RestApi';
import { Toast } from 'bootstrap';
import { ref } from 'vue';

const emitter = useEmitter();

const currentWalletAssetId = ref('');
const currentNFTAsset = ref({} as NFTAsset);
const currentWalletAsset = ref({} as WalletAsset);

const firstName = ref('');
const lastName = ref('');
const address = ref('');
const city = ref('');
const state = ref('');
const zip = ref('');
const phone = ref('');

emitter.on('OpenRedeemNFTModal', async (value: { asset: NFTAsset, assetId: string }) => {
    currentNFTAsset.value = value.asset;
    currentWalletAssetId.value = value.assetId;    
    toggleModal('redeemNFTModal', 'show');
})

async function redeemNFT() {
    try {
        const redeemNFTRequest: RedeemNFTRequest = {
            walletAssetId: currentWalletAssetId.value,
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
            phone: phone.value
        }

        await RestApi.Wallet.redeemNFT(redeemNFTRequest);
        ToastHelper.success("Congratualtions! Your physical redeemable will be shipped to you from JUNKIE HQ. Look out for emails/texts for updates on your redeemable!")
        toggleModal('redeemNFTModal', 'hide');
    } catch (err) {
        ToastHelper.error('There is an error redeeming this NFT. Please email info@junkieapp.xyz for support');
    }
}

</script>

<style scoped>

</style>