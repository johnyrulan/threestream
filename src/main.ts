import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap-icons/font/bootstrap-icons.css'
import '@webpixels/css/dist/index.css'
import "@/assets/brand.css";
import VCalendar from 'v-calendar';

import mitt from 'mitt'
import Toast, { POSITION } from 'vue-toastification'
import "vue-toastification/dist/index.css";
import VueCountdown from '@chenfengyuan/vue-countdown';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import 'vue-multiselect/dist/vue-multiselect.css';
import 'vue3-carousel/dist/carousel.css'

import '@/assets/emoji.css';

import 'plyr/dist/plyr.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faBolt, faBoltLightning, faBoxOpen, faCheck, faCloudArrowDown, faCodeFork, faCommentDots, faFaceGrinStars, faFireFlameCurved, faGear, faRobot, faShop, faTruckFast, faTruckRampBox, faUser, faUserSecret, faUsers } from '@fortawesome/free-solid-svg-icons'

import './registerServiceWorker'

import { Buffer } from 'buffer';

window.Buffer = Buffer;
window.global ||= window;

library.add(faUserSecret, faBolt, faBoltLightning, faShop, faUser, faCommentDots, faCheck,
  faBoxOpen, faRobot, faGear, faCloudArrowDown, faTruckFast, faFaceGrinStars, faUsers, faCodeFork)


const defaultToastOptions = {
  position: POSITION.TOP_RIGHT,
  hideProgressBar: true,
  closeOnClick: true,
  timeout: 4000
};
// Vue.config.productionTip = false;
const pinia = createPinia();
pinia.use(piniaPluginPersistedState)
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.config.globalProperties.emitter = mitt()


app.use(router)
  .use(VCalendar, {})
  .use(Toast, defaultToastOptions)
  .use(LoadingPlugin) 
  .use(autoAnimatePlugin)         
  .mount('#app')

app.component(VueCountdown.name, VueCountdown);


