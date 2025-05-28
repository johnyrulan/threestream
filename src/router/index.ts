import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue';
import Register from '../views/auth/Register.vue';
import ManageAccount from '../views/account/ManageAccount.vue';
import EditProfile from '../views/account/EditProfile.vue';
import BillingInfo from '../views/account/BillingInfo.vue';
import SalesHistory from '../views/account/SalesHistory.vue';
import ManageShipping from '../views/account/ManageShipping.vue';
import AirDropFest from '../views/promos/AirDropFest.vue';
import { RestApi } from '@/services/RestApi';
import StoreMutations from '@/store/store.constants';
import { Store } from 'vuex';
import NFTs from '../views/nft/NFTs.vue';
import LivestreamService from '@/services/domain/LivestreamService';
import AnalyticsService from '@/services/AnalyticsService';
import { useStore } from '@/store/main.store';
import { storeToRefs } from 'pinia';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/promo/airdrop-fest',
    name: 'AirDropFestPromo',
    component: () => import(/* webpackChunkName: "promo" */ '../views/promos/AirDropFest.vue'),
  },
  {
    path: '/waitlist',
    name: 'AppWaitlist',
    component: () => import(/* webpackChunkName: "waitlist" */ '../views/promos/AppWaitlist.vue'),
  },  
  {
    path: '/account',
    name: 'ManageAccount',
    component: ManageAccount,
    redirect: '/account/profile',
    children: [
      {
        path: '/account/profile',
        component: EditProfile,
        name: 'EditProfile'
      },
      {
        path: '/account/billing',
        component: BillingInfo,
        name: 'BillingInfo'
      },
      {
        path: '/account/saleshistory',
        component: SalesHistory,
        name: 'SalesHistory'
      },
      {
        path: '/account/shipping',
        component: ManageShipping,
        name: 'ManageShipping'
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue')
  },
  {
    path: '/messages/:id?',
    name: 'Messages',
    component: () => import('../views/messages/Messages.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/create/livestream/',
    name: 'CreateLivestream',
    component: () => import( '../views/ManageLivestream.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/import/',
    name: 'ImportNFTs',
    component: () => import('../views/nft/ImportNFTs.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rebreaks/',
    name: 'ReBreaks',
    component: () => import('../views/rebreaks/ReBreaks.vue'),
    meta: { requiresAuth: true }
  },  
  {
    path: '/edit/livestream/:livestreamId?',
    name: 'EditLivestream',
    component: () => import('../views/ManageLivestream.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/livestream/:id/attend',
    name: 'AttendLivestream',
    component: () => import('../views/livestream/LivestreamAttendee.vue')
  },
  {
    path: '/livestream/:id/attend-v2',
    name: 'AttendLivestreamV2',
    component: () => import('../views/livestream/LivestreamAttendeeV2.vue')
  },
  {
    path: '/livestream/:id/present',
    name: 'PresentLivestream',
    component: () => import('../views/livestream/LivestreamPresenter.vue')
  },
  {
    path: '/livestream/:id/costream/:inviteId',
    name: 'CostreamLivestream',
    component: () => import('../views/livestream/LivestreamCostreamer.vue')
  },  
  {
    path: '/users/all',
    name: 'users',
    component: () => import('../views/admin/Users.vue')
  },
  {
    path: '/profile/orders',
    name: 'UserOrders',
    component: () => import('../views/physical/UserOrders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/nfts',
    name: 'NFTs',
    component: NFTs,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:id',
    name: 'UserProfile',
    component: () => import('../views/profile/UserProfile.vue')
  },
  {
    path: '/feed',
    name: 'Feed',
    component: () => import('../views/social/Feed.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/livestreams/hosting',
    name: 'SellerLivestreams',
    component: () => import('../views/livestream/SellerLivestreams.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/seller/dashboard',
    name: 'SellerDashboard',
    component: () => import('../views/physical/SellerDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/create/video',
    name: 'CreateVideo',
    component: () => import('../views/video/ManageVideo.vue'),    
    meta: { requiresAuth: true }
  },
  {
    path: '/manage/video/:id',
    name: 'ManageVideo',
    component: () => import('../views/video/ManageVideo.vue'),    
    meta: { requiresAuth: true }
  },
  {
    path: '/manage/flicks',
    name: 'ManageFlicks',
    component: () => import('../views/video/UserVideos.vue'),    
    meta: { requiresAuth: true }
  },  
  {
    path: '/flicks',
    name: 'Flicks',
    component: () => import('../views/video/Flicks.vue'),    
  },
  {
    path: '/flick/:id',
    name: 'Vid',
    component: () => import('../views/video/Vid.vue'),    
  },
  // {
  //   path: '/marketplace',
  //   name: 'Marketplace',
  //   component: () => import('../views/marketplace/Marketplace.vue')
  // },
  // {
  //   path: '/auctions',
  //   name: 'Auctions',
  //   component: () => import('../views/marketplace/Auctions.vue')
  // },
  // {
  //   path: '/marketplace/sale/:id',
  //   name: 'MarketplaceSale',
  //   component: () => import('../views/marketplace/MarketplaceSale.vue')
  // },
  {
    path: '/offers',
    name: 'Offers',
    component: () => import('../views/marketplace/Offers.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const store = useStore()

  const { currentUser } = storeToRefs(store)
  
  try {
    const currentUser = (await RestApi.User.getCurrentUser()).data
    store.setCurrentUser(currentUser);
  }
  catch(err) {
    store.setCurrentUser(null);
  }

  if (to.meta.requiresAuth && !currentUser.value) {
    next({ name: 'Home' })
  }

  if (currentUser.value) {
    AnalyticsService.track(to.name.toString(), currentUser.value);
    AnalyticsService.logUserInGoogleTagManager(currentUser.value.id, currentUser.value.name, currentUser.value.email);
  }

  next();
})

export default router
