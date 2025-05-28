<template>
<div class="flex-xl-none w-xl-96 h-xl-calc position-sticky top-xl-18 p-2 bg-top-nav" style="--x-h-xl: 4.5rem;">
<aside class="px-2 pt-5 pb-2 h-full">
    <div class="d-flex flex-column h-full">
      <h3 class="pb-1 border-bottom border-jk-accent">Chat</h3> 
      <ChatSideBar 
        :livestreamId="props.livestream.id" 
        :is-host="mode === 'host'"         
        :class="'flex-fill flex-grow-1 h-full'" 
      />
      <div class="flex-1">
        <div class="position-relative mt-2 message-input bottom-0 start-0 w-full rounded-4 px-4 py-3 j-box-glow">
          <div class="pb-3" :class="{ 'border-bottom': saleNftAsset.sale || auctionPysicalAssset.sale }">
            <div class="my-1" v-if="isCurrentLivestreamDigital">
              <button class="btn btn-primary btn-sm" @click="openPurchaseCreditsModal" v-if="junkieCreditsBalance > 0">
                Credits: ${{ junkieCreditsBalance }}
              </button>   
              <button class="btn btn-primary btn-sm" @click="openPurchaseCreditsModal" v-else>
                <i class="bi bi-coin"></i> Buy Credits
              </button>    
              <a href="https://discord.gg/hEk7MZzJAz" target="_blank" class="btn btn-primary btn-sm ms-2">
                Join Discord
              </a>                              
            </div>
            <div class="my-1 d-flex gap-2" v-else>
              <button class="btn btn-primary btn-sm" @click="toggleModal('addNewCardModal', 'show')">
                Card
              </button>         
              <button class="btn btn-primary btn-sm" @click="toggleModal('userAddressModal', 'show')">
                Shipping
              </button>      
              <a href="https://discord.gg/hEk7MZzJAz" target="_blank" class="btn btn-primary btn-sm">
                Join Discord
              </a>                                
            </div>

            <div class="d-flex gap-2 mt-2">
              <div class="input-group input-group-sm">
                  <!-- <a @click="showEmojiPicker = !showEmojiPicker" class="d-flex align-items-center h2 mx-2">😃</a> -->
                  <input :disabled="!currentUser" v-model="message" type="text" class="form-control" aria-label="Text input with segmented dropdown button" v-on:keyup.enter="sendChatMessage" autocomplete="off" placeholder="Send a message">
                  <button :disabled="!currentUser" type="button" class="btn btn-primary" @click.prevent="sendChatMessage">
                      <i class="bi bi-send"></i>
                  </button>                  
              </div>
              <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offCanvasStore" aria-controls="offCanvasStore"><i class="bi bi-shop"></i></button>      
            </div> 
          </div>
          <div v-if="saleNftAsset.sale || auctionPysicalAssset.sale" class="pt-2">
          <div class="d-flex align-items-center mb-2">
            <h5 class="me-auto text-white text-uppercase" v-if="isCurrentAssetPhysical">{{auctionPysicalAssset.physicalAsset.name}}</h5>
            <h5 class="me-auto text-white" v-else>{{saleNftAsset.asset.name}}</h5>
          </div>

          <div class="mb-5">
            <div class="d-flex justify-content-center gap-2">
              <div v-if="isCurrentAssetPhysical" class="">
                <img
                  v-if="auctionPysicalAssset.physicalAsset.physicalAssetAttributes?.images?.length > 0"
                  class="rounded-2 h-32"
                  :src="ImageHelper.getAssetByType(auctionPysicalAssset.physicalAsset.physicalAssetAttributes?.images[0],
                      FileRequestType.PhysicalAssetImage)"
                  alt="">
              </div>

              <div v-else-if="!isCurrentAssetPack">
                <video v-if="saleNftAsset.asset.mainVideoUrl" class="img-fluid rounded-2 h-32" autoplay playsinline loop muted alt="..." :src="saleNftAsset.asset.mainVideoUrl" />
                <img v-else class="img-fluid rounded-2 w-full h-32" :src="saleNftAsset.asset.mainImgUrl" />
              </div>
              <div class="">
                <div v-if="isCurrentAssetPhysical">
                  <div class="mb-3 text-white">{{ auctionPysicalAssset.physicalAsset.description }}</div>
                </div>
                <div v-else-if="isCurrentAssetPack">
                  <h5 class="text-center mb-2">{{ currentAssetPack.name  }} #{{ currentAssetPack.number }}</h5>
                  <div class="text-center d-flex gap-1">
                    <img class="img-fluid rounded-2 h-32" :src="ImageHelper.getRebreakImage(currentAssetPack.assetPackType)" /> 
                    <div>
                      <h4 class="mb-2">Legend:</h4>
                      <h5 class="text-info" v-if="currentAssetPack.assetPackAttributes?.grailCount > 0">Grails: {{ currentAssetPack.assetPackAttributes?.grailCount }}</h5>
                      <h5 class="text-info" v-if="currentAssetPack.assetPackAttributes?.legendaryCount > 0">Legendaries: {{ currentAssetPack.assetPackAttributes?.legendaryCount }}</h5>
                      <h5 v-if="currentAssetPack.assetPackAttributes?.epicCount > 0">Epics: {{ currentAssetPack.assetPackAttributes?.epicCount }}</h5>
                      <h5 v-if="currentAssetPack.assetPackAttributes?.rareCount > 0">Rares: {{ currentAssetPack.assetPackAttributes?.rareCount }}</h5>
                      <h5 v-if="currentAssetPack.assetPackAttributes?.uncommonCount > 0">Uncommons: {{ currentAssetPack.assetPackAttributes?.uncommonCount }}</h5>
                      <h5 v-if="currentAssetPack.assetPackAttributes?.commonCount > 0">Commons: {{ currentAssetPack.assetPackAttributes?.commonCount }}</h5>
                      <h5 v-if="currentAssetPack.assetPackAttributes?.otherCount > 0">Others: {{ currentAssetPack.assetPackAttributes?.otherCount }}</h5>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 px-2 py-1 mb-1" v-if="saleNftAsset.asset.rarity">Rarity: {{ saleNftAsset.asset.rarity }}</span>
                  <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 ms-1 px-2 mb-1 py-1" v-if="saleNftAsset.asset.mintNumber && saleNftAsset.asset.totalSupply">Mint {{ saleNftAsset.asset.mintNumber }} of {{ saleNftAsset.asset.totalSupply }}</span>
                  <div v-if="saleNftAsset.asset.blockChain === Blockchain.Solana" class="d-flex align-items-center justify-content-center text-white">
                    Powered by <img style="height: 25px !important" class="ms-2" src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=021" />
                  </div>
                </div>
                <div class="" data-hj-allow>
                  <vue-countdown v-if="auctionRemainingMilliseconds > 0" :time="auctionRemainingMilliseconds" v-slot="{ minutes, seconds }" @end="endAuction" class="text-info font-bold">
                    <span v-if="(minutes > 0)">{{ minutes }} minutes</span> {{ seconds }} seconds remaining
                  </vue-countdown>
                </div>   
                <div v-if="isCurrentGiveaway">
                  <span v-if="winningBuyer.buyOrder"
                    id="winner-badge"
                    class="badge rounded-pill text-sm px-2 py-1 d-block bg-red-500 transition-colors text-wrap"
                    data-hj-allow>
                    {{ winningBuyer.name }} has won the giveaway
                  </span>
                  <span v-else
                      id="winner-badge"
                      class="badge rounded-pill text-sm px-2 py-1 d-block bg-red-500 transition-colors"
                      data-hj-allow>
                      <span>{{ giveawayEntryCount }} Entries</span>
                  </span>                          
                </div>                     
                <div v-else>
                  <span v-if="winningBuyer.buyOrder"
                    id="winner-badge"
                    class="badge rounded-pill text-sm px-2 py-1 d-block bg-red-500 transition-colors text-wrap"
                    data-hj-allow>
                    {{ winningBuyer.name }}'s  bid is winning: ${{ winningBuyer.buyOrder.amount }}
                  </span>
                  <span v-else
                      id="winner-badge"
                      class="badge rounded-pill text-sm px-2 py-1 d-block bg-red-500 transition-colors"
                      data-hj-allow>
                      <span v-if="isCurrentAssetPhysical">Starting bid: ${{ auctionPysicalAssset.sale.floorPrice }}</span>
                      <span v-else>Starting bid: ${{ saleNftAsset.sale.floorPrice }}</span>
                  </span>                          
                </div>   
                <div v-if="mode === 'buyer' && !isCurrentGiveaway">
                  <div class="d-flex gap-2 mt-2 align-items-center" v-if="winningBuyer.buyOrder">
                      <div class="text-white">Bid: </div>
                      <button class="btn btn-sm btn-success rounded-pill" @click="placeBid(winningBuyer.buyOrder.amount + 1)">${{ winningBuyer.buyOrder.amount + 1 }}</button>
                      <button class="btn btn-sm btn-success rounded-pill" @click="placeBid(winningBuyer.buyOrder.amount + 5)">${{ winningBuyer.buyOrder.amount + 5 }}</button>
                      <button class="btn btn-sm btn-success rounded-pill" @click="placeBid(winningBuyer.buyOrder.amount + 10)">${{ winningBuyer.buyOrder.amount + 10 }}</button>
                  </div>                        
                  <div class="d-flex gap-2 mt-2 align-items-center" v-else-if="isCurrentLivestreamDigital">
                    <div class="text-white">Bid: </div>
                    <button 
                      class="btn btn-sm btn-success rounded-pill"
                      @click="placeBid(saleNftAsset.sale.floorPrice + 1)">${{ saleNftAsset.sale.floorPrice + 1 }}</button>
                    <button
                      class="btn btn-sm btn-success rounded-pill"
                      @click="placeBid(saleNftAsset.sale.floorPrice + 5)">${{ saleNftAsset.sale.floorPrice + 5 }}</button>
                    <button
                      class="btn btn-sm btn-success rounded-pill"
                      @click="placeBid(saleNftAsset.sale.floorPrice + 10)">${{ saleNftAsset.sale.floorPrice + 10 }}</button>                                    
                  </div> 
                  <div class="d-flex gap-2 mt-2 align-items-center" v-else>
                    <div class="text-white">Bid: </div>
                    <button 
                      class="btn btn-sm btn-success rounded-pill"
                      @click="placeBid(auctionPysicalAssset.sale.floorPrice + 1)">${{ auctionPysicalAssset.sale.floorPrice + 1 }}</button>
                    <button
                      class="btn btn-sm btn-success rounded-pill"
                      @click="placeBid(auctionPysicalAssset.sale.floorPrice + 5)">${{ auctionPysicalAssset.sale.floorPrice + 5 }}</button>
                    <button
                      class="btn btn-sm btn-success rounded-pill"
                      @click="placeBid(auctionPysicalAssset.sale.floorPrice + 10)">${{ auctionPysicalAssset.sale.floorPrice + 10 }}</button>                                    
                  </div>                 
                </div>   
                <div v-if="mode === 'buyer' && isCurrentGiveaway" class="mt-2">     
                    <button class="btn btn-secondary w-full" 
                      v-if="hasCurrentUserEnteredGiveaway"
                      disabled>Entered Giveaway</button>                    
                      <button class="btn btn-secondary w-full" 
                        v-else @click="enterGiveaway">Follow & Enter Giveaway</button>                      
                </div>                   
                
              </div>
            </div>
            <div v-if="isCurrentNFTRedeemable" class="my-2">
                <span class="badge badge-pill gradient-right start-indigo-500 end-red-500 w-full text-base py-3">
                    🎁 Redeemable
                </span>
            </div>
          </div>

          <div v-if="mode === 'host'" class="mt-4">
            <button class="btn btn-info btn-sm w-full rounded-pill" @click="endAuction" v-if="isCurrentLivestreamDigital && saleNftAsset.sale.saleType === SaleType.LiveAuction">End Auction</button>            
            <button class="btn btn-info btn-sm w-full rounded-pill" @click="endAuction" v-else-if="!isCurrentLivestreamDigital && auctionPysicalAssset.sale.saleType === SaleType.LiveAuction">End Auction</button>
            <button class="btn btn-info btn-sm w-full rounded-pill" @click="endAuction" v-else>End Giveaway</button>
          </div>
          <div v-else-if="currentUser && mode === 'buyer' && !isCurrentGiveaway">
            <div class="input-group input-group-sm my-1">
                <span class="input-group-text">$</span>
                <input v-model="customBidAmount" type="number" class="form-control" aria-label="Text input with segmented dropdown button" step="1" oninput="validity.valid||(value='');">
                <button type="button" class="btn btn-success" @click="placeBid(customBidAmount)">Bid</button>
            </div>
          </div>
          </div>

          <div class="my-2" v-else-if="currentOpenPack.id">
            <h5 class="text-center mb-2">{{ currentOpenPack.name  }} #{{ currentOpenPack.number }}</h5>
    
              <div class="d-flex gap-1"> 
                <div class="flex-1 text-center">
                    <div v-if="currentOpenPack && showPackVideo" >
                      <video 
                        id="reBreakVid"
                        autoplay 
                        playsinline 
                        :src="ImageHelper.getRebreakVideo(currentOpenPack.assetPackType)"
                        class="rounded-4 h-32">
                      </video>
                    </div>    
                    <div v-if="currentPackCard && !showPackVideo">
                      <video v-if="currentPackCard.mainVideoUrl" class="img-fluid h-32 rounded-2" autoplay playsinline loop muted alt="..." :src="currentPackCard.mainVideoUrl" />
                      <img v-else class="img-fluid rounded-2 w-full h-32" :src="currentPackCard.mainImgUrl" />
                      <div class="">
                            <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 px-2 py-1 mb-1" v-if="currentPackCard.rarity">Rarity: {{ currentPackCard.rarity }}</span>
                            <span class="badge rounded-pill gradient-bottom-right end-indigo-400 start-blue-500 px-2 py-1 mb-1" v-if="currentPackCard.mintNumber && currentPackCard.totalSupply">Mint {{ currentPackCard.mintNumber }} of {{ currentPackCard.totalSupply }}</span>
                            <div v-if="currentPackCard.blockChain === Blockchain.Solana" class="d-flex align-items-center justify-content-center text-white">
                              Powered by <img style="height: 25px !important" class="ms-2" src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=021" />
                            </div>
                      </div>                
                    </div>  
                </div>
                <div class="text-center flex-1">
                  <h5 class="mb-2">Legend:</h5>
                  <h6 class="text-info" v-if="currentOpenPack.assetPackAttributes?.grailCount > 0">Grails: {{ currentOpenPack.assetPackAttributes?.grailCount }}</h6>
                  <h6 class="text-info" v-if="currentOpenPack.assetPackAttributes?.legendaryCount > 0">Legendaries: {{ currentOpenPack.assetPackAttributes?.legendaryCount }}</h6>
                  <h6 v-if="currentOpenPack.assetPackAttributes?.epicCount > 0">Epics: {{ currentOpenPack.assetPackAttributes?.epicCount }}</h6>
                  <h6 v-if="currentOpenPack.assetPackAttributes?.rareCount > 0">Rares: {{ currentOpenPack.assetPackAttributes?.rareCount }}</h6>
                  <h6 v-if="currentOpenPack.assetPackAttributes?.uncommonCount > 0">Uncommons: {{ currentOpenPack.assetPackAttributes?.uncommonCount }}</h6>
                  <h6 v-if="currentOpenPack.assetPackAttributes?.commonCount > 0">Commons: {{ currentOpenPack.assetPackAttributes?.commonCount }}</h6>
                  <h6 v-if="currentOpenPack.assetPackAttributes?.otherCount > 0">Others: {{ currentOpenPack.assetPackAttributes?.otherCount }}</h6>
                </div>                             

                  
              </div>                    
              <button v-if="mode === 'host' && currentIndex < currentPackCards.length - 1" 
                class="btn btn-warning btn-sm w-full rounded-pill mt-1" 
                @click="revealNextCard(currentIndex + 1)">Reveal Card</button>
              <button v-if="mode === 'host' && currentIndex === currentPackCards.length - 1" 
                class="btn btn-danger btn-sm w-full rounded-pill mt-2" 
                @click="revealNextCard(currentIndex + 1)">Close</button>                
              <button v-if="mode === 'host' && currentIndex > 0" 
                class="btn btn-success btn-sm w-full rounded-pill mt-2" 
                @click="revealNextCard(currentIndex - 1)">Go Back</button>                
          </div>


        </div>
          <!-- <EmojiPicker id="popover-content" v-show="showEmojiPicker" :native="true"  @select="selectEmoji" class="popover-emoji"  /> -->
        </div>  
    </div>
