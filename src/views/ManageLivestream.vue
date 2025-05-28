<template>
<div class="bg-dark">
    <div class="container py-10">
        <div class="row">
            <div class="col-lg-7 mx-auto">
                <div class="card shadow border-0 mb-10">
                    <div class="card-body">
                        <div class="mb-7">
                            <h3 class="font-semibold mb-1">Create a Live Show</h3>
                            <!-- <p class="text-sm text-muted">Create a new Live Show</p> -->
                        </div>
                        <div class="row g-5">
                            <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="title">Title</label>
                                    <input v-model="livestream.name" type="text" class="form-control" id="title">
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="description">Description</label>
                                    <!-- <textarea v-model="livestream.description" class="form-control" id="livestreamDescription" placeholder="What's your livestream about?" rows="3"></textarea> -->
                                    <vue-editor v-model="livestream.description" :editorToolbar="customToolbar"></vue-editor>
                                </div>
                            </div>

                             <div class="col-md-12">
                                <div class="">
                                     <label for="timezone" class="form-label">Timezone</label>
                                     <VueMultiselect
                                        v-model="selectedTimezone"
                                        :options="Timezone.TimezoneList"
                                        label="displayName"
                                        track-by="id"
                                        @select="(timezone: any, id: any) => { livestream.timezone = timezone.id }">
                                     </VueMultiselect>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="startTime">Date & Time</label>
                                        <v-date-picker color="pink" mode="dateTime" class="w-full"
                                                :min-date="new Date()"
                                                v-model="livestream.startTime"
                                                :popover="{ placement: 'bottom' }"
                                                :timezone="livestream.timezone">
                                                <template v-slot="{ inputValue, inputEvents }">
                                                    <div class="d-flex flex-row justify-content-between align-items-baseline">
                                                        <div class="input-group mb-2 mr-sm-2">
                                                            <input class="form-control" :value="inputValue" v-on="inputEvents"/>
                                                            <div class="input-group-prepend">
                                                            <!-- <div class="input-group-text">
                                                                <i class="fa fa-calendar"></i>
                                                            </div> -->
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                        </v-date-picker>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="vstack gap-4">
                                    <div class="d-flex gap-3">
                                        <input class="form-check-input flex-shrink-0 text-lg" type="radio" name="livestream-type" checked
                                            v-model="livestreamType"
                                            :value="LivestreamType.Physical"  
                                            :disabled="!StringHelper.isNullOrEmpty(livestream.id)"  
                                        >
                                        <div class="pt-1 form-checked-content">
                                        <h6 class="mb-1 lh-relaxed">Physical</h6>
                                        <span class="d-block text-muted text-sm">
                                            <i class="bi bi-box-fill me-1"></i>
                                            You will be able to sell physical products
                                        </span>
                                        </div>
                                    </div>
                                    <div class="d-flex gap-3">
                                        <input class="form-check-input flex-shrink-0 text-lg" type="radio" name="livestream-type"
                                            v-model="livestreamType"
                                            :value="LivestreamType.Digital"  
                                            :disabled="!StringHelper.isNullOrEmpty(livestream.id)"  
                                        >
                                        <div class="pt-1 form-checked-content">
                                        <h6 class="mb-1 lh-relaxed">Digital</h6>
                                        <span class="d-block text-muted text-sm">
                                            <i class="bi bi-box-arrow-in-up me-1"></i>
                                            You will be able to sell digital products
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="formInputExample">Cover Image or Video</label>
                                    <div class="card border-2 border-dashed border-primary-hover position-relative">
                                        <div class="d-flex justify-content-center px-5 py-5">
                                            <label for="cover_file_upload" class="position-absolute w-full h-full top-0 start-0 cursor-pointer">
                                                <input id="cover_file_upload" name="cover_file_upload" type="file" class="visually-hidden" @change="onImageUpload($event, ImageType.cover)">
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
                            </div>

                            <!-- <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="formInputExample">Promo Image or Video (optional)</label>
                                    <div class="card border-2 border-dashed border-primary-hover position-relative">
                                        <div class="d-flex justify-content-center px-5 py-5">
                                            <label for="promo_file_upload" class="position-absolute w-full h-full top-0 start-0 cursor-pointer">
                                                <input id="promo_file_upload" name="promo_file_upload" type="file" class="visually-hidden" @change="onImageUpload($event, ImageType.promo)">
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
                            </div>

                            <div class="col-md-12">
                                <div class="">
                                    <label class="form-label" for="promoDescription">Promo Sign Up Message (optional)</label>
                                    <input v-model="livestream.promoDescription" type="text" class="form-control" id="promoDescription"
                                    placeholder="Enter a promo message to encourage attendees to sign up">
                                </div>
                            </div> -->

                        </div>
                        <div class="alert alert-danger mt-5" role="alert" v-for="err in livestreamErrors" :key="err">
                            {{ err }}
                        </div>
                    </div>
                    <div class="card-footer text-end py-4">
                        <button type="button" class="btn btn-sm btn-neutral me-2">Cancel</button>
                        <button id="saveAsDraftBtn" type="submit" class="btn btn-sm btn-primary me-2" @click.prevent="saveLivestream(LivestreamStatus.Draft)">Save as draft</button>
                        <button v-if="currentUser.role === UserRole.Seller || currentUser.role === UserRole.Admin" id="saveAsPrivateBtn" type="submit" class="btn btn-sm btn-primary me-2" @click.prevent="saveLivestream(LivestreamStatus.Private)">Save as private</button>
                        <button id="publishBtn" type="submit" class="btn btn-sm btn-primary" @click.prevent="saveLivestream(LivestreamStatus.Published)">Publish</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { initializePopover } from '@/hooks/BootstrapHooks'
