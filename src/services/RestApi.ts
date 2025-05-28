import { UploadType } from "@/enums/CommonEnums";
import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import { LivestreamApi, UserApi, PaymentApi, SalesApi, UploadApi, AssetApi, WalletApi, BlockchainApi, RoomApi, MarketplaceApi, PaymentCreditApi, SocialApi, SellerApi, NotificationApi } from "./api/api";
import { SaleAssetApi } from "./api/apis/sale-asset-api";
import * as models from "./api/models";
import { Address, Blockchain, BuyOrder, CreateShipmentRequestModel, FileRequestType, MarketplaceFilterRequest, OrderType, Reaction, ReactionType, Sale, SaleType, SaleWithAssets, SaleWithPhysicalAsset, SocialPost, SocialPostType, TransferWallet } from "./api/models";
import { InitializePaymentRequest } from "./api/models/initialize-payment-request";

export class RestApi {

  static ApiPath = import.meta.env.VITE_API_PATH as string;
  static fetchOptions: AxiosRequestConfig<any> = {
    withCredentials: true
  };

  static UserApi = new UserApi(undefined, RestApi.ApiPath);
  static LivestreamApi = new LivestreamApi(undefined, RestApi.ApiPath);
  static PaymentApi = new PaymentApi(undefined, RestApi.ApiPath);
  static SalesApi = new SalesApi(undefined, RestApi.ApiPath);
  static UploadApi = new UploadApi(undefined, RestApi.ApiPath);
  static AssetApi = new AssetApi(undefined, RestApi.ApiPath);
  static WalletApi = new WalletApi(undefined, RestApi.ApiPath);
  static RoomApi = new RoomApi(undefined, RestApi.ApiPath);
  static BlockchainApi = new BlockchainApi(undefined, RestApi.ApiPath);
  static MarketplaceApi = new MarketplaceApi(undefined, RestApi.ApiPath);
  static PaymentCreditApi = new PaymentCreditApi(undefined, RestApi.ApiPath);
  static SocialApi = new SocialApi(undefined, RestApi.ApiPath);
  static SellerApi = new SellerApi(undefined, RestApi.ApiPath);
  static NotificationApi = new NotificationApi(undefined, RestApi.ApiPath);

  static User = {
    signIn(email: string, password: string): Promise<AxiosResponse<models.User, any>> {
      const model = { email, password } as models.LoginRequest;

      return RestApi.UserApi.apiV1UserLoginPost(model, RestApi.fetchOptions);
    },
    signOut(): Promise<any> {
      return RestApi.UserApi.apiV1UserLogoutPost(RestApi.fetchOptions);
    },
    getCurrentUser(): Promise<AxiosResponse<models.User, any>> {
      return RestApi.UserApi.apiV1UserGetCurrentUserGet(RestApi.fetchOptions) as Promise<AxiosResponse<models.User, any>>;
    },
    getUserById(userId: string): Promise<AxiosResponse<models.User, any>> {
      return RestApi.UserApi.apiV1UserUserIdGet(userId, RestApi.fetchOptions);
    },
    getByName(name: string) {
      return RestApi.UserApi.apiV1UserNameNameGet(name, RestApi.fetchOptions);
    },
    saveUser(user: models.User): Promise<AxiosResponse<models.User, any>> {
      if (!user.id || user.id.trim().length === 0) return RestApi.UserApi.apiV1UserRegisterPost(user, RestApi.fetchOptions);

      return RestApi.UserApi.apiV1UserUpdatePut(user, RestApi.fetchOptions);
    },
    changePassword(oldPassword: string, newPassword: string): Promise<any> {
      const model = {oldPassword, newPassword} as models.UpdatePasswordRequest;

      return RestApi.UserApi.apiV1UserUpdatePasswordPut(model, RestApi.fetchOptions);
    },
    resetPassword(email: string): Promise<any> {
      return RestApi.UserApi.apiV1UserResetPasswordPut(email, RestApi.fetchOptions);
    },
    deleteUser(userId: string): Promise<AxiosResponse<boolean, any>> {
      return RestApi.UserApi.apiV1UserUserIdDelete(userId, RestApi.fetchOptions);
    },
    getAllUsers() {
      return RestApi.UserApi.apiV1UserGetAllUsersGet(RestApi.fetchOptions);
    },
    searchByName(name: string) {
      return RestApi.UserApi.apiV1UserSearchByNameNameGet(name, RestApi.fetchOptions);
    },
    searchByFollowerName(name: string) {
      return RestApi.UserApi.apiV1UserSearchFollowersNameGet(name, RestApi.fetchOptions);
    },    
    saveAddress(address: Address, isSellerAddress: boolean) {
      return RestApi.UserApi.apiV1UserUpdateAddressIsSellerAddressPut(isSellerAddress, address, RestApi.fetchOptions);
    },
    getPublicUsers() {
      return RestApi.UserApi.apiV1UserGetAllJunkieUsersGet(RestApi.fetchOptions);
    },
    upgradeToSeller(userId: string) {
      return RestApi.UserApi.apiV1UserUpgradeToSellerUserIdPost(userId, RestApi.fetchOptions)      
    }
  };