</aside>


</div>

<div class="offcanvas offcanvas-start bg-jk-gray j-border-secondary" data-bs-scroll="true" tabindex="-1" id="offCanvasStore" aria-labelledby="offcanvasRightLabel">
  <div class="offcanvas-header">
    <h2 id="offcanvasRightLabel" class="text-white">Store</h2>
    <button type="button" class="btn-close text-reset bg-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body pt-0">
    <div class="mt-2 mb-4 d-flex gap-3" v-if="!isCurrentLivestreamDigital">
      <button class="btn btn-primary btn-sm w-full" @click="getPhysicalAssets"><i class="bi bi-arrow-clockwise"></i> Reload</button>      
    </div>    
    <ul class="nav nav-pills mb-3">
      <li class="nav-item">
        <button @click="selectStoreType(StoreType.BuyNow)" :class="['nav-link', selectedStoreType === StoreType.BuyNow ? 'active' : '']" aria-current="page">Buy Now</button>
      </li>
      <li class="nav-item">
        <button @click="selectStoreType(StoreType.Auction)" :class="['nav-link', selectedStoreType === StoreType.Auction ? 'active' : '']" aria-current="page">Auction</button>
      </li>
      <li class="nav-item">
        <button @click="selectStoreType(StoreType.Giveaway)" :class="['nav-link', selectedStoreType === StoreType.Giveaway ? 'active' : '']" aria-current="page">Giveaways</button>
      </li>      
      <li class="nav-item">
        <button @click="selectStoreType(StoreType.Sold)" :class="['nav-link', selectedStoreType === StoreType.Sold ? 'active' : '']" aria-current="page">Sold</button>
      </li>
      <li class="nav-item" v-if="mode === 'host'">
        <button @click="selectStoreType(StoreType.NFTs)" :class="['nav-link', selectedStoreType === StoreType.NFTs ? 'active' : '']" aria-current="page">NFTs</button>
      </li>
      <li class="nav-item" v-if="mode === 'host'">
        <button @click="selectStoreType(StoreType.Packs)" :class="['nav-link', selectedStoreType === StoreType.Packs ? 'active' : '']" aria-current="page">Packs</button>
      </li>            
      <li class="nav-item" v-if="mode === 'host'">
        <button @click="selectStoreType(StoreType.Inventory)" :class="['nav-link', selectedStoreType === StoreType.Inventory ? 'active' : '']" aria-current="page">Inventory</button>
      </li>
    </ul>    
    <div class="d-flex gap-3 flex-wrap" v-if="isCurrentLivestreamDigital">
            <NFTLiveSaleCard
              v-if="selectedStoreType === StoreType.BuyNow || selectedStoreType === StoreType.Auction || selectedStoreType === StoreType.Giveaway || selectedStoreType === StoreType.Sold"
              style="max-width: 45%; flex-grow: 1"
              v-for="sale in salesToDisplay" :key="sale.sale.id"
              :sale-with-asset="sale"
              :mode="mode"
              :currentPage="currentPage"
              :credit-balance="junkieCreditsBalance"
            />
            <div v-if="selectedStoreType === StoreType.NFTs" class="d-flex gap-3 flex-wrap">
              <NFTManageFeatureCard                       
                  style="max-width: 45%; flex-grow: 1"
                  v-for="(asset, index) in sellerNFTAssetsToDisplay"
                  :key="asset.contractAddress"
                  :nft-asset="asset"
                  :livestream-id="props.livestream.id"
                  @feature-asset="onAddAsset"
                />
            </div>
            <div v-if="selectedStoreType === StoreType.Packs" class="d-flex gap-3 flex-wrap">
              <NFTRebreakManageFeatureCard                       
                  style="max-width: 45%; flex-grow: 1"
                  v-for="(pack, index) in Object.keys(groupedAssetPacks)"                  
                  :packs="groupedAssetPacks[pack]"
                  :livestream-id="props.livestream.id"
                  @feature-pack="onAddPacks"
                />
            </div>            
            <nav class="w-full mt-3" v-if="totalPages > 0">
                <ul class="pagination pagination-spaced justify-content-center gap-2 flex-wrap">
                    <li class="page-item">
                        <button class="page-link rounded-circle" @click="movePageArrow(currentPage - 1)">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                    </li>
                    <li v-for="page of totalPages" :key="page" class="page-item" :class="{ 'active': (page === currentPage) }">
                      <button class="page-link rounded-circle" @click="setPage(page)">{{ page }}</button>
                    </li>

                    <li class="page-item">
                        <button class="page-link rounded-circle" @click="movePageArrow(currentPage + 1)">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
    </div>
    <div v-else>
      <div class="mt-2 mb-4 d-flex gap-3" v-if="mode === 'host'">
              <button class="btn btn-primary btn-sm w-full" @click="eventBus.emit('onEditPhysicalAsset',
                { saleWithPhysicalAsset: {
                  sale: { floorPrice: 0 },
                  physicalAsset: {}
                } })">+ Add Product</button>
              <!-- <button class="btn btn-primary btn-sm" @click="toggleModal('addPhysicalAssetModal', 'show')">+ Attach Existing Product</button> -->
      </div>
      <div class="mt-2 mb-4 d-flex gap-3">
        <button class="btn btn-primary btn-sm w-full" @click="getPhysicalAssets"><i class="bi bi-arrow-clockwise"></i> Reload Products</button>
        <!-- <button class="btn btn-primary btn-sm" @click="toggleModal('addPhysicalAssetModal', 'show')">+ Attach Existing Product</button> -->
      </div>
      <div class="d-flex gap-3 flex-wrap">
        <PhysicalLiveSaleCard
          style="max-width: 45%; flex-grow: 1"
          v-for="sale in physicalAssets" :key="sale.sale.id"
          :sale-with-physical-asset="sale"
          :mode="mode"
        />
        <nav class="w-full mt-3">
            <ul class="pagination pagination-spaced justify-content-center gap-2 flex-wrap">
                <li class="page-item">
                    <button class="page-link rounded-circle" @click="movePageArrow(currentPage - 1)">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                </li>
                <li v-for="page of totalPages" :key="page" class="page-item" :class="{ 'active': (page === currentPage) }">
                  <button class="page-link rounded-circle" @click="setPage(page)">{{ page }}</button>
                </li>
  
                <li class="page-item">
                    <button class="page-link rounded-circle" @click="movePageArrow(currentPage + 1)">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
      </div>    
    </div>
  </div>
