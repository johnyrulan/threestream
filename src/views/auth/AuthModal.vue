<template>
<div class="modal fade" id="authModal" tabindex="-1" aria-labelledby="authModal" aria-hidden="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body">
                <div v-show="currentAuthFlow === AuthFlow.SignIn" @keyup.enter="login">
                    <div class="text-center mb-5">
                        <span class="d-inline-block d-lg-block h1 mb-lg-6 me-3">
                            <img :src="promoImageUrl" class="rounded-3" @error="$event.target.src = defaultPromoImage"/>
                        </span>
                        <h1 class="ls-tight font-bolder h2">
                            Sign In
                        </h1>
                        <p class="mt-2">Buy, Sell, & Trade Popular Collectibles on ThreeStream</p>
                    </div>
                    <div class="mt-4">
                        <span class="text-md font-bold">Don't have an account? </span>
                        <a @click.prevent="currentAuthFlow = AuthFlow.Register" class="text-warning text-md font-semibold">Sign up</a>
                    </div>
                    <div class="mb-4">
                        <span class="text-md font-bold">Forgot your Password? </span>
                        <a @click.prevent="currentAuthFlow = AuthFlow.ResetPassword" class="text-warning text-md font-semibold">Reset</a>
                    </div>
                    <div class="mb-5">
                        <label class="form-label" for="email">Email address</label>
                        <input v-model="loginCredentials.email" type="email" class="form-control form-control-muted" id="email" placeholder="Your email address">
                    </div>
                    <div class="mb-5">
                        <label class="form-label" for="password">Password</label>
                        <input v-model="loginCredentials.password" type="password" class="form-control form-control-muted" id="password" placeholder="Password" autocomplete="current-password">
                    </div>
                    <!-- <div class="mb-5">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="check_example" id="check_example">
                            <label class="form-check-label" for="check_example">
                                Keep me logged in
                            </label>
                        </div>
                    </div> -->
                    <div class="alert alert-danger mb-5" role="alert" v-for="err in loginErrors" :key="err">
                        {{ err }}
                    </div>
                    <div>
                        <button @click="login" class="btn btn-primary w-full">
                            Sign in
                        </button>
                    </div>
                </div>
                <div v-show="currentAuthFlow === AuthFlow.Register" @keyup.enter="register">
                    <div class="text-center mb-5">
                        <span class="d-inline-block d-lg-block h1 mb-lg-6 me-3">
                            <img :src="promoImageUrl" class="rounded-3" @error="$event.target.src = defaultPromoImage"/>
                        </span>
                        <h1 class="ls-tight font-bolder h2" v-if="promoDescriptionText">{{ promoDescriptionText }}</h1>
                        <h1 class="ls-tight font-bolder h2" v-else>Sign Up</h1>
                        <p class="mt-2">Buy, Sell, & Trade Popular Collectibles on ThreeStream</p>
                    </div>
                    <div class="mt-4">
                        <span class="font-bold text-md">Already have an account? </span>
                        <a @click.prevent="currentAuthFlow = AuthFlow.SignIn" class="text-warning text-md font-semibold">Sign In</a>
                    </div>
                    <div class="mb-4">
                        <span class="text-md font-bold">Forgot your Password? </span>
                        <a @click.prevent="currentAuthFlow = AuthFlow.ResetPassword" class="text-warning text-md font-semibold">Reset</a>
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
                    <div class="mb-5">
                        <label class="form-label" for="referralCode">Referral Code (optional)</label>
                        <input v-model="registrationDetails.referralCode" type="text" class="form-control form-control-muted" id="referral" placeholder="Referral Code">
                    </div>                    
                    <!-- <div class="mb-5">
                        <vue-hcaptcha ref="captcha" :sitekey="hcaptchakey" @verify="verifyCaptcha"></vue-hcaptcha>
                    </div> -->
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
                        <button @click="register" :disabled="!registrationDetails.isTermsChecked" class="btn btn-primary w-full">
                            Register
                        </button>
                    </div>
                </div>
                <div v-show="currentAuthFlow === AuthFlow.ResetPassword" @keyup.enter="resetPassword">
                    <div class="text-center mb-5">
                        <span class="d-inline-block d-lg-block h1 mb-lg-6 me-3">
                            <img :src="promoImageUrl" class="rounded-3" @error="$event.target.src = defaultPromoImage"/>
                        </span>
                        <h1 class="ls-tight font-bolder h2">
                            Reset your password
                        </h1>
                        <p class="mt-2">Buy, Sell, & Trade Popular Collectibles on ThreeStream</p>
                    </div>
                    <div class="mt-4">
                        <span class="text-md font-bold">Don't have an account? </span>
                        <a @click.prevent="currentAuthFlow = AuthFlow.Register" class="text-warning text-md font-semibold">Sign up</a>
                    </div>
                    <div class="mb-4">
                        <span class="text-md font-bold">Remember your password? </span>
                        <a @click.prevent="currentAuthFlow = AuthFlow.SignIn" class="text-warning text-md font-semibold">Sign In</a>
                    </div>
                    <div class="mb-5">
                        <label class="form-label" for="email">Email address</label>
                        <input v-model="resetPasswordEmail" type="email" class="form-control form-control-muted" id="email" placeholder="Your email address">
                    </div>
                    <div class="alert alert-danger mb-5" role="alert" v-for="err in resetPasswordErrors" :key="err">
                        {{ err }}
                    </div>
                    <div>
                        <button @click="resetPassword" class="btn btn-primary w-full">
                            Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import ErrorLogger from "@/helpers/ErrorLogger";
