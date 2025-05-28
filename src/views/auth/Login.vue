<template>
<!-- <main class="main-content mt-0">
<section> -->
<div class="px-5 py-5 p-lg-0 h-screen bg-surface-secondary d-flex flex-column justify-content-center">
    <div class="d-flex justify-content-center">
        <div class="col-12 col-md-9 col-lg-6 min-h-lg-screen d-flex flex-column justify-content-center py-lg-16 px-lg-20 position-relative">
            <div class="row">
                <div class="col-lg-10 col-md-9 col-xl-7 mx-auto">
                    <div class="text-center mb-12">
                        <h3 class="display-5">👋</h3>
                        <h1 class="ls-tight font-bolder mt-6">Sign In!</h1>
                        <p class="mt-2">Let's build someting great</p>
                    </div>
                    <form>
                        <div class="mb-5"><label class="form-label" for="email">Email address</label>
                        <input v-model="credentials.email" type="email" class="form-control" id="email" placeholder="Your email address">
                        </div>
                        <div class="mb-5">
                            <div class="d-flex align-items-center justify-content-between">
                                <div><label class="form-label" for="password">Password</label></div>
                                <div class="mb-2"><a href="basic-recover.html"
                                        class="text-sm text-muted text-primary-hover text-underline">Forgot
                                        password?</a></div>
                            </div><input v-model="credentials.password" type="password" class="form-control" id="password"
                                placeholder="Password" autocomplete="current-password">
                        </div>
                        <div class="mb-5">
                            <div class="form-check"><input class="form-check-input" type="checkbox"
                                    name="check_example" id="check-remind-me"> <label class="form-check-label"
                                    for="check-remind-me">Keep me logged in</label></div>
                        </div>
                        <div><button class="btn btn-primary w-full" @click.prevent="defaultLogin()">Sign in</button></div>
                    </form>
                    <div class="py-5 text-center"><span class="text-xs text-uppercase font-semibold">or</span>
                    </div>
                    <div class="row g-3">
                        <div class="col-sm-6"><a href="#" class="btn btn-neutral w-full"><span
                                    class="icon icon-sm pe-2"><img alt="..."
                                        src="https://clever-dashboard.webpixels.work/img/social/google.svg">
                                </span><span>Google</span></a></div>
                        <div class="col-sm-6"><a @click.prevent="initFbLogin()" class="btn btn-neutral w-full"><span
                                    class="icon icon-sm pe-2">
                                    <img alt="..." src="https://clever-dashboard.webpixels.work/img/social/facebook.svg">
                                </span>
                                <span>Facebook</span>

                                <span style="font-size:5px" v-show="false">
                                    <v-facebook-login :app-id="fb_app_id" version="v12.0" :use-alt-logo="true" sdk-locale="en_US"
                                    :login-options="fb_login_options" text-class="text-sm" @login="handleFbLogin"></v-facebook-login>
                                </span>

                                </a></div>
                    </div>
                    <div class="my-6"><small>Don't have an account?</small> <a @click.prevent="navigateToRegister()"
                            class="text-warning text-sm font-semibold">Sign up</a></div>

                    <button v-show="false" id="loginCloseButton" type="button"
                class="btn btn-sm btn-neutral"
                data-bs-dismiss="modal"></button>

                <button v-show="false" id="gotoRegisterModal" data-bs-target="#registerModal" data-bs-toggle="modal">Register</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- </section>
</main> -->
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { LoginHelper } from "../../helpers/LoginHelper";
import VFacebookLogin from 'vue-facebook-login-component-next';
import { Button } from "bootstrap";

const router = useRouter();
let credentials = reactive( { email: '', password: ''} );
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

async function defaultLogin() {
    await LoginHelper.signIn(credentials);

    (document.getElementById('loginCloseButton') as HTMLElement).click();
}

function navigateToRegister() {
    (document.getElementById('gotoRegisterModal') as HTMLElement).click();
}
</script>

<style scoped>

</style>