</div>

<StripeCardModal @card-saved="onCardSaved"/>

<div class="modal fade" id="auctionEndNotifyModal" tabindex="-1" aria-labelledby="auctionEndNotifyModal" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <h3 class="text-center mb-5">Auction has timed out</h3>
                <button class="btn btn-warning w-full rounded-pill" @click="endAuction">End Auction</button>
            </div>
            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<EditSalePriceModal/>

<PhysicalLiveSaleModal
  :livestream-id="livestreamId"
  @on-asset-saved="getPhysicalAssets()"
/>

<div class="modal fade" id="airdropGiveAwayModal" tabindex="-1" aria-labelledby="airdropGiveAwayModal" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLongTitle">Giveaway</h3>
            </div>

            <div class="modal-body">
                <div>
                    <div class="mb-5">
                        <label class="form-label" for="name">User</label>
                        <!-- <select v-model="airdropGiveAwayUserId" type="text" class="form-control form-control-muted">
                            <option v-for="user in usersWhoJoinedLiveStream" :key="user.id" :value="user.id">{{ user.name }}</option>
                        </select> -->
                        <VueMultiselect
                          :options="usersWhoJoinedLiveStream"
                          label="name"
                          track-by="id"
                          v-model="airdropUser"
                          @select="(user: any) => airdropGiveAwayUserId = user.id"
                          placeholder="Select user">
                        </VueMultiselect>
                        <div v-if="airdropUser.name" class="mt-2">Selected: {{ airdropUser.name }}</div>
                    </div>
                </div>
            </div>

            <div class="modal-footer d-block">
                <button type="button" class="btn btn-sm btn-primary float-end" @click="giveaway">Giveaway</button>
                <button type="button" class="btn btn-sm btn-secondary float-end" data-bs-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>
