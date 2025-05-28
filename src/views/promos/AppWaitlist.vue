<template>
<div class="bg-dark">
<div class="container py-12">
    <div class="row">
        <div class="col text-center">
            <img src="@/assets/junkie_logo.png" style="max-height: 250px"/>
            <h1 class="mt-6">The Social Marketplace for Collectibles</h1>
            <h2 class="text-center text-success">Coming March 2023</h2>
            <h3 class="text-center text-success">Join us LIVE from Megacon Orlando</h3>
            <div class="mt-6 d-flex flex-row gap-4 justify-content-center">
                <button class="btn btn-purple btn-lg" @click="scrollToWaitlist">Join the Waitlist <i class="bi bi-lightning-fill"></i></button>
                <!-- <button class="btn btn-purple btn-lg">Apply to Sell <i class="bi bi-shop"></i> </button> -->
                <!-- <button class="btn btn-purple btn-lg">Watch Video <i class="bi bi-fast-forward-circle-fill"></i></button> -->
            </div>
        </div>
    </div>
    <hr class="border-white w-full mt-6">
    <h1 class="text-yellow text-center mt-6">Daily Live Auctions <i class="bi bi-lightning-fill"></i></h1>
    <div class="row mt-12 text-center">        
        <div class="col-12 col-md-6 order-1">
            <video src="https://junkieprodstorage.blob.core.windows.net/promos/app_waitlist_live_show.MP4"
            autoplay playsinline muted loop
            style="max-height: 600px" class="rounded-3 transform shadow-4 translate-y-n3-hover border-2"/>
        </div>
        <div class="col-12 col-md-6 d-flex flex-column gap-6 order-2 order-md-1 mt-6 mt-md-0">
            <div class="d-flex flex-column">
                <h2 class="text-purple">Live Auctions <i class="bi bi-lightning-charge-fill"></i></h2>
                <h4 class="font-regular">
                    Attend Auctions from Verfied Collectors/Stores to Bid on High-Quality Collectibles. Make sure to follow your favorite hosts!
                </h4>
            </div>            
            <!-- <div class="d-flex flex-column">
                <h2 class="text-purple">Marketplace <i class="bi bi-shop"></i></h2>
                <h4 class="font-regular">
                    Sell your own Collectibles for sale & purchase items super easily right from the Feed. 
                </h4>
            </div>
            <div class="d-flex flex-column">
                <h2 class="text-purple">Collection & Price Tracking <i class="bi bi-graph-up-arrow"></i></h2>
                <h4 class="font-regular">
                    View a graph of the real-time value of your collectibles!
                </h4>
            </div> -->
        </div>
    </div>    
    <hr class="border-white w-full mt-6">
    <h1 class="text-yellow text-center mt-6">Buy, Sell, & Trade Collectibles <i class="bi bi-shop"></i></h1>
    <div class="row mt-6 text-center">
        <div class="col-12 col-md-6 d-flex flex-column gap-6 order-2 order-md-1 mt-6 mt-md-0 ">
            <div class="d-flex flex-column">
                <h2 class="text-purple">Marketplace Feed <i class="bi bi-newspaper"></i></h2>
                <h4 class="font-regular">
                    Browse listings in a super easy Feed & Buy in seconds!
                    When you create a new listing, it automatically Shows
                    up for engaged buyers!
                </h4>
            </div>
            <div class="d-flex flex-column">
                <h2 class="text-purple">Collection & Price Tracking <i class="bi bi-graph-up-arrow"></i></h2>
                <h4 class="font-regular">
                    View a graph of the real-time value of your collectibles!
                </h4>
            </div>            
            <!-- <div class="d-flex flex-column">
                <h2 class="text-purple">Join or Start Communities <i class="bi bi-chat-quote-fill"></i></h2>
                <h4 class="font-regular">
                    Join or Start your Own communities for all types of interests like Marvel, DC, Image Comics, Funkos, 
                    Action Figures, Star Wars, Pokemon, Magic The Gathering & more!                   
                </h4>
            </div>
            <div class="d-flex flex-column">
                <h2 class="text-purple">Discover <i class="bi bi-bookmark-heart-fill"></i></h2>
                <h4 class="font-regular">
                    Discover  Hot🔥, New, Trending news across
                    your favorite collectibles brands!
                </h4>
            </div> -->
        </div>
        <div class="col-12 col-md-6 order-1 order-md-2">
            <video src="https://junkieprodstorage.blob.core.windows.net/promos/app_waitlist_feed.MP4"
            autoplay playsinline muted loop
            style="max-height: 600px" class="rounded-3 transform shadow-4 translate-y-n3-hover border-2"/>
        </div>
    </div>

    <hr class="border-white w-full mt-6">
    <h1 class="text-yellow text-center mt-6">Compete, Earn Rewards, & Win Prizes</h1>
    <div class="row mt-6 text-center">
        <div class="col-12 col-md-6 d-flex flex-column gap-6 order-2 order-md-1 mt-6 mt-md-0">
            <!-- <div class="d-flex flex-column">
                <h2 class="text-purple">Fan Battles 🥊</h2>
                <h4 class="font-regular">
                    Got a competitive spirit? You can now live battle with other fans
                    by competing in live TGC battles & collector challenges!
                </h4>
            </div> -->
            <div class="d-flex flex-column">
                <h2 class="text-purple">JUNKIE Points 🪙</h2>
                <h4 class="font-regular">
                    Earn JUNKIE Points throughout the app & use them
                    to enter raffles, unlock exclusive content/auctions,
                    & win awesome weekly prizes!
                </h4>
            </div>
            <div class="d-flex flex-column">
                <h2 class="text-purple">Leaderboards 🏆</h2>
                <h4 class="font-regular">
                    Want to see how you rank against other collectors? Leaderboards are updated
                    daily & weekly to see your standings!
                </h4>
            </div>
        </div>
        <div class="col-12 col-md-6 order-1 order-md-2">
            <img src="https://uploads-ssl.webflow.com/63ec53edfb40bb37ececd400/63ee444609397d280605a19c_Junkie%20leader%20boards.png"
            style="max-height: 500px" class="transform shadow-4 translate-y-n3-hover"/>
        </div>
    </div>
    <hr class="border-white w-full mt-6" id="waitlist">    
    <h1 class="text-yellow text-center mt-6">Join the Waitlist & Get Early Access</h1>
    <h2 class="text-center font-italic">Coming March 2023</h2>
    <div class="mt-6 d-flex justify-content-center">
        <iframe
            allowtransparency="true"
            id="waitlist_iframe"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
            width="400px"
            height="600px"
            src="https://getwaitlist.com/waitlist/5190"
            style="border-radius: 8px;"
        >
        </iframe>
    </div>
    <!-- <div class="mt-6 rounded-3 bg-purple-dark shadow-3 border-jk-secondary border-2 py-4 mx-auto w-full w-md-1/2">
        <div class="px-4">
            <div class="mb-5">
                <label class="form-label" for="email">Name</label>
                <input v-model="registrationDetails.email" type="email" 
                    class="form-control form-control-muted" id="email" placeholder="Your email address">
            </div>    
            <div class="mb-5">
                <label class="form-label" for="email">Email address</label>
                <input v-model="registrationDetails.email" type="email" 
                    class="form-control form-control-muted" id="email" placeholder="Your email address">
            </div>   
            <div class="mb-5">
                <label class="form-label" for="email">Instagram</label>
                <input v-model="registrationDetails.email" type="email" 
                    class="form-control form-control-muted" id="email" placeholder="Your email address">
            </div>             
            <div class="mb-5">
                <label class="form-label" for="email">TikTok</label>
                <input v-model="registrationDetails.email" type="email" 
                    class="form-control form-control-muted" id="email" placeholder="Your email address">
            </div>  
            <div class="mb-5">
                <label class="form-label" for="email">Choose the feature that interests you most</label>
                <select class="form-select" aria-label="Default select example">
                    <option value="1">Social Feed</option>
                    <option value="2">Communities</option>
                    <option value="3">Live Shows</option>
                    <option value="3">Marketplace</option>
                    <option value="3">Fan Battles</option>
                    <option value="3">Competitions & Leaderboards</option>
                </select>
            </div>              
            <div class="mb-5 text-center">
                <button class="btn btn-yellow btn-lg transition-colors">Join the Waitlist <i class="bi bi-lightning-fill"></i></button>
            </div>
        </div>
    </div> -->
    <!-- <div class="row">
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
    </div> -->
</div>    
</div>

</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';


const name = ref('');
const email = ref('');

function scrollToWaitlist() {
    const element = document.getElementById("waitlist");
    element.scrollIntoView({behavior: "smooth"});
}

onMounted(() => {
    const url = new URL(window.location.href);
    const ref_id = url.searchParams.get('ref_id');
    if (ref_id) {
        document.getElementById("waitlist_iframe").src += `?ref_id=${ref_id}`;
    }
})
</script>

<style scoped>

.bg-purple {
    background-color: #bc33fe !important;
}

.bg-purple-dark {
    background-color: #5c2faf !important;
}

.text-yellow {
    color: #fdeb00 !important;
}

.text-purple {
    color: #a179ff !important;
}

.text-purple-dark {
    color: #5c2faf !important;
}

.btn-purple {
    background-color: #bc33fe !important;
    color: #fff;
}

.btn-purple:hover {
    background-color: #fdeb00 !important;
    color: #000;
}

.btn-yellow {
    background-color: #fdeb00 !important;
    color: #000;
}

.btn-yellow:hover {    
    opacity: 0.8;    
}

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