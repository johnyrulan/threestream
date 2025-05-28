<template>
<main class="main-content mt-0">
    <div class="container mb-7">
    <div class="row">
        <div class="col-md-12 my-6">
            <h3>Users</h3>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table table-hover table-nowrap table-bordered">
            <thead class="thead-light">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Sign Up Date</th>
                    <th scope="col">Referral Id</th>
                    <th scope="col">Role</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user) in users" :key="user.id">
                    <td>
                        <span class="font-semibold">{{ user.name }}</span>
                    </td>
                    <td>
                        <span class="font-semibold">{{ user.email }}</span>
                    </td>
                    <td>
                        <span class="font-semibold">{{ (new Date(user.created)).toLocaleDateString() }}</span>
                    </td>
                    <td>
                        <span class="font-semibold">{{ user.userAttributes?.referralId ?? '-' }}</span>
                    </td>
                    <td>
                        <span class="font-semibold">{{ user.role }}</span>
                    </td>                    
                    <td>
                        <button class="btn d-inline-flex btn-sm btn-primary rounded-pill" @click="openAssetsModal(user.id)">
                            <span class=" pe-2">
                                <i class="bi bi-receipt"></i>
                            </span>
                            <span>View NFTs</span>
                        </button>
                        <button class="btn d-inline-flex btn-sm btn-primary rounded-pill ms-3" @click="openAddAssetModal(user.id, undefined)">
                            <span class=" pe-2">
                                <i class="bi bi-plus-lg"></i>
                            </span>
                            <span>Add NFT</span>
                        </button>
                        <button 
                            class="btn d-inline-flex btn-sm btn-primary rounded-pill" 
                            @click="upgradeToSeller(user)"
                        >
                            <span>Upgrade To Seller</span>
                        </button>                        
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>

    <div class="modal fade" id="walletAssetModal" tabindex="-1" aria-labelledby="walletAssetModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content shadow-3">

                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Wallet Assets</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="toggleModal('walletAssetModal', 'hide')">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Owner Address</th>
                                <th scope="col">Contract Address</th>
                                <th scope="col">NFT Name</th>
                                <th scope="col">Token Id</th>
                                <th scope="col">Blockchain</th>
                                <th scope="col">Transfer Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(asset, index) in walletAssets" :key="index">
                                <td>{{ asset.ownerAddress }}</td>
                                <td>{{ asset.contractAddress }}</td>
                                <td>{{ getNFTAsset(asset.contractAddress)?.name ?? '' }}</td>
                                <td>{{ asset.tokenId }}</td>
                                <td>{{ asset.blockchain }}</td>
                                <td>{{ asset.transferStatus }}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary me-2" @click="markAsTransferred(asset)">Mark as Transferred</button>
                                    <button class="btn btn-sm btn-primary" @click="openAddAssetModal(asset.userId, asset)">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click.prevent="toggleModal('walletAssetModal', 'hide')">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="addWalletAssetModal" tabindex="-1" aria-labelledby="addWalletAssetModal" aria-hidden="true" @keyup.enter="saveWalletAsset">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content shadow-3">

                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">{{addAssetModalTitle}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click.prevent="toggleModal('addWalletAssetModal', 'hide')">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div>
                        <div class="mb-5">
                            <label class="form-label" for="email">Blockchain</label>
                            <select v-model="walletAssetModel.blockchain" type="text" class="form-control form-control-muted">
                                <option v-for="blockchain in Blockchain" :key="blockchain">{{ blockchain }}</option>
                            </select>
                        </div>
                        <div class="mb-5">
                            <label class="form-label" for="password">Contract Address/Asset Id</label>
                            <input v-model="walletAssetModel.contractAddress" type="text" class="form-control form-control-muted" />
                        </div>
                        <div class="mb-5">
                            <label class="form-label" for="password">Owner Address</label>
                            <input v-model="walletAssetModel.ownerAddress" type="text" class="form-control form-control-muted" />
                        </div>
                        <div class="mb-5">
                            <label class="form-label" for="password">Token Id (only use for ERC-1155; Otherwise leave blank)</label>
                            <input v-model="walletAssetModel.tokenId" type="text" class="form-control form-control-muted" />
                        </div>
                    </div>
                    <div class="alert alert-danger mb-5" role="alert" v-for="err in saveWalletAssetErrors" :key="err">
                        {{ err }}
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click.prevent="toggleModal('addWalletAssetModal', 'hide')">Close</button>
                    <button type="button" class="btn btn-primary" @click.prevent="saveWalletAsset">Save</button>
                </div>
            </div>
        </div>
    </div>