<UserAddressModal/>
<JunkieCreditsModal/>
<CostreamInviteModal :livestream-id="livestreamId" :invite-id="inviteId"/>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { RestApi } from "@/services/RestApi";
import { Stripe, StripeCardElement } from "@stripe/stripe-js";
import { onMounted } from "@vue/runtime-core";
import { Blockchain, BuyOrder, OrderType, Sale, SaleType, SaleWithAssets, Livestream, RedemptionStatus, SaleAssetType, SaleWithPhysicalAsset, FileRequestType, LivestreamType, AssetPack, WalletAsset, SaleStatus, TransferStatus } from "@/services/api/models";
import useEmitter from '@/helpers/useEmitter';
import { useRoute } from "vue-router";
import NFTLiveSaleCard from "../NFT/NFTLiveSaleCard.vue";
import NFTAsset from "@/models/NFTAsset";
import BlockchainService from "@/services/BlockchainService";
import RealtimeService from "@/services/RealtimeService";
import { v4 as uuidv4 } from "uuid";
import { onUnmounted } from "vue";
import eventBus from "@/events/EventBus";
import SaleService from "@/services/domain/SaleService";
import { DateTime } from 'luxon';
import ToastHelper from "@/helpers/ToastHelper";
import { showTab, toggleModal } from "@/hooks/BootstrapHooks";
import NumberHelper from "@/helpers/NumberHelper";
import UserService from "@/services/domain/UserService";
import ErrorLogger from "@/helpers/ErrorLogger";
import LoadingHelper from "@/helpers/LoadingHelper";
import StripeCardModal from '@/components/payment/StripeCardModal.vue';
import EditSalePriceModal from '@/components/sale/EditSalePriceModal.vue'
import VueMultiselect from 'vue-multiselect';
import StringHelper from "@/helpers/StringHelper";
import PhysicalLiveSaleCard from "../physical/PhysicalLiveSaleCard.vue";
import PhysicalLiveSaleModal from "../physical/PhysicalLiveSaleModal.vue";
import ImageHelper from "@/helpers/ImageHelper";
import UserAddressModal from "../modals/UserAddressModal.vue";
import JunkieCreditsModal from "../modals/JunkieCreditsModal.vue";
import ChatSideBar from '../../components/livestream/ChatSideBar.vue'
import CommonHelper from '@/helpers/CommonHelper';
import CostreamInviteModal from "../modals/CostreamInviteModal.vue";
import { useStore } from "@/store/main.store";
import { storeToRefs } from "pinia";
import NFTManageFeatureCard from "../NFT/NFTManageFeatureCard.vue";
import NFTRebreakManageFeatureCard from "../NFT/Rebreaks/NFTRebreakManageFeatureCard.vue";