  static Livestream = {
    saveLivestream(livestream: models.Livestream, salesWithAssets: models.SaleWithAssets[]): Promise<AxiosResponse<models.Livestream, any>> {
      const saveLivestreamRequest: models.SaveLivestreamRequest = {
        livestream,
        salesWithAssets
      };

      if (!livestream.id || livestream.id.trim().length === 0) return RestApi.LivestreamApi.apiV1LivestreamPost(saveLivestreamRequest, RestApi.fetchOptions);
      return RestApi.LivestreamApi.apiV1LivestreamPut(saveLivestreamRequest, RestApi.fetchOptions);
    },
    upadateLivestream(livestream: models.Livestream) {
      return RestApi.LivestreamApi.apiV1LivestreamUpdateLivestreamPut(livestream, RestApi.fetchOptions);
    },
    getLivestream(livestreamId: string): Promise<AxiosResponse<models.Livestream, any>> {
      return RestApi.LivestreamApi.apiV1LivestreamIdGet(livestreamId, RestApi.fetchOptions);
    },
    getLivestreamByUserId(userId: string): Promise<AxiosResponse<models.Livestream[], any>> {
      return RestApi.LivestreamApi.apiV1LivestreamUserIdUserGet(userId, RestApi.fetchOptions);
    },
    getSalesByLivestreamId(livestreamId: string): Promise<AxiosResponse<models.SaleWithAssets[], any>> {
      return RestApi.LivestreamApi.apiV1LivestreamIdSalesGet(livestreamId, RestApi.fetchOptions);
    },
    deleteLivestream(livestreamId: string): Promise<AxiosResponse<boolean, any>> {
      return RestApi.LivestreamApi.apiV1LivestreamLivestreamIdDelete(livestreamId, RestApi.fetchOptions);
    },
    getAll(): Promise<AxiosResponse<models.Livestream[], any>> {
      return RestApi.LivestreamApi.apiV1LivestreamGetAllLivestreamsGet(RestApi.fetchOptions);
    },
    getAllLivestreamWithTotalSales() {
      return RestApi.LivestreamApi.apiV1LivestreamGetAllLivestreamsWithTotalSalesGet(RestApi.fetchOptions);
    },
    getUsersWithPlacedBids(liveStreamId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamLiveStreamIdGetUsersWithPlacedBidsGet(liveStreamId, RestApi.fetchOptions);
    },
    getUsersWhoWonAuctions(liveStreamId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamLiveStreamIdGetUsersWhoWonAuctionGet(liveStreamId, RestApi.fetchOptions);
    },
    assign(livestreamId: string, userId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamLivestreamIdUserIdAssignPut(livestreamId, userId, RestApi.fetchOptions);
    },
    banUser(userId: string, livestreamId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamUserIdLivestreamIdBanGet(userId, livestreamId, RestApi.fetchOptions);
    },
    unbanUser(userId: string, livestreamId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamUserIdLivestreamIdUnbanGet(userId, livestreamId, RestApi.fetchOptions);
    },
    getBannedUsers(livestreamId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamLivestreamIdBannedusersGet(livestreamId, RestApi.fetchOptions);
    },
    getUserChatToken() {
      return RestApi.LivestreamApi.apiV1LivestreamGetChatUserTokenGet(RestApi.fetchOptions);
    },
    addUserToRealtimeService(livestreamId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamAddUserToRealTimeServiceLivestreamIdPost(livestreamId, RestApi.fetchOptions)
    },
    raid(livestreamId: string, toLivestreamId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamRaidFromLivestreamIdToLivestreamIdPost(livestreamId, toLivestreamId, RestApi.fetchOptions)
    },
    costream(livestreamId: string, toUserId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamCostreamLivestreamIdToUserIdPost(livestreamId, toUserId, RestApi.fetchOptions)
    },
    isValidCostreamInvite(livestreamId: string, inviteId: string) {
      return RestApi.LivestreamApi.apiV1LivestreamIsValidCostreamInviteLivestreamIdInviteIdPost(livestreamId, inviteId, RestApi.fetchOptions)
    },
    getCurrentLivestreams(filterRequest: models.FilterRequest) {
      return RestApi.LivestreamApi.apiV1LivestreamGetCurrentLivestreamsPost(filterRequest, RestApi.fetchOptions);
    }
  };