import LoadingHelper from "@/helpers/LoadingHelper";
import ToastHelper from "@/helpers/ToastHelper";
import { toggleModal } from "@/hooks/BootstrapHooks";
import { ApiErrorResponse, User } from "@/services/api/models";
import UserService from "@/services/domain/UserService";
import StoreMutations from "@/store/store.constants";
import { ref } from "vue";
import eventBus from "@/events/EventBus";
import ImageHelper from "@/helpers/ImageHelper";
import AnalyticsService from "@/services/AnalyticsService";
import { DateTime } from "luxon";
import { useRoute, useRouter } from "vue-router";
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import StringHelper from "@/helpers/StringHelper";
import { useStore } from "@/store/main.store";
import defaultPromoImage from '@/assets/junkie-icon-100x100.svg';

enum AuthFlow {
    SignIn,
    Register,
    ResetPassword
}

interface LoginCredentials {
    email: string,
    password: string
}

interface RegistrationDetails {
    name: string,
    email: string,
    password: string,
    referralCode: string,
    isTermsChecked: boolean
}

const store = useStore()
const route = useRoute()
const hcaptchakey = import.meta.env.VITE_HCAPTCHA_SITE_KEY as string;
const captcha = ref(null as any);

const currentAuthFlow = ref(AuthFlow.Register);

const loginCredentials = ref({} as LoginCredentials)
const registrationDetails = ref({} as RegistrationDetails)
const resetPasswordEmail = ref('');

let livestreamDetails = {
    livestreamId: '',
    livestreamTitle: '',
    livestreamDate: ''
};

const promoImageUrl = ref('');
const promoDescriptionText = ref('')

const loginErrors = ref([])
const registrationErrors = ref([])
const resetPasswordErrors = ref([])
const isCaptchaVerified = ref(false);

const router = useRouter();

router.beforeEach(() => {
    resetMarketingValues();
})

function resetMarketingValues() {
    promoImageUrl.value = '';
    promoDescriptionText.value = '';
    livestreamDetails.livestreamId = '';
    livestreamDetails.livestreamTitle = '';
    livestreamDetails.livestreamDate = '';

    // captcha.value.reset();
    // isCaptchaVerified.value = false;
}

eventBus.on('onSignInModalOpen', ({ livestreamId, livestreamTitle, livestreamDate, promoImage, promoDescription }) => {
    promoImageUrl.value = !promoImage ? defaultPromoImage : ImageHelper.getLivestreamPromoImage(livestreamId, promoImage)
    promoDescriptionText.value = promoDescription;

    livestreamDetails = { livestreamId, livestreamTitle, livestreamDate }
});

function verifyCaptcha () {
    isCaptchaVerified.value = true;
}

async function login() {
    const loader = LoadingHelper.showLoader();

    try {
        const user = await UserService.login(loginCredentials.value.email, loginCredentials.value.password);

        if (user.isForgotPasswordRequested) {
            ToastHelper.warning("You're using a generated password. Please change your password under Account Settings.");
        }

        store.setCurrentUser(user);
        eventBus.emit('onLogin', { user })

        toggleModal('authModal', 'hide');        

        if (route.name !== 'AttendLivestream' && route.name !== 'PresentLivestream' && route.name !== 'Vid') router.push({ name: 'Feed' })

        window.location.reload();
    } catch (err) {
        loginErrors.value = await ErrorLogger.logApiError(err, false);
    }

    LoadingHelper.hideLoader(loader);
}

async function register() {

    // if (!registrationDetails.value.isTermsChecked || !isCaptchaVerified.value) return;
    if (!registrationDetails.value.isTermsChecked) return;

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

        if (!StringHelper.isNullOrEmpty(registrationDetails.value.referralCode)) {
            user.userAttributes = {
                referralId: registrationDetails.value.referralCode
            }            
        }

        const savedUser = await UserService.register(user);

        // AnalyticsService.logLivestreamRegistrationInGoogleTagManager(
        //     savedUser.id, savedUser.name, savedUser.email,
        //     livestreamDetails.livestreamId, livestreamDetails.livestreamTitle,
        //     promoDescriptionText.value, livestreamDetails.livestreamDate, referralId)


        loginCredentials.value.email = savedUser.email;
        loginCredentials.value.password = user.password;

        await login();
    } catch (err) {
        registrationErrors.value = await ErrorLogger.logApiError(err, false);
    }

    LoadingHelper.hideLoader(loader);
}

async function resetPassword() {
    const loader = LoadingHelper.showLoader();

    try {
        await UserService.resetPassword(resetPasswordEmail.value)

        ToastHelper.success('Your password has been successfully reset. Please check your email for details')
        toggleModal('authModal', 'hide');
    } catch (err) {
        resetPasswordErrors.value = await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}

</script>

<style scoped>
h1, h2, h3, h4, h5, h6, label {
    color: #000 !important;
}

#hcap-script {
    text-align: -webkit-center !important;
}
@media (max-width: 575px){
    .modal-dialog, .modal-content {
        height: 80%;
    }
    .modal-body {
        overflow-y: scroll;
    }
}
</style>