</main>
</template>

<script setup lang="ts">
import ErrorLogger from "@/helpers/ErrorLogger";
import LoadingHelper from "@/helpers/LoadingHelper";
import ToastHelper from "@/helpers/ToastHelper";
import { toggleModal } from "@/hooks/BootstrapHooks";
import NFTAsset from "@/models/NFTAsset";
import { Blockchain, User, WalletAsset } from "@/services/api/models";
import BlockchainService from "@/services/BlockchainService";
import UserService from "@/services/domain/UserService";
import { RestApi } from "@/services/RestApi";
import { onMounted, reactive, ref } from "@vue/runtime-core";
import WalletAssetService from "../../services/domain/WalletAssetService";

const users = ref([] as User[]);
const walletAssets = ref([] as WalletAsset[]);
const nftAssets = ref([] as NFTAsset[]);
const walletAssetModel = ref({} as WalletAsset);
const saveWalletAssetErrors = ref([]);
const waxProvider = BlockchainService.getInstance(Blockchain.Wax);
const addAssetModalTitle = ref('');

function getNFTAsset(assetId: string): NFTAsset | null {
    const asset = nftAssets.value.filter(a => a.contractAddress === assetId);
    return asset[0];
}

async function openAssetsModal(userId: string) {
    const loader = LoadingHelper.showLoader();

    walletAssets.value = await WalletAssetService.getByUserId(userId);

    walletAssets.value.forEach(async w => {
        nftAssets.value.push(await waxProvider.getAssetById(w.contractAddress))
    });

    LoadingHelper.hideLoader(loader);

    toggleModal('walletAssetModal', 'show');
}

async function saveWalletAsset() {

    if (!walletAssetModel.value.contractAddress) {
        ToastHelper.error('NFTs must have a Contract Address/Asset Id');
        return;
    }

    const loader = LoadingHelper.showLoader();

    try {
        await WalletAssetService.saveWalletAsset(walletAssetModel.value);

        ToastHelper.success('NFT successfully added');
        toggleModal('addWalletAssetModal', 'hide');
    } catch(err) {
        saveWalletAssetErrors.value = await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}

function openAddAssetModal(userId: string, asset: WalletAsset | undefined) {
    if (asset === undefined) {
        const newWalletAssetModel = {
            userId,
            blockchain: Blockchain.Wax,
            ownerAddress: '44jmm.c.wam',
            contractAddress: '',
            tokenId: ''
        } as WalletAsset;

        walletAssetModel.value = newWalletAssetModel;
        addAssetModalTitle.value = 'Add New Wallet Asset';
    } else {
        walletAssetModel.value = asset;
        addAssetModalTitle.value = 'Edit Wallet Asset';
    }

    toggleModal('addWalletAssetModal', 'show');
}

async function markAsTransferred(asset: WalletAsset) {
    const loader = LoadingHelper.showLoader();

    try {
        await WalletAssetService.completeTransfer(asset.id);
        ToastHelper.success('Successfully marked as transferred')
    } catch (err) {
        ToastHelper.error('There was an error completing the transfer')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}

async function upgradeToSeller(user: User) {
    const loader = LoadingHelper.showLoader();

    try {
        await RestApi.User.upgradeToSeller(user.id);
        ToastHelper.success('Successfully upgraded ' + user.name + ' to Seller')
    } catch (err) {
        ToastHelper.error('There was an error upgrading to seller')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);    
}

onMounted(async () => {
    const loader = LoadingHelper.showLoader();

    users.value = await UserService.getAllUsers() ?? [];

    LoadingHelper.hideLoader(loader);
});

</script>

<style scoped>
table td {
    white-space: normal;
    word-break: break-word;
}
</style>