  static Upload = {
    async uploadImage(fileName: string, image: Blob, type: FileRequestType) {
      await this.upload(fileName, image, type);
    },
    async upload(fileName: string, file: Blob, type: FileRequestType) {
      const data = new FormData();
      data.append('file', file);
      data.append('fileName', fileName);
      data.append('fileRequestType', type);
      data.append('fileEncodingType', 'byteArray');

      const options: RequestInit = {
        body: data,
        method: "POST",
        headers: undefined,
        credentials: "include",
      };

      await fetch(RestApi.ApiPath + '/api/v1/upload/uploadmultipartfile', options);
    },
    async uploadWithProgress(fileName: string, file: Blob, type: FileRequestType, onProgress: Function) {
      const data = new FormData();
      data.append('file', file);
      data.append('fileName', fileName);
      data.append('fileRequestType', type);
      data.append('fileEncodingType', 'byteArray');
      
      const client = axios.create({
        baseURL: RestApi.ApiPath
      })

      await client.post('/api/v1/upload/uploadmultipartfile', data, { 
        withCredentials: true,
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress)          
        }
      })
    },
    async deleteFile(fileName: string, type: UploadType) {
      const deleteRequest: models.FileUploadRequest = {
        fileName,
        fileRequestType: models.FileRequestType[type]
      }

      await RestApi.UploadApi.apiV1UploadDeleteFileDelete(deleteRequest, RestApi.fetchOptions);
    }
  }

  static Asset = {
    getByUserId(userId: string): Promise<AxiosResponse<models.WalletAsset[], any>> {
      return RestApi.AssetApi.apiV1AssetUserIdUserGet(userId, RestApi.fetchOptions);
    },
    getAssetHistory(blockchain: Blockchain, contractAddress: string, tokenId: string) {
      return RestApi.AssetApi.apiV1AssetGetAssetHistoryBlockchainContractAddressTokenIdGet(blockchain, contractAddress, tokenId, RestApi.fetchOptions);
    },
    createAssetPacks(model: models.CreateAssetPackRequestModel) {
      return RestApi.AssetApi.apiV1AssetCreateAssetPacksPost(model, RestApi.fetchOptions)
    },
    getAssetPacksByUserId(userId: string) {
      return RestApi.AssetApi.apiV1AssetGetAssetPacksUserIdGet(userId, RestApi.fetchOptions)
    },
    getAssetPackById(id: string) {
      return RestApi.AssetApi.apiV1AssetGetAssetByIdIdGet(id, RestApi.fetchOptions)
    },
    getPackCards(assetPackId: string) {
      return RestApi.AssetApi.apiV1AssetGetPackCardsAssetPackIdGet(assetPackId, RestApi.fetchOptions)
    },
    openPack(assetPackId: string, liveStreamId: string) {
      return RestApi.AssetApi.apiV1AssetOpenPackAssetPackIdPost(assetPackId, liveStreamId, RestApi.fetchOptions)
    },
    revealNextCard(assetPackId: string, cardIndex: number, liveStreamId: string) {
      return RestApi.AssetApi.apiV1AssetRevealNextCardAssetPackIdCardIndexPost(assetPackId, cardIndex, liveStreamId, RestApi.fetchOptions)
    }
  }

  static Payment = {
    saveCustomerPayment(payment: models.Payment): Promise<AxiosResponse<models.PaymentProfile, any>> {
      return RestApi.PaymentApi.apiV1PaymentCreatePost(payment, RestApi.fetchOptions);
    },
    listCustomerCards(userId: string): Promise<AxiosResponse<Array<models.CustomerCard>, any>> {
      return RestApi.PaymentApi.apiV1PaymentListIdGet(userId, RestApi.fetchOptions);
    },
    initializePayment(initializePaymentRequest: InitializePaymentRequest): Promise<AxiosResponse<string, any>> {
      return RestApi.PaymentApi.apiV1PaymentInitializePost(initializePaymentRequest, RestApi.fetchOptions);
    },
    deleteCustomerCard(customerId: string, cardId: string): Promise<AxiosResponse<any, any>> {
      return RestApi.PaymentApi.apiV1PaymentCustomerCustomerIdCardCardIdDelete(customerId, cardId, RestApi.fetchOptions);
    },
    setDefautlCustomerCard(customerId: string, cardId: string): Promise<AxiosResponse<any, any>> {
      return RestApi.PaymentApi.apiV1PaymentCustomerCustomerIdDefautlcardCardIdPut(customerId, cardId, RestApi.fetchOptions);
    },
    isChargesEnabled() {
      return RestApi.PaymentApi.apiV1PaymentIsChargesEnabledGet(RestApi.fetchOptions)
    },
    createAccountLink() {
      return RestApi.PaymentApi.apiV1PaymentCreateAccountLinkPost(RestApi.fetchOptions)
    },
    requestPayout(isinstant: boolean) {
      return RestApi.PaymentApi.apiV1PaymentRequestPayoutIsInstantPost(isinstant, RestApi.fetchOptions)
    }
  }

  static Sales = {
    getById(id: string): Promise<AxiosResponse<models.SaleWithAssets, any>> {
      return RestApi.SalesApi.apiV1SalesIdGet(id, RestApi.fetchOptions);
    },
    getPhysicalById(id: string): Promise<AxiosResponse<models.SaleWithAssets, any>> {
      return RestApi.SalesApi.apiV1SalesIdPhysicalGet(id, RestApi.fetchOptions);
    },
    getByParentId(parentId: string): Promise<AxiosResponse<models.SaleWithAssets[], any>> {
      return RestApi.SalesApi.apiV1SalesParentParentIdGet(parentId, RestApi.fetchOptions);
    },
    getWinningBuyOrder(saleId: string): Promise<AxiosResponse<models.BuyOrder | null, any>> {
      return RestApi.SalesApi.apiV1SalesIdGetWinningBuyOrderGet(saleId, RestApi.fetchOptions);
    },
    startAuction(updateAuctionStartTimeRequest: models.UpdateAuctionStartTimeRequest): Promise<AxiosResponse<models.Sale, any>> {
      return RestApi.SalesApi.apiV1SalesStartAuctionPost(updateAuctionStartTimeRequest, RestApi.fetchOptions);
    },
    endAuction(updateAuctionEndTimeRequest: models.UpdateAuctionEndTimeRequest) {
      return RestApi.SalesApi.apiV1SalesEndAuctionPost(updateAuctionEndTimeRequest, RestApi.fetchOptions);
    },
    cancelAuction(updateAuctionEndTimeRequest: models.UpdateAuctionEndTimeRequest): Promise<AxiosResponse<models.Sale, any>> {
      return RestApi.SalesApi.apiV1SalesCancelAuctionPost(updateAuctionEndTimeRequest, RestApi.fetchOptions);
    },
    createBuyOrder(buyOrder: models.BuyOrder): Promise<AxiosResponse<models.BuyOrder, any>> {
      return RestApi.SalesApi.apiV1SalesCreateBuyOrderPost(buyOrder, RestApi.fetchOptions);
    },
    getUserAssets(): Promise<AxiosResponse<models.SaleWithAssets[], any>> {
      return RestApi.SalesApi.apiV1SalesGetUserAssetsGet(RestApi.fetchOptions);
    },
    listForSale(saleWithAssets: SaleWithAssets, walletAssetId: string, nftName: string) {
      return RestApi.SalesApi.apiV1SalesListforsaleWalletAssetIdPost(walletAssetId, saleWithAssets, nftName, RestApi.fetchOptions);
    },
    purchaseDirectSale (saleId: string, nftName: string) {
      return RestApi.SalesApi.apiV1SalesPurchasedirectsaleDirectSaleIdPost(saleId, nftName, RestApi.fetchOptions);
    },
    saveSale(saleWithAssets: SaleWithAssets) {
      if (!saleWithAssets.sale?.id)
        return RestApi.SalesApi.apiV1SalesCreatePost(saleWithAssets, RestApi.fetchOptions);
      else
        return RestApi.SalesApi.apiV1SalesUpdatePut(saleWithAssets, RestApi.fetchOptions);
    },
    updateSalePrice (saleId: string, price: number, saleType: SaleType) {
      return RestApi.SalesApi.apiV1SalesUpdateSalePriceSaleIdPut(saleId, { 
        price,
        saleType
      }, RestApi.fetchOptions);
    },
    bulkCreate(sales: Sale[]) {
      return RestApi.SalesApi.apiV1SalesBulkCreatePost(sales, RestApi.fetchOptions)
    },
    saveOffer(buyOrder: BuyOrder, nftName: string) {
      return RestApi.SalesApi.apiV1SalesSaveOfferPost(buyOrder, nftName, RestApi.fetchOptions);
    },
    acceptOffer(buyOrderId: string, nftName: string) {
      return RestApi.SalesApi.apiV1SalesAcceptOfferBuyOrderIdPost(buyOrderId, nftName, RestApi.fetchOptions);
    },
    cancelOffer(buyOrderId: string) {
      return RestApi.SalesApi.apiV1SalesCancelofferBuyOrderIdDelete(buyOrderId, RestApi.fetchOptions);
    },
    getCurrentUserOffer(saleId: string) {
      return RestApi.SalesApi.apiV1SalesGetUserOfferForSaleSaleIdGet(saleId, RestApi.fetchOptions);
    },
    getOffersForSale(saleId: string) {
      return RestApi.SalesApi.apiV1SalesOffersSaleIdGet(saleId, RestApi.fetchOptions);
    },
    getOffersForUser(offerType: OrderType, isSentOffers = true) {
      const req: models.UserOfferRequestModel = {
        offerType,
        isSentOffers
      };

      return RestApi.SalesApi.apiV1SalesGetOffersForUserPost(req, RestApi.fetchOptions)
    },
    cancelSale(walletAssetId: string) {
      return RestApi.SalesApi.apiV1SalesCancelsaleWalletAssetIdPost(walletAssetId, RestApi.fetchOptions);
    },
    getSalesSoldInMarketplace() {
      return RestApi.SalesApi.apiV1SalesGetSalesSoldInMarketplaceGet(RestApi.fetchOptions);
    },
    startGiveaway(saleId: string) {
      return RestApi.SalesApi.apiV1SalesStartGiveawaySaleIdPost(saleId, RestApi.fetchOptions)
    },
    endGiveaway(saleId: string, userId: string) {
      const model: models.EndGiveawayRequestModel = {
        saleId: saleId
      }

      if (userId) {
        model.userId = userId;
      }

      return RestApi.SalesApi.apiV1SalesEndGiveawayPost(model, RestApi.fetchOptions)
    },
    enterGiveaway(saleId: string) {
      return RestApi.SalesApi.apiV1SalesEnterGiveawaySaleIdPost(saleId, RestApi.fetchOptions)
    },
    isGiveawayEntered(saleId: string) {
      return RestApi.SalesApi.apiV1SalesIsGiveawayEnteredSaleIdPost(saleId, RestApi.fetchOptions)
    },
    getGiveawayEntryCount(saleId: string) {
      return RestApi.SalesApi.apiV1SalesGiveawayEntryCountSaleIdPost(saleId, RestApi.fetchOptions)
    },
    getPhysicalSalesByLivestreamId(liveStreamId: string) {
      return RestApi.SalesApi.apiV1SalesPhysicalLivestreamIdGet(liveStreamId, RestApi.fetchOptions);
    },
    savePhysicalProduct(saleWithPhysicalAsset: SaleWithPhysicalAsset) {
      return RestApi.SalesApi.apiV1SalesSavePhysicalSalePost(saleWithPhysicalAsset, RestApi.fetchOptions)
    },
    getUserOrders() {
      return RestApi.SalesApi.apiV1SalesGetUserPhysicalOrdersGet(RestApi.fetchOptions)
    },
    endLiveSale(saleId: string, livestreamId: string, quantity = 1) {
      return RestApi.SalesApi.apiV1SalesEndlivesaleSaleIdLivestreamIdPost(saleId, livestreamId, quantity, RestApi.fetchOptions)
    },
    getBuyOrderById(id: string) {
      return RestApi.SalesApi.apiV1SalesBuyorderIdGet(id, RestApi.fetchOptions)
    }
  }

  static Wallet = {
    getByUserId(userId: string) {
      return RestApi.WalletApi.apiV1WalletAssetsUserIdUserGet(userId, RestApi.fetchOptions);
    },
    getById(id: string) {
      return RestApi.WalletApi.apiV1WalletIdGet(id, RestApi.fetchOptions);
    },
    saveWalletAsset(walletAsset: models.WalletAsset) {
      if (!walletAsset.id)
        return RestApi.WalletApi.apiV1WalletAssetPost(walletAsset, RestApi.fetchOptions);
      else
        return RestApi.WalletApi.apiV1WalletAssetPut(walletAsset, RestApi.fetchOptions);
    },
    bulkCreate(walletAssets: models.WalletAsset[]) {
      return RestApi.WalletApi.apiV1WalletBulkCreatePost(walletAssets, RestApi.fetchOptions)
    },
    requestTransfer(assetId: string, transferAddress: string, blockchain: Blockchain, wallet: TransferWallet) {
      const request: models.WalletTransferRequest = {
        walletAssetId: assetId,
        transferWalletAddress: transferAddress,
        blockchain,
        wallet
      };

      return RestApi.WalletApi.apiV1WalletRequestTransferPost(request, RestApi.fetchOptions);
    },
    bulkRequestTransfer(requests: models.WalletTransferRequest[]) {
      return RestApi.WalletApi.apiV1WalletBulkRequestTransferPost(requests, RestApi.fetchOptions)
    },
    completeTransfer(assetId: string) {
      return RestApi.WalletApi.apiV1WalletCompletetransferAssetIdPost(assetId, RestApi.fetchOptions);
    },
    transferToWallet(transferAsset: models.TransferAsset): Promise<AxiosResponse<boolean, any>> {
      return RestApi.WalletApi.apiV1WalletTransferAssetToWalletPost(transferAsset, RestApi.fetchOptions);
    },
    redeemNFT(request: models.RedeemNFTRequest) {
      return RestApi.WalletApi.apiV1WalletRedeemNFTPost(request, RestApi.fetchOptions);
    },
    transferToJunkieWallet(walletAssetId: string, toUserId: string) {
      return RestApi.WalletApi.apiV1WalletTransferToJunkieWalletWalletAssetIdToUserIdPost(walletAssetId, toUserId, RestApi.fetchOptions)
    }
  }

  static Room = {
    createRoom(roomRequest: models.CreateRoomRequest) {
      return RestApi.RoomApi.apiV1RoomPost(roomRequest, RestApi.fetchOptions);
    },
    startRecording(request: models.StartRecordingRequest) {
      return RestApi.RoomApi.apiV1RoomStartRecordingPost(request, RestApi.fetchOptions);
    },
    stopRecording(sessionId: string) {
      return RestApi.RoomApi.apiV1RoomStoprecordingSessionIdPost(sessionId, RestApi.fetchOptions);
    },
    getRoomStatistics(roomId: string) {
      return RestApi.RoomApi.apiV1RoomStatisticsV2Get(roomId, RestApi.fetchOptions);
    },
    sendNotification(livestreamId: string) {
      return RestApi.RoomApi.apiV1RoomSendLiveNotificationLivestreamIdPost(livestreamId, RestApi.fetchOptions)
    }
  };
  static Blockchain = {
    getByOwnerId(blockchainRequest: models.BlockChainRequest) {
      return RestApi.BlockchainApi.apiV1BlockchainGetAssetsPost(blockchainRequest, RestApi.fetchOptions);
    },
    getAssetById(blockchain: models.Blockchain, contractAddress: string, tokenId: string) {
      return RestApi.BlockchainApi.apiV1BlockchainGetAssetByIdBlockchainContractAddressTokenIdGet(blockchain,
        contractAddress,
        tokenId,
        RestApi.fetchOptions);
    },
    processIPFSCache(ipfsUrl: string) {
      return RestApi.BlockchainApi.apiV1BlockchainGetIPFSMediaPost(ipfsUrl, RestApi.fetchOptions);
    }
  }

  static Marketplace = {
    getSales(filters: MarketplaceFilterRequest) {
      return RestApi.MarketplaceApi.apiV1MarketplaceGetSalesPost(filters, RestApi.fetchOptions);
    },
    getSalesBySellerId(sellerId: string) {
      return RestApi.MarketplaceApi.apiV1MarketplaceGetSalesSellerIdGet(sellerId, RestApi.fetchOptions)
    },
    getAuctionsBySellerId(sellerId: string) {
      return RestApi.MarketplaceApi.apiV1MarketplaceGetAuctionsSellerIdGet(sellerId, RestApi.fetchOptions)
    },    
    getAuctions() {
      return RestApi.MarketplaceApi.apiV1MarketplaceGetAuctionsPost(RestApi.fetchOptions)
    },
    getCollections (blockchain: Blockchain) {
      return RestApi.MarketplaceApi.apiV1MarketplaceGetSaleCollectionsByBlockchainBlockchainGet(blockchain, RestApi.fetchOptions);
    },
    getNFTLeaderboard() {
      return RestApi.MarketplaceApi.apiV1MarketplaceGetLeadersByNFTsOwnedGet(RestApi.fetchOptions);
    },
    getBidsLeaderboard() {
      return RestApi.MarketplaceApi.apiV1MarketplaceGetLeadersByBidsGet(RestApi.fetchOptions);
    }
  }

  static PaymentCredit = {
    getPayoutBalanceForCurrentUser() {
      return RestApi.PaymentCreditApi.apiV1PaymentCreditGetUserBalanceGet(RestApi.fetchOptions);
    },
    getTotalAvailableBalance() {
      return RestApi.PaymentCreditApi.apiV1PaymentCreditGetTotalUserBalanceGet(RestApi.fetchOptions);
    },
    getCreditBalanceForCurrentUser() {
      return RestApi.PaymentCreditApi.apiV1PaymentCreditGetUserJUNKIECreditBalanceGet(RestApi.fetchOptions);
    },    
    requestPayout(email: string) {
      return RestApi.PaymentCreditApi.apiV1PaymentCreditRequestPayoutGet(email, RestApi.fetchOptions);
    },
    createOrder(amount: number) {
      return RestApi.PaymentCreditApi.apiV1PaymentCreditCreatePaypalOrderPost(amount, RestApi.fetchOptions)
    },
    captureOrder(orderId: string) {
      return RestApi.PaymentCreditApi.apiV1PaymentCreditCapturePaypalOrderPost(orderId, RestApi.fetchOptions);
    },
  }

  static Social = {
    getByPostId(id: string) {
      return RestApi.SocialApi.apiV1SocialIdGet(id, RestApi.fetchOptions)
    },
    getLatestPosts(postType: SocialPostType, includeAll = false) {
      return RestApi.SocialApi.apiV1SocialGetLatestPostsPostTypeIncludeAllGet(postType, includeAll, RestApi.fetchOptions);
    },
    getByUserId(userId: string, postType: SocialPostType) {
      return RestApi.SocialApi.apiV1SocialUserUserIdPostTypeGet(userId, postType, RestApi.fetchOptions);
    },
    savePost(post: SocialPost) {
      return RestApi.SocialApi.apiV1SocialSavePost(post, RestApi.fetchOptions);
    },
    toggleFollow(toUserId: string) {
      return RestApi.SocialApi.apiV1SocialUserIdToggleFollowPost(toUserId, RestApi.fetchOptions)
    },
    getUserFollowers(userId: string) {
      return RestApi.SocialApi.apiV1SocialUserIdFollowersGet(userId, RestApi.fetchOptions)
    },
    getUserFollowing(userId: string) {
      return RestApi.SocialApi.apiV1SocialUserIdFollowingGet(userId, RestApi.fetchOptions)
    },
    doesUserFollow(userId: string) {
      return RestApi.SocialApi.apiV1SocialUserIdIsFollowerGet(userId, RestApi.fetchOptions)
    },
    toggleReaction(reaction: Reaction) {
      return RestApi.SocialApi.apiV1SocialToggleReactionPost(reaction, RestApi.fetchOptions);
    },
    doesReactionExist(objectId: string, reactionType: ReactionType) {
      return RestApi.SocialApi.apiV1SocialDoestReactionExistObjectIdReactionTypeGet(objectId, reactionType, RestApi.fetchOptions);
    },
    getReactionCount(objectId: string, reactionType: ReactionType) {
      return RestApi.SocialApi.apiV1SocialReactionCountObjectIdReactionTypeGet(objectId, reactionType, RestApi.fetchOptions)
    }
  }

  static Seller = {
    getPendingOrders() {
      return RestApi.SellerApi.apiV1SellerGetSellerPendingOrdersGet(RestApi.fetchOptions);
    },
    getSellerShipments() {
      return RestApi.SellerApi.apiV1SellerGetSellerShipmentsGet(RestApi.fetchOptions);
    },
    createShipment(request: CreateShipmentRequestModel) {
      return RestApi.SellerApi.apiV1SellerCreateShipmentPost(request, RestApi.fetchOptions);
    }
  }


  static Notification = {
    tagUserInLivestream(livestreamId: string, message: string) {
      return RestApi.NotificationApi.apiV1NotificationTagLivestreamIdPost(livestreamId, message, RestApi.fetchOptions)
    },
    notifyDMUser(toUserId: string, fromUserName: string, fromUserId: string, message: string) {
      return RestApi.NotificationApi.apiV1NotificationDmFromUserNameFromUserIdToUserIdPost(toUserId, fromUserName, fromUserId, message, RestApi.fetchOptions);
    }
  }  
}
