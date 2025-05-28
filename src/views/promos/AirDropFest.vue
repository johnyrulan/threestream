<template>
<div class="bg-home h-full w-full">
<div class="container py-12">
    <div class="row">
        <div class="col-lg-6 col-md-12">        
            <h1>Sign up on JUNKIE to join Airdrop Fest & claim your free NFT! <span class="d-none d-lg-inline">👉</span> <span class="d-inline d-lg-none">👇</span></h1>
            <div class="container-fluid mt-7">
                <div class="row">
                    <div class="col-xl-6 col-lg-12 text-center">
                        <img src="https://global-uploads.webflow.com/61ba399fca605b9eb8bd60eb/62fe9824c2ea44c3ca7ca423_airdrop-nfts.gif" style="width: 150px;"/>
                    </div>
                    <h4 class="col-xl-6 col-lg-12 mt-sm-3 mt-xl-0 font-semibold lh-relaxed">
                        To celebrate our marketplace launch, for the rest of the month we're airdropping NFTs into every new JUNKIE account, including NFTs from DC Comics, Transformers, deadmau5, and more!
                    </h4>
                </div>
            </div>
            <div class="card shadow-3 rounded-0 border-left-red mt-7">
                <div class="card-body pb-5">
                    <div>
                        <p class="font-bold">
                            <span class="background-green">To be included, just create a free account using the signup window in our web app directly the right <span class="d-none d-lg-inline">👉</span> <span class="d-inline d-lg-none">👇</span> (1 account per person - Creating more than 1 account will cancel your eligibility!)</span>
                        </p>
                        <div class="d-flex justify-content-center mt-3">

                            <img alt="..." src="https://global-uploads.webflow.com/61ba399fca605b9eb8bd60eb/62335b78dca33e06b412ba39_Parker.png" class="avatar avatar-lg border-4 bg-warning rounded-circle text-white border-red">
           
                            <div class="ms-4 mt-2">
                                    <span class="h4 d-block mb-0">Parker Miller</span> 
                                    <div class="text-sm font-semibold text-muted">Co-Founder</div>
                            </div>
                        </div>                                    
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-6 col-md-12 d-flex justify-content-center mt-md-5 mt-lg-0">
            <div v-if="currentUser">
                <h2 class="text-primary mt-3 mt-lg-0">Congratulations {{ currentUser.name }}! We will send your AirDrop within 1-2 days. You can check them under "My NFTs" on the navbar!</h2> 
                <h5 class="my-3">
                    In the meantime you can:
                </h5>     
                <div class="d-flex gap-3">
                    <router-link class="btn btn-primary" :to="{ name: 'Home' }"><i class="bi bi-lightning"></i> Check out Live NFT Shows</router-link>
                    <router-link class="btn btn-primary" :to="{ name: 'Marketplace' }"><i class="bi bi-shop"></i> Check out the Marketplace</router-link>
                </div>
            </div>
            <div v-else @keyup.enter="register" class="bg-white px-5 py-6 rounded shadow-3 w-xl-3/4 w-full mt-3 mt-lg-0">
                <div class="text-center mb-5">
                    <span class="d-inline-block d-lg-block h1 mb-lg-6 me-3">
                        <img src="@/assets/junkie-icon-100x100.svg" class="rounded-3 shadow-outset"/>
                    </span>                       
                    <h1 class="ls-tight font-bolder h2">Sign Up for JUNKIE</h1>
                    <p class="mt-2">Buy, Sell, & Trade Popular NFTs on JUNKIE</p>
                </div>
                <div class="mb-5">
                    <label class="form-label" for="name">Name</label>
                    <input v-model="registrationDetails.name" type="text" class="form-control form-control-muted" id="name" placeholder="Your name">
                </div>
                <div class="mb-5">
                    <label class="form-label" for="email">Email address</label>
                    <input v-model="registrationDetails.email" type="email" class="form-control form-control-muted" id="email" placeholder="Your email address">
                </div>
                <div class="mb-5">
                    <label class="form-label" for="password">Password</label>
                    <input v-model="registrationDetails.password" type="password" class="form-control form-control-muted" id="password" placeholder="Password" autocomplete="current-password">
                </div>
                <div class="mb-5 d-flex justify-content-center">
                    <vue-hcaptcha ref="captcha" :sitekey="hcaptchakey" @verify="verifyCaptcha"></vue-hcaptcha>
                </div>
                <div class="mb-5">
                    <div class="form-check">
                        <input v-model="registrationDetails.isTermsChecked" class="form-check-input" type="checkbox" name="termsAndConditions" id="checkbox-termsAndConditions">
                        <label class="form-check-label" for="termsAndConditions">
                            I agree to the
                            <a target="_blank" href="https://www.junkieapp.xyz/terms-of-service">Terms of Service</a>
                            and
                            <a target="_blank" href="https://www.junkieapp.xyz/privacy-policy">Privacy Policy</a>
                        </label>
                    </div>
                </div>
                <div class="alert alert-danger mb-5" role="alert" v-for="err in registrationErrors" :key="err">
                    {{ err }}
                </div>
                <div>
                    <button @click="register" :disabled="!registrationDetails.isTermsChecked || !isCaptchaVerified" class="btn btn-primary w-full">
                        Register
                    </button>
                </div>
            </div>     
        </div>
    </div>
