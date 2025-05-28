<template>
<main class="main-content mt-0">
    <section>
        <div class="px-5 py-5 p-lg-0 h-screen bg-surface-secondary d-flex flex-column justify-content-center">
        <div class="d-flex justify-content-center">
            <div
                class="col-12 col-md-9 col-lg-6 min-h-lg-screen d-flex flex-column justify-content-center py-lg-16 px-lg-20 position-relative">
                <div class="row">
                    <div class="col-lg-10 col-md-9 col-xl-7 mx-auto">
                        <div class="text-center mb-12"><a class="d-inline-block" href="#"><img
                                    src="https://clever-dashboard.webpixels.work/img/logos/clever-primary-sm.svg"
                                    class="h-12" alt="..."></a>
                            <h1 class="ls-tight font-bolder mt-6">Create your account</h1>
                        </div>
                        <form>
                            <div class="mb-5"><label class="form-label" for="name">First Name</label> <input type="text"
                                    v-model="currentUser.firstName" class="form-control" id="firstname" placeholder="Enter your first name"></div>
                            <div class="mb-5"><label class="form-label" for="name">Last Name</label> <input type="text"
                                    v-model="currentUser.lastName" class="form-control" id="lastname" placeholder="Enter your last name"></div>
                            <div class="mb-5"><label class="form-label" for="email">Email address</label> <input
                                    v-model="currentUser.email" type="email" class="form-control" id="email" placeholder="Your email address">
                            </div>
                            <div class="mb-5"><label class="form-label" for="password">Password</label> <input
                                    v-model="currentUser.password" type="password" class="form-control" id="password" placeholder="Password"
                                    autocomplete="current-password"></div>
                            <div class="mb-5">
                                <div class="form-check"><input class="form-check-input" type="checkbox"
                                        v-model="termsAndPrivacyChecked" name="check_example" id="check-remind-me"> <label
                                        class="form-check-label font-semibold text-muted" for="check-remind-me">By
                                        creating an account means you agree to the Terms and Conditions, and our
                                        Privacy Policy</label></div>
                            </div>
                            <div><button :disabled="!termsAndPrivacyChecked" class="btn btn-primary w-full" @click.prevent="register()">Register</button></div>
                        </form>
                        <div class="py-5 text-center"><span class="text-xs text-uppercase font-semibold">or</span>
                        </div>
                        <div class="row g-3">
                            <div class="col-sm-6"><a href="#" class="btn btn-neutral w-full"><span
                                        class="icon icon-sm pe-2"><img alt="..."
                                            src="https://clever-dashboard.webpixels.work/img/social/google.svg">
                                    </span><span>Google</span></a></div>
                            <div class="col-sm-6"><a @click.prevent="initFbLogin()" class="btn btn-neutral w-full"><span
                                        class="icon icon-sm pe-2"><img alt="..."
                                            src="https://clever-dashboard.webpixels.work/img/social/facebook.svg">
                                    </span><span>Facebook</span>

                                    <span style="font-size:5px" v-show="false">
                                        <v-facebook-login :app-id="fb_app_id" version="v12.0" :use-alt-logo="true" sdk-locale="en_US"
                                        :login-options="fb_login_options" text-class="text-sm" @login="handleFbLogin"></v-facebook-login>
                                    </span>

                                    </a></div>
                        </div>
                        <div class="my-6"><small>Already have an account?</small> <a @click.prevent="navigateToLogin()"
                                class="text-warning text-sm font-semibold">Sign in</a></div>

                        <button v-show="false" id="registerCloseButton" type="button"
                    class="btn btn-sm btn-neutral"
                    data-bs-dismiss="modal"></button>

                    <button v-show="false" id="gotoLoginModal" data-bs-target="#loginModal" data-bs-toggle="modal">Login</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
    </section>
</main>
</template>

<script setup lang="ts">
import { LoginHelper } from '@/helpers/LoginHelper';
import { RestApi } from '@/services/RestApi';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import User from '../../models/User';
import VFacebookLogin from 'vue-facebook-login-component-next';
import UserService from '@/services/domain/UserService';

const router = useRouter();

let currentUser = reactive(new User());
let termsAndPrivacyChecked = ref(false);
let credentials = reactive({
    email: '',
    password: ''
});

const fb_login_options = {
    scope: 'email,public_profile'
};
const fb_app_id = '200513982272025';

function handleFbLogin(response: any) {
    if (response) {
        LoginHelper.faceBookSignIn(response);
    }
}

function initFbLogin() {
   ((document.getElementsByClassName('v-facebook-login') as HTMLCollection).item(0) as HTMLElement).click();
}

async function register() {
    currentUser.email = currentUser.email.toLowerCase();

    try {
        currentUser.authProvider = "Conifer";
        await UserService.saveUser(currentUser);

        credentials.email = currentUser.email;
        credentials.password = currentUser.password as string;

        await LoginHelper.signIn(credentials);

        (document.getElementById('registerCloseButton') as HTMLElement).click();

    } catch (err) {
        console.log(err);
    }
}

function navigateToLogin() {
    (document.getElementById('gotoLoginModal') as HTMLElement).click();
}
</script>

<style scoped>

</style>