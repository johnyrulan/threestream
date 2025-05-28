<template>
<main class="main-content mt-0">
<section>
    <div class="flex-lg-1 h-screen overflow-y-lg-auto">
    <main class="py-6 bg-dark">
        <div class="container-fluid max-w-screen-md vstack gap-6">
            <div>
                <div class="mb-5">
                    <h4>Cover Image</h4>
                </div>

                <div class="row g-5">
                    <div class="col-md-12">
                        <div class="">
                            <!-- <label class="form-label" for="formInputExample">Cover Image</label> -->
                            <div class="card border-2 border-dashed border-primary-hover position-relative">
                                <div class="d-flex justify-content-center px-5 py-5">
                                    <label for="cover_file_upload" class="position-absolute w-full h-full top-0 start-0 cursor-pointer">
                                        <input id="cover_file_upload" name="cover_file_upload" type="file" class="visually-hidden" @change="onImageUpload($event)">
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

                </div>

            </div>
            <hr>
            <div>
                <div class="mb-5">
                    <h4>Account Information</h4>
                </div>

                <div class="row g-5">
                    <div class="col-md-12">
                        <div><label class="form-label">Email</label> <input type="text"
                                :value="user.email" class="form-control" id="email" disabled></div>
                    </div>
                    <div class="col-md-12">
                        <div><label class="form-label">Name</label> <input type="text"
                                v-model="user.name" class="form-control" id="name"></div>
                    </div>
                    <div class="col-md-12">
                        <div><label class="form-label">Bio</label> 
                        <div class="textarea-autosize">
                            <textarea v-model="userBio" class="form-control border-0 shadow-none p-4" rows="4" resize="none" placeholder="What's on your mind?" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
                        </div>
                        </div>
                    </div>
                    <!-- <div class="col-12">
                        <div><label class="form-label">Bio</label> <textarea type="text"
                                v-model="user.bio" class="form-control" /></div>
                    </div> -->

                    <div class="col-12 text-end"><button
                            class="btn btn-sm btn-primary" @click.prevent="saveUser()">Save</button></div>
                </div>

            </div>
            <hr>
            <div>
                <div class="mb-5">
                    <h4>Change Password</h4>
                </div>

                <div class="row g-5">
                    <div class="col-md-12">
                        <div>
                            <label class="form-label">Current Password</label>
                            <input type="password" v-model="changePasswordModel.currentPassword" class="form-control" id="current-password">
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div>
                            <label class="form-label">New Password</label>
                            <input type="password" v-model="changePasswordModel.newPassword" class="form-control" id="new-password">
                        </div>
                    </div>
                    <!-- <div class="col-12">
                        <div><label class="form-label">Bio</label> <textarea type="text"
                                v-model="user.bio" class="form-control" /></div>
                    </div> -->

                    <div class="col-12 text-end">
                        <button class="btn btn-sm btn-primary" @click.prevent="changePassword">Update Password</button>
                    </div>
                </div>

            </div>
            <hr/>
            <div>
                <div class="mb-5 text-center">
                    <button class="btn btn-sm btn-danger" @click.prevent="deleteAccount">Delete Account</button>
                </div>
            </div>            
        </div>
    </main>
</div>
</section>
</main>
</template>

<script setup lang="ts">
import User from '@/models/User';
import ImageUpload from '../../components/ImageUpload.vue';
import { UploadType } from '@/enums/CommonEnums';
import { RestApi } from '@/services/RestApi';
import { onMounted, reactive, ref } from 'vue';
import router from "@/router";
import ImageHelper from '../../helpers/ImageHelper';
import StoreMutations from '@/store/store.constants';
import ToastHelper from '@/helpers/ToastHelper';
import ErrorLogger from '@/helpers/ErrorLogger';
import LoadingHelper from '@/helpers/LoadingHelper';
import { v4 as uuidv4 } from 'uuid';
import { FileRequestType } from '@/services/api/models';
import { useStore } from '@/store/main.store';
import { currentUser } from '@onflow/fcl';

const store = useStore()

interface ChangePasswordModel {
    currentPassword: string,
    newPassword: string
}

let user = reactive(new User());
let getUser : User;

const changePasswordModel = reactive({} as ChangePasswordModel)

async function saveUser() {
    try
    {
        getUser.name = user.name;
        getUser.bio = user?.bio;
        getUser.profilePicUrl = user?.profilePicUrl;
        getUser.userAttributes.bio = userBio.value;
        const savedUser = await RestApi.User.saveUser(getUser);

        store.setCurrentUser(savedUser.data);
        router.push({ name: 'UserProfile', params: { id: savedUser.data.id } });

        ToastHelper.success('Account information successfully saved')
    } catch(err) {
        ToastHelper.error('There was an error saving your account information')
    }
}

async function onUserPicUpload(fileName: string) {
    if (user) {
        await ImageHelper.deleteImage(user.profilePicUrl, UploadType.User);

        user.profilePicUrl = fileName;
        getUser.profilePicUrl = user?.profilePicUrl;

        const savedUser = await RestApi.User.saveUser(getUser);
        store.setCurrentUser(savedUser.data);
    }
}

const userBio = ref('');

async function fetchData() {
    const loader = LoadingHelper.showLoader();

    try {
        let _user = await RestApi.User.getCurrentUser();
        getUser = _user.data;
        user.name = getUser.name;
        user.bio = getUser.bio;
        user.profilePicUrl = getUser.profilePicUrl;
        user.email = getUser.email;
        userBio.value = getUser.userAttributes?.bio ?? '';

    } catch (err) {
        ToastHelper.error('There was an error fetching your profile data. Please try again later.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}

async function changePassword() {
    const loader = LoadingHelper.showLoader();

    try {
        await RestApi.User.changePassword(changePasswordModel.currentPassword, changePasswordModel.newPassword);

        ToastHelper.success('Password changed successfully. Please re-login with your new password.');

        await RestApi.User.signOut();
        router.push({ name: 'Home' });

        store.setCurrentUser(undefined);

    } catch (err) {
        ToastHelper.error("The existing password doesn't match the password provided.")
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}

async function onImageUpload(event: any) {
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
        await RestApi.Upload.uploadImage(imageName, file, UploadType.UserCover)

        getUser.userAttributes.coverImageUrl = imageName;

        await saveUser()

        ToastHelper.success('Image successfully uploaded')
    } catch (err) {
        ToastHelper.error('There was an error uploading the image. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader)
}

async function deleteAccount() {
    if (confirm("Are you sure you want to delete your account?")) {
        try {
            let _user = (await RestApi.User.getCurrentUser()).data;
            await RestApi.User.deleteUser(_user.id)
            await RestApi.User.signOut();

            store.setCurrentUser(undefined);            

            window.location.href = '/';
        } catch (err) {
            ToastHelper.error('There was an error deleting the account. Please contact support at info@junkieapp.xyz')
            await ErrorLogger.logApiError(err)            
        }
    }
}

onMounted(async () => {
    await fetchData();
});

</script>

<style scoped>

</style>