const store = useStore()

const { currentUser } = storeToRefs(store);

const props = defineProps<{
    livestream: Livestream
}>();

enum StoreType {
  BuyNow,
  Auction,
  Giveaway,
  Sold,
  NFTs,
  Packs,
  Inventory
}

interface SaleWithNFTAsset {
    sale: Sale,
    asset: NFTAsset
}

interface WinningBuyer {
  buyOrder: BuyOrder,
  name: string
}

const mode = ref('buyer' as 'host' | 'buyer')
const saleNftAsset = ref({} as SaleWithNFTAsset);
const auctionPysicalAssset = ref({} as SaleWithPhysicalAsset);
const currentAssetPack = ref({} as AssetPack)
const isCurrentNFTRedeemable = ref(false);
const isCurrentAssetPhysical = ref(false)
const isCurrentLivestreamDigital = ref(true);

const junkieCreditsBalance = ref(0);

const allSales = ref([] as SaleWithAssets[]);
const sales = ref([] as SaleWithAssets[]);
const salesToDisplay = ref([] as SaleWithAssets[]);

const sellerNFTAssets = ref([] as NFTAsset[])
const sellerNFTAssetsToDisplay = ref([] as NFTAsset[])

const assetPacks = ref([] as AssetPack[])
const groupedAssetPacks = ref([] as any[])

const auctionRemainingMilliseconds = ref(0)
const winningBuyer = ref({} as WinningBuyer)

const route = useRoute();
const livestreamId = route.params.id as string;
const promoValue = route.query.promo as string;

const emitter = useEmitter()
const listener =  ref({} as any);

let stripe = {} as Stripe;
let cardElement = {} as StripeCardElement;
const customBidAmount = ref(0);
let isPaymetMethodAvailable = ref(false);

let listenerId = uuidv4()

const selectedStoreType = ref(StoreType.BuyNow)

const currentPage = ref(1);
const nftsPerPage = 12;
let totalPages = ref(0);

let usersWhoJoinedLiveStream = ref([] as any[]);
let airdropGiveAwayUserId = ref('');
let airdropUser = ref({} as any);

function movePageArrow(page: number) {
  if (page <= 0) return;
  if (page > totalPages.value) return;

  setPage(page);
}

emitter.on('SalePriceUpdated', async (value: { saleId: string, newPrice: number}) => {
  await selectStoreType(selectedStoreType.value)
});

function isBuyerStoreType() {
  return selectedStoreType.value === StoreType.BuyNow 
    || selectedStoreType.value === StoreType.Auction 
    || selectedStoreType.value === StoreType.Giveaway 
    || selectedStoreType.value === StoreType.Sold;
}

function setPage(page: number) {
  let totalValueLength = 0;

  if (isBuyerStoreType()) {
    totalValueLength = sales.value.length;
  }

  else if (selectedStoreType.value === StoreType.NFTs) {
    totalValueLength = sellerNFTAssets.value.length;
  }

  currentPage.value = page;

  totalPages.value = Math.floor(totalValueLength / nftsPerPage);

  if (totalValueLength % nftsPerPage > 0) {
    totalPages.value = totalPages.value + 1;
  }

  const startIndex = (page - 1) * nftsPerPage;
  const endIndex = startIndex + (nftsPerPage);

  
  if (isBuyerStoreType()) {    
    salesToDisplay.value = sales.value.slice(startIndex, endIndex);
  }

  else if (selectedStoreType.value === StoreType.NFTs) {
    sellerNFTAssetsToDisplay.value = sellerNFTAssets.value.slice(startIndex, endIndex);
  }
}

async function selectStoreType(storeType: StoreType) {
  selectedStoreType.value = storeType;

  if (storeType === StoreType.BuyNow || storeType === StoreType.Auction || storeType === StoreType.Giveaway || storeType === StoreType.Sold) {
    await loadSales();
  }

  else if (storeType === StoreType.NFTs) {
    await getUserAssets();    
  }

  else if (storeType === StoreType.Packs) {
    await getUserPacks();
  }
}

async function onAddAsset() {
  await loadSales();
  await getUserAssets();
}

async function onAddPacks() {
  await loadSales();
  await getUserPacks();
}

async function getUserPacks() {
  try {
    let sellerPacks = (await RestApi.Asset.getAssetPacksByUserId(currentUser.value.id)).data;
    
    const existingPackIds = allSales.value.filter(s => s.sale?.assetPackId !== null).map(s => s.sale?.assetPackId);

    sellerPacks = sellerPacks.filter(p => !existingPackIds.includes(p.id));

    // @ts-ignore
    groupedAssetPacks.value = Object.groupBy(sellerPacks, (pack) => pack.groupId)        
  } catch (err) {
    ToastHelper.error('There was an retrieving your NFTs. Please try again later.')
    await ErrorLogger.logApiError(err)    
  }

  totalPages.value = 0;
}

