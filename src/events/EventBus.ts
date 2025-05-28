import NFTAsset from '@/models/NFTAsset';
import { SellerOrderDTO, Sale, SaleWithPhysicalAsset, User, AssetPack } from '@/services/api/models';
import { Blockchain } from '@/services/api/models/blockchain';
import mitt, { Emitter } from 'mitt';
import Wallet from '../enums/Wallet';

type Events = {
    memberBanned: {},
    onAccountChanged: { wallet: Wallet, blockchain: Blockchain, accountAddress: string },
    onEndAuction: { saleId: string, liveStreamId: string, auctionEndTime: Date },
    onAuctionEnded: { sale: Sale }
    onRealtimeServiceConnected: {},
    videoControlsMute: { uid: string; enableMute: boolean },
    videoControlsPin: string,
    videoControlsExpand: string,
    videoControlsRemove: string,
    onSignInModalOpen: { livestreamId: string, livestreamTitle: string, livestreamDate: string, promoImage: string, promoDescription: string },
    onLogin: { user: User },
    onLogout: {},
    onAppClick: {},
    onEditPhysicalAsset: { saleWithPhysicalAsset: SaleWithPhysicalAsset },
    onCreateShipment: { orders: SellerOrderDTO[] },
    onShipmentCreated: {},
    onJunkieBalanceUpdated: {},
    onTransferJunkieAsset: { walletAssetId: string },
    onOpenPack: { assetPack: AssetPack },
    channelRead: {}
}

const eventBus: Emitter<Events> = mitt<Events>();

export default eventBus;