import { computed, onMounted } from '@vue/runtime-core'
import { ref, watch } from 'vue'
import LivestreamService from '@/services/domain/LivestreamService'
import { useRoute } from 'vue-router'
import { AssetPack, Blockchain, FileRequestType, Livestream, LivestreamStatus, LivestreamType, Sale, SaleAsset, SaleAssetType, SaleStatus, SaleType, TransferStatus, UserRole, WalletAsset } from '@/services/api/models'
import Timezone from '@/enums/Timezones'
import IWalletProvider from '@/interfaces/IWalletProvider'
import WalletService from '@/services/WalletService'
import Wallet from '@/enums/Wallet'
import BlockchainService from '@/services/BlockchainService'
import NFTAsset from '@/models/NFTAsset'
import VueMultiselect from 'vue-multiselect'
import router from '@/router'
import ToastHelper from '@/helpers/ToastHelper'
import ErrorLogger from '@/helpers/ErrorLogger'
import { v4 as uuidv4 } from 'uuid';
import { RestApi } from '@/services/RestApi'
import LoadingHelper from '@/helpers/LoadingHelper'
import { VueEditor } from "vue3-editor";
import StringHelper from '@/helpers/StringHelper'
import { useStore } from '@/store/main.store'
import { storeToRefs } from 'pinia'
import { useBlockchainStore } from '@/store/blockchain.store'

const customToolbar = [
        [{ size: [ 'small', false, 'large', 'huge' ]}],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
      ]

interface SaleWithNFTAsset {
    sale: Sale,
    asset: NFTAsset
}

enum ImageType {
    cover = 'cover',
    promo = 'promo'
}

const blockchainStore = useBlockchainStore();

const connectedWaxWallet = computed(() => blockchainStore.currentWaxUser)
const connectedBloctoWallet = computed(() => blockchainStore.currentBloctoUser)
const connectedDapperWallet = computed(() => blockchainStore.currentDapperUser)
const connectedPhantomWallet = computed(() => blockchainStore.currentPhantomUser)
const connectedMetamaskWallet = computed(() => blockchainStore.currentMetamaskUser);

const store = useStore()
const { currentUser } = storeToRefs(store);

const metaMaskBlockchain = ref(Blockchain.Ethereum);

let nftAssets = ref([] as NFTAsset[]);
let selectedSales = ref([] as SaleWithNFTAsset[]);
const allPacks = ref([] as AssetPack[])
const userPacks = ref([] as AssetPack[])
const selectedPacks = ref([] as SaleWithNFTAsset[])

let livestream = ref({} as Livestream);
const livestreamType = ref(LivestreamType.Physical)
let selectedTimezone = ref();
const livestreamErrors = ref([])
const assetCountPage = ref(1);
const assetSearchValue = ref('');
const currentWalletAssets = ref([] as WalletAsset[])

const route = useRoute();

async function onImageUpload(event: any, imageType: ImageType) {
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
        await RestApi.Upload.uploadImage(imageName, file, FileRequestType.Livestream)

        if (imageType === ImageType.cover) livestream.value.imageUrl = imageName;
        else livestream.value.promoImageUrl = imageName;

        ToastHelper.success('Image successfully uploaded')
    } catch (err) {
        ToastHelper.error('There was an error uploading the image. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}

async function getLivestream(livestreamId: string) {
    try {
        livestream.value = await LivestreamService.getLivestream(livestreamId)
        selectedTimezone.value = Timezone.findTimezone(livestream.value.timezone);
        livestreamType.value = livestream.value.livestreamType;        
    } catch (err) {
        ToastHelper.error('The Livestream does not exist');
        router.push({ name: 'Home' })
    }
}

async function saveLivestream (status: LivestreamStatus) {
    livestream.value.status = status
    livestream.value.hostUserId = currentUser.value.id
    livestream.value.livestreamType = livestreamType.value;

    try {    

        livestream.value = (await RestApi.Livestream.saveLivestream(livestream.value, [])).data;
        
        router.push({ name: 'SellerLivestreams' })

        ToastHelper.success('Livestream has been successfully saved');
    } catch (err) {
        livestreamErrors.value = await ErrorLogger.logApiError(err);
        ToastHelper.error('There was an error saving the livestream');
    }
}

async function connectWaxWallet() {
    const waxCloudWallet: IWalletProvider = WalletService.getInstance(Wallet.WaxCloudWallet);
    await waxCloudWallet.connect();
}

async function connectDapperWallet() {
    const dapperWallet: IWalletProvider = WalletService.getInstance(Wallet.Dapper);
    await dapperWallet.connect();
}

async function connectBloctoWallet() {
    const flowWallet: IWalletProvider = WalletService.getInstance(Wallet.Blocto);
    await flowWallet.connect();
}

async function connectPhantomWallet() {
    const phantomWallet: IWalletProvider = WalletService.getInstance(Wallet.Phantom);
    await phantomWallet.connect();
}

async function connectMetamaskWallet() {
    const metamaskWallet: IWalletProvider = WalletService.getInstance(Wallet.MetaMask);
    await metamaskWallet.connect();
}

onMounted(async () => {
    initializePopover()

    // if (currentUser.value.role !== UserRole.Admin && currentUser.value.role !== UserRole.Seller) {
    //     router.push({ name: 'Home' })
    // }

    if (route.params.livestreamId) {
        await getLivestream(route?.params?.livestreamId as string ?? '')
    }

    await getUserAssets()

})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
h1, h2, h3, h4, h5, h6, label {
    color: black !important;
}
</style>