async function getUserAssets () {
    const loader = LoadingHelper.showLoader();

    try {
        let walletAssets = (await RestApi.Asset.getByUserId(currentUser.value.id)).data ?? [];

        let nfts: NFTAsset[] = [];

        walletAssets = walletAssets.filter(w => w.transferStatus === TransferStatus.TransferAvailable 
          && allSales.value.filter(s => s.saleAssets[0]?.contractAddress === w.contractAddress).length === 0);
          
        for (let i = 0; i < walletAssets.length; ++i) {
          const w = walletAssets[i]
          const nft = await BlockchainService.getBlockchainAsset(w.blockchain, w.contractAddress, w.tokenId)     
          nft.walletAssetId = w.id;     
          nfts.push(nft)
        }                                                   

        sellerNFTAssets.value = nfts;

        setPage(1)
    } catch (err) {
        ToastHelper.error('There was an retrieving your NFTs. Please try again later.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}


let giveAwayValues : { sale: Sale, nftAsset: NFTAsset };

emitter.on('onOpenGiveAwayModal', async (value : { sale: Sale, nftAsset: NFTAsset}) => {
  giveAwayValues = value;
  await openAirDropGiveAwayModal(value.sale);
});


const message = ref('')

function sendChatMessage() {
  emitter.emit('ChatSent', { message: message.value })
  message.value = '';
}


const showPackVideo = ref(false)
const currentOpenPack = ref({} as AssetPack)
const currentPackCards = ref([] as WalletAsset[])
const currentIndex = ref(0)
const currentPackCard = ref({} as NFTAsset)

emitter.on('onOpenPack', async (value: AssetPack) => {
  // currentOpenPack.value = value;
  // // toggleModal('reBreakModal', 'show')
  // document.getElementById('reBreakVid').play()
  try {
    currentIndex.value = -1;
    await RestApi.Asset.openPack(value.id, livestreamId);
    ToastHelper.success('Pack is opened')
  } catch (err) {
    ToastHelper.error('There was an error opening the pack')
    await ErrorLogger.logApiError(err)
  }
})

async function revealNextCard(index: number) {
  try {
    await RestApi.Asset.revealNextCard(currentOpenPack.value.id, index, livestreamId);
  } catch (err) {
    ToastHelper.error('There was an error revelaing the next card')
    await ErrorLogger.logApiError(err)
  }
}

async function onOpenPack(assetPackId: string) {
  try {
    currentOpenPack.value = (await RestApi.Asset.getAssetPackById(assetPackId)).data;
    currentPackCards.value = (await RestApi.Asset.getPackCards(assetPackId)).data;
    emitter.emit('PackOpened', { packId: assetPackId })
  } catch (err) {
    await ErrorLogger.logApiError(err)
  }
}

async function onRevealCard(assetPackId: string, cardIndex: number) {
  try {
    if (currentOpenPack.value.id !== assetPackId) {
      await onOpenPack(assetPackId);
    }

    if (cardIndex < -1 || cardIndex >= currentPackCards.value.length) {
      currentOpenPack.value = {};
      currentPackCard.value = {} as NFTAsset;
      currentIndex.value = 0;
      return;
    }    

    if (cardIndex === -1) {
      showTab('nav-auction-tab')
      showPackVideo.value = true;
      document.getElementById('reBreakVid').play()
      return;
    } else {
      showPackVideo.value = false;
    }

    const currentCard = currentPackCards.value[cardIndex];

    currentPackCard.value = await BlockchainService.getBlockchainAsset(currentCard.blockchain, currentCard.contractAddress, currentCard.tokenId);

    currentIndex.value = cardIndex;
  } catch (err) {
    await ErrorLogger.logApiError(err)
  }
}

async function openAirDropGiveAwayModal(sale: Sale) {

    // var loader = LoadingHelper.showLoader();

    airdropGiveAwayUserId.value = '';
    airdropUser.value = {};

    if (mode.value !== 'host') {
      return;
    }

    try {
        const groupUsers = await RealtimeService.getAllGroupMembers() ?? [];

        usersWhoJoinedLiveStream.value = groupUsers.filter(u => u.id !== currentUser.value.id).map(u => {

          return {
            id: u.id,
            name: u.name
          }
        });        

        toggleModal('airdropGiveAwayModal', 'show');
    } catch (err) {
      console.log(err)
        ToastHelper.error('There was an error retrieving users')
    }

    // LoadingHelper.hideLoader(loader);
}

async function giveaway() {

    if (StringHelper.isNullOrEmpty(airdropGiveAwayUserId.value)) {
        ToastHelper.error('You must select user for the giveaway');
        return;
    }

    // const loader = LoadingHelper.showLoader();

    try {

        await RestApi.Sales.endGiveaway(giveAwayValues.sale.id, airdropGiveAwayUserId.value);
        
        eventBus.emit('onAuctionEnded', { sale: giveAwayValues.sale });

        ToastHelper.success('Giveaway successfully AirDropped!');
        toggleModal('airdropGiveAwayModal', 'hide');

        emitter.emit('GiveawayWon', { userName: airdropUser.value.name })

    } catch(err) {
        console.log(err);
    }

    // LoadingHelper.hideLoader(loader);
}

async function onCardSaved() {
  await checkAvailablePaymentMethods();
  ToastHelper.success('Card was successfully added. Now you can start bidding!')
}

async function checkAvailablePaymentMethods() {
    // const loader = LoadingHelper.showLoader();

    isPaymetMethodAvailable.value = false;

    try {
      const customerCards = await RestApi.Payment.listCustomerCards(currentUser?.value.id);

      if (customerCards.data?.length > 0) {
          isPaymetMethodAvailable.value = true;
      }
    } catch (err) {
      ToastHelper.error('There was an error retrieving payments. Please try again')
      await ErrorLogger.logApiError(err)
    }

    // LoadingHelper.hideLoader(loader);
}

eventBus.on('onJunkieBalanceUpdated', async () => {
  await getCreditBalance();
})

async function getCreditBalance() {
  // const loader = LoadingHelper.showLoader();

  try {
    junkieCreditsBalance.value = NumberHelper.normalizeCurrencyFromAPI((await RestApi.PaymentCredit.getCreditBalanceForCurrentUser()).data);
  } catch (err) {
      ToastHelper.error('There was an error retrieving your credit balance')
  }

  // LoadingHelper.hideLoader(loader);
}

function openPurchaseCreditsModal() {
    toggleModal('purchaseCreditsModal', 'show')
}

async function placeBid(directBidAmount: number = 0) {
    
    if (directBidAmount <= 0) {
      ToastHelper.warning('The bid amount is not valid')
      return;
    }

    if (isCurrentLivestreamDigital.value) {
      await getCreditBalance();
    }

    if (!isCurrentLivestreamDigital.value && !isPaymetMethodAvailable.value) {
      ToastHelper.warning('Please enter a valid card to bid')
      toggleModal('addNewCardModal', 'show')
      return
    }

    else if (!isCurrentLivestreamDigital.value && !CommonHelper.hasValidShippingAddress(currentUser.value.userAttributes?.buyerAddress)) {
      ToastHelper.warning('Please enter your shipping address before bidding')
      toggleModal('userAddressModal', 'show')
      return
    }

    else if (isCurrentLivestreamDigital.value
      && (junkieCreditsBalance.value <= 0 || junkieCreditsBalance.value < directBidAmount)) {
      ToastHelper.warning("You don't have enough JUNKIE credits to bid. Please purchase more to bid.")
      toggleModal('purchaseCreditsModal', 'show')
      return;
    }

    // const loader = LoadingHelper.showLoader();

    try {

        const saleId = (isCurrentAssetPhysical.value) ? auctionPysicalAssset.value.sale.id : saleNftAsset.value.sale.id;

        const bid: BuyOrder = {
          amount: NumberHelper.normalizeCurrencyToSave(directBidAmount),
          userId: currentUser.value.id,
          orderType: OrderType.Bid,
          saleType: SaleType.LiveAuction,
          saleId: saleId,
          saleParentId: livestreamId
        };

        await SaleService.placeBuyOrder(bid);

        emitter.emit('BidPublished');

        ToastHelper.success('Bid successfully placed')
        customBidAmount.value = 0;
        await getWinningBuyOrder(bid.saleId);
        
        if (isCurrentLivestreamDigital) {
          await getCreditBalance()
        }
    } catch(err) {
        const error = await ErrorLogger.logApiError(err)
        ToastHelper.error(error[0]);
    }

    // LoadingHelper.hideLoader(loader)
}

function countDownEnded() {
  if (mode.value === 'host') {
    toggleModal('auctionEndNotifyModal', 'show');
  }
}

function updateAuctionTime(auctionEndTime: string) {
  const endTime = DateTime.fromISO(auctionEndTime)
  auctionRemainingMilliseconds.value = endTime.diff(DateTime.now().toUTC()).milliseconds;
}

function setDigitalsByStoreType() {
  const unsoldSales = allSales.value.filter(s => s.sale?.saleStatus === SaleStatus.Unsold || s.sale?.saleStatus === SaleStatus.Available);

  if (selectedStoreType.value === StoreType.BuyNow) {
    sales.value = unsoldSales.filter(s => s.sale?.saleType === SaleType.DirectSale || s.sale?.saleType === SaleType.LiveSale);
  }

  else if (selectedStoreType.value === StoreType.Auction) {
    sales.value = unsoldSales.filter(s => s.sale?.saleType === SaleType.LiveAuction);
  }

  if (selectedStoreType.value === StoreType.Giveaway) {
    sales.value = unsoldSales.filter(s => s.sale?.saleType === SaleType.LiveGiveaway);
  }

  if (selectedStoreType.value === StoreType.Sold) {
    sales.value = allSales.value.filter(s => s.sale?.saleStatus === SaleStatus.Sold || s.sale?.saleStatus === SaleStatus.Delivered);
  }
}

async function loadSales() {
  const utcNow = DateTime.now().toUTC();

  if (isCurrentLivestreamDigital.value) {
    allSales.value = await SaleService.getByParentId(livestreamId);

    const liveSale = allSales.value.filter(s => {
      const sale = s.sale as Sale;

      const endTime = DateTime.fromISO(sale.endTime)

      return utcNow < endTime;
    })

    if (liveSale[0]) {
      const saleId = liveSale[0].sale.id;
      await setSaleNftAsset(saleId)
    }

    setDigitalsByStoreType()
    setPage(1);
  } else {
    const physicalSales = (await RestApi.Sales.getPhysicalSalesByLivestreamId(livestreamId)).data;
    
    const livePhysicalSale = physicalSales.filter(s => {
      const sale = s.sale as Sale;
  
      const endTime = DateTime.fromISO(sale.endTime)
  
      return utcNow < endTime;
    })
  
    if (livePhysicalSale[0]) {
      const saleId = livePhysicalSale[0].sale.id;
      await setAuctionPhysicalAsset(saleId)
      setPage(1);
      return
    }
  }
}

async function getWinningBuyOrder(saleId: string) {
  const buyOrder = await SaleService.getWinningBuyOrder(saleId)

  if (buyOrder) {
    const user = await UserService.getUserById(buyOrder.userId);

    winningBuyer.value = {
      buyOrder,
      name: user?.name
    }
  }
  else {
    winningBuyer.value = {
    } as any
  }

}

const isCurrentAssetPack = ref(false)
const isCurrentGiveaway = ref(false);
const giveawayEntryCount = ref(0)
const hasCurrentUserEnteredGiveaway = ref(false)

async function fetchGiveawayCount(saleId: string) {
  try {
    giveawayEntryCount.value = (await RestApi.Sales.getGiveawayEntryCount(saleId)).data;
  } catch (err) {
    await ErrorLogger.logApiError(err)
  }
}

async function fetchIsGiveawayEntered(saleId: string) {
  try {
    hasCurrentUserEnteredGiveaway.value = (await RestApi.Sales.isGiveawayEntered(saleId)).data;
  } catch (err) {
    await ErrorLogger.logApiError(err)
  }
}

async function updateGiveaway(saleId: string) {
  await fetchIsGiveawayEntered(saleId);
  await fetchGiveawayCount(saleId);
}

async function setSaleNftAsset(saleId: string) {
  isCurrentAssetPhysical.value = false;  
  const saleWithAssets: SaleWithAssets = await SaleService.getById(saleId);

  isCurrentAssetPack.value = saleWithAssets.sale?.saleAssetType === SaleAssetType.AssetPack;

  if (!isCurrentAssetPack.value) {
    const saleAsset = saleWithAssets.saleAssets[0];
    const nftAsset = await BlockchainService.getInstance(saleAsset.blockchain)
                                            .getAssetById(saleAsset.contractAddress, saleAsset.tokenId);
  
    saleNftAsset.value = { sale: saleWithAssets.sale, asset: nftAsset }
  
    isCurrentNFTRedeemable.value = saleAsset.redemptionStatus === RedemptionStatus.Redeemable;

    if (saleWithAssets.sale?.saleType === SaleType.LiveGiveaway) {
      isCurrentGiveaway.value = true
      await updateGiveaway(saleId)
    } else {
      isCurrentGiveaway.value = false
    }
  } 
  else {
    saleNftAsset.value = { sale: saleWithAssets.sale, asset: {} as NFTAsset }
    currentAssetPack.value = (await RestApi.Asset.getAssetPackById(saleWithAssets.sale.assetPackId)).data;
    
    if (saleWithAssets.sale?.saleType === SaleType.LiveGiveaway) {
      isCurrentGiveaway.value = true
      await updateGiveaway(saleId)
    } else {
      isCurrentGiveaway.value = false
    }    
  }
  
  updateAuctionTime(saleWithAssets.sale?.endTime);
  await getWinningBuyOrder(saleId)  
}

async function setAuctionPhysicalAsset(saleId: string) {
  isCurrentAssetPhysical.value = true;
  isCurrentNFTRedeemable.value = false;

  const saleWithPhysicalAsset: SaleWithPhysicalAsset = await SaleService.getPhysicalById(saleId);

  auctionPysicalAssset.value = saleWithPhysicalAsset;

  updateAuctionTime(saleWithPhysicalAsset.sale.endTime);
  await getWinningBuyOrder(saleId)

  if (saleWithPhysicalAsset.sale?.saleType === SaleType.LiveGiveaway) {
    isCurrentGiveaway.value = true
    await updateGiveaway(saleId)
  } else {
    isCurrentGiveaway.value = false;
  }
}

async function onAuctionStart(saleMetadata: any, isGiveaway = false) {
  customBidAmount.value = 0;
  const saleId = saleMetadata.saleId;

  currentOpenPack.value = {};

  if (isCurrentLivestreamDigital.value) {
    await setSaleNftAsset(saleId);
  }
  else {
    await setAuctionPhysicalAsset(saleId)
  }

  if (!isGiveaway) {    
    ToastHelper.success('Auction has started!');
  }
}

emitter.on('SalePurchased', async () => {
  await getCreditBalance();
})

async function onAuctionEnd(isGiveaway = false) {
  customBidAmount.value = 0;

  if (isCurrentAssetPhysical.value) {
    await setAuctionPhysicalAsset(auctionPysicalAssset.value.sale.id)
  }
  else {
    await setSaleNftAsset(saleNftAsset.value.sale.id);
  }

  if (winningBuyer.value.name) {
    const assetName = (isCurrentAssetPhysical.value) ? auctionPysicalAssset.value.physicalAsset.name
      : saleNftAsset.value.asset.name + ' #' + saleNftAsset.value.asset.mintNumber;

      if (winningBuyer.value.buyOrder?.userId === currentUser.value.id) {
        await getCreditBalance();
      }

      if (mode.value === 'host') {
        const productName = (isCurrentAssetPack.value) ? 
          currentAssetPack.value.name + ' #' + currentAssetPack.value.number : assetName;

        emitter.emit('AuctionWon', { userName: winningBuyer.value.name, productName: productName })
      }      

      if (isCurrentAssetPack.value) {
        ToastHelper.success(winningBuyer.value.name + ' has won ' + currentAssetPack.value.name + ' #' + currentAssetPack.value.number);
      } else {
        ToastHelper.success(winningBuyer.value.name + ' has won ' + assetName);
      }      
  }

  if (isCurrentAssetPhysical.value) {
    eventBus.emit('onAuctionEnded', { sale: auctionPysicalAssset.value.sale });
  } else {
    eventBus.emit('onAuctionEnded', { sale: saleNftAsset.value.sale });
  }

  saleNftAsset.value = { } as any
  auctionPysicalAssset.value = {};
}

async function onNFTGivenAway(saleId: string) {
  emitter.emit('NftIsGivenAway', { saleId: saleId });
}

async function onBidRecieved() {
  if (isCurrentAssetPhysical.value) {
    await setAuctionPhysicalAsset(auctionPysicalAssset.value.sale.id)
  }
  else {
    await setSaleNftAsset(saleNftAsset.value.sale.id);
  }
}

async function enterGiveaway() {  

  try {
    if (isCurrentAssetPhysical.value) {
      await RestApi.Sales.enterGiveaway(auctionPysicalAssset.value.sale.id)
    } else {
      await RestApi.Sales.enterGiveaway(saleNftAsset.value.sale.id);
    }
  } catch (err) {
    await ErrorLogger.logApiError(err)
  }
}

const inviteId = ref('')

function registerListener () {
   listener.value = RealtimeService.channel.on('message.new', async (event) => {      
        
        if (event?.message?.kind === 'Auction') {
            if (event?.message?.status === 'Started') {
              await onAuctionStart(event.message);
            } else if (event?.message?.status === 'Ended') {
              await onAuctionEnd();
            } else if (event?.message?.status === 'Canceled') {
              await onAuctionEnd();
            } else if (event?.message?.status === 'GivenAway') {
              await onNFTGivenAway(event?.message?.saleId as string);
            }

          } else if (event?.message?.kind === 'Bid') {
            await onBidRecieved();
          }
          else if (event?.message?.kind === 'Pack') {
            await onRevealCard(event?.message?.assetPackId as string, Number.parseInt(event?.message?.cardIndex as string))
          }
          else if (event?.message?.kind === 'LiveSale') {
            emitter.emit('LiveSaleEnded', { saleId: event?.message?.saleId })
          }

          if (event.message.kind === 'raid') {
            const toLivestreamId = event.message.livestreamId as string;

            if (StringHelper.isNullOrEmpty(toLivestreamId)) {
                return;
            }

            const baseUrl = import.meta.env.VITE_URL;

            window.location.href = `${baseUrl}/livestream/${toLivestreamId}/attend`;
        }
        if (event.message.kind === 'costream') {
            if (event.message.costreamUserId !== currentUser.value?.id) {
                return;
            }

            inviteId.value = event.message.inviteId as string;

            toggleModal('costreamInviteModal', 'show')
        }
        
        if (event.message.kind === 'giveaway') {        
            if (event?.message?.status === 'started') {
              await onAuctionStart(event.message, true);
            } else if (event?.message?.status === 'ended') {
              await onAuctionEnd(true);
            } else if (event?.message?.status === 'entered') {
              await updateGiveaway(event?.message?.saleId as string);
            }
        }
    });
}

async function endAuction() {
  // const loader = LoadingHelper.showLoader();

  if (mode.value === 'buyer') {
    return;
  }

  try {    
    if (isCurrentAssetPhysical.value) {
      if (auctionPysicalAssset.value.sale.saleType === SaleType.LiveAuction) {
        await SaleService.endAuction(auctionPysicalAssset.value.sale.id, auctionPysicalAssset.value.physicalAsset.name);
      } else {
        await RestApi.Sales.endGiveaway(auctionPysicalAssset.value.sale.id, '');
      }
    }
    else {
      if (saleNftAsset.value.sale.saleType === SaleType.LiveAuction) {
        await SaleService.endAuction(saleNftAsset.value.sale.id, saleNftAsset.value.asset.name);
      } else {
        await RestApi.Sales.endGiveaway(saleNftAsset.value.sale.id, '');
      }
    }
  } catch (err) {
    if (currentUser.value && !StringHelper.isNullOrEmpty(currentUser.value.id)) {      
      ToastHelper.error('There was an error ending the auction')
    }
  }

  toggleModal('auctionEndNotifyModal', 'hide');
  // LoadingHelper.hideLoader(loader);
}

async function unRegisterListener () {
  //await RealtimeService.removeHandler(listenerId);
  listener.value.unsubscribe();
}

eventBus.on('onRealtimeServiceConnected', async () => {

  if (route.params.id !== props.livestream.id) return;

  isCurrentLivestreamDigital.value = props.livestream.livestreamType === LivestreamType.Digital;  

  registerListener();
  if (currentUser.value) { 
    await checkAvailablePaymentMethods();
    await getCreditBalance()
  }
  
  await getPhysicalAssets();
  await loadSales();
})

function openSignInModal() {
    toggleModal('authModal', 'show')

    let promoImage = '';
    let promoDescription = '';

    if (promoValue?.toLowerCase() === 'cover') {
      promoImage = props.livestream.imageUrl;
      promoDescription = 'Sign up on JUNKIE to join ' + props.livestream.name;
    }
    else if (promoValue?.toLowerCase() === 'show') {
      promoImage = props.livestream.promoImageUrl;

      if (props.livestream.promoDescription)  {
        promoDescription = 'Sign up on JUNKIE and join this stream to ' + props.livestream.promoDescription;
      }
    }

    eventBus.emit('onSignInModalOpen', {
      livestreamId: livestreamId,
      livestreamTitle: props.livestream.name,
      livestreamDate: props.livestream.startTime,
      promoImage,
      promoDescription
    });
}

const physicalAssets = ref([] as SaleWithPhysicalAsset[])

async function getPhysicalAssets() {
  const loader = LoadingHelper.showLoader();

  physicalAssets.value = (await RestApi.Sales.getPhysicalSalesByLivestreamId(livestreamId)).data;

  LoadingHelper.hideLoader(loader)
}


onMounted(async () => {
  if (route.name === 'PresentLivestream') {
    mode.value = 'host'
  }
  if (route.name === 'AttendLivestream' && !currentUser.value) {
      openSignInModal()
    }
});

onUnmounted(async () => {
  await unRegisterListener();
});


</script>

<style scoped>
.nav-link {
  color: #fff;
}
.nav-link.active {
  background-color: var(--accent-color);
  color: #000;
}

.stream-tab {
  /* height: 50vh !important; */
}

@media only screen and (max-width: 1199px) {
    .stream-tab {
        /* min-height: 400px; */
        /* height: 47vh !important; */
        /* margin-bottom: 100px; */
    }
}
</style>