</div>    
</div>
</template>

<script lang="ts" setup>
import LoadingHelper from '@/helpers/LoadingHelper';
import AnalyticsService from '@/services/AnalyticsService';
import { User } from '@/services/api/models';
import UserService from '@/services/domain/UserService';
import { computed, ref } from 'vue';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import ErrorLogger from '@/helpers/ErrorLogger';
import { useRoute } from 'vue-router';
import StoreMutations from '@/store/store.constants';
import ToastHelper from '@/helpers/ToastHelper';
import { toggleModal } from '@/hooks/BootstrapHooks';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';

interface RegistrationDetails {
    name: string,
    email: string,
    password: string,
    isTermsChecked: boolean
}

interface LoginCredentials {
    email: string,
    password: string
}

const route = useRoute()
const store = useStore()

const registrationDetails = ref({} as RegistrationDetails)
const loginCredentials = ref({} as LoginCredentials)
const isCaptchaVerified = ref(false);
const hcaptchakey = import.meta.env.VITE_HCAPTCHA_SITE_KEY as string;
const captcha = ref(null as any);

const registrationErrors = ref([])

const { currentUser } = storeToRefs(store);

async function login() {
    const loader = LoadingHelper.showLoader();

    try {
        const user = await UserService.login(loginCredentials.value.email, loginCredentials.value.password);

        if (user.isForgotPasswordRequested) {
            ToastHelper.warning("You're using a generated password. Please change your password under Account Settings.");
        }

        store.setCurrentUser(user);

        toggleModal('authModal', 'hide');

    } catch (err) {
        const loginErrors = await ErrorLogger.logApiError(err, false);
        ToastHelper.error(loginErrors[0]);
    }

    LoadingHelper.hideLoader(loader);
}

async function register() {

    if (!registrationDetails.value.isTermsChecked || !isCaptchaVerified.value) return;

    const loader = LoadingHelper.showLoader();

    try {
        const user: User = {
            name: registrationDetails.value.name,
            email: registrationDetails.value.email,
            password: registrationDetails.value.password
        }

        const referralId = route.query.ref?.toString() ?? '';

        if (referralId) {
            user.userAttributes = {
                referralId
            }
        }

        const savedUser = await UserService.register(user);

        AnalyticsService.logLivestreamRegistrationInGoogleTagManager(
            savedUser.id, savedUser.name, savedUser.email,
            '', '', 'airdrop-fest-promo', '', referralId)

        loginCredentials.value.email = savedUser.email;
        loginCredentials.value.password = user.password;

        await login();
    } catch (err) {
        registrationErrors.value = await ErrorLogger.logApiError(err, false);
    }

    LoadingHelper.hideLoader(loader);
}

function verifyCaptcha () {
    isCaptchaVerified.value = true;
}
</script>

<style scoped>

.border-left-red {
    border-left: 5px solid #e64415
}

.border-red {
    border-color: #e64415
}

.background-green {
    background-color: #c8e515;
}

.bg-home {
    background-color: #FEF8F6 !important;
}
</style>