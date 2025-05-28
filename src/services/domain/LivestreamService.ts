import CommonService from "./CommonService";
import { RestApi } from "../RestApi";
import { SaleAsset, Livestream, SaleWithAssets, Sale, LiveStreamWithTotalSales, WalletAsset, SaleAssetType } from "../api/models";
import { TYPE, useToast } from "vue-toastification";
import NFTAsset from "@/models/NFTAsset";
import AssetHelper from "@/helpers/AssetHelper";
import NumberHelper from "@/helpers/NumberHelper";

export default class LivestreamService {
    private static readonly toast = useToast()

    static async getLivestream(livestreamId: string): Promise<Livestream> {
        if (!livestreamId) return {} as Livestream;
        return (await RestApi.Livestream.getLivestream(livestreamId))?.data;
    }

    static async getLivestreamsByUserId(userId: string): Promise<LiveStreamWithTotalSales[]> {
        try {
            return (await RestApi.Livestream.getLivestreamByUserId(userId)).data;
        } catch (err) {
            this.toast('The livestream does not exist', { type: TYPE.ERROR })
            CommonService.showError(err);
        }

        return [];
    }

    static async getAll(): Promise<Livestream[]> {
        try {
            return (await RestApi.Livestream.getAll()).data;
        } catch (err) {
            CommonService.showError(err);
        }

        return [];
    }

    static async getAllWithTotalSales(): Promise<LiveStreamWithTotalSales[]> {
        try {
            return (await RestApi.Livestream.getAllLivestreamWithTotalSales()).data;
        } catch (err) {
            CommonService.showError(err);
        }

        return [];
    }

    static async getLivestreamSales(livestreamId: string): Promise<SaleWithAssets[]> {
        try {
            const livestreamSales = (await RestApi.Livestream.getSalesByLivestreamId(livestreamId)).data;

            return livestreamSales.map(l => {
                (l.sale as Sale).floorPrice = NumberHelper.normalizeCurrencyFromAPI(l.sale?.floorPrice ?? 0)

                return l
            })

        } catch (err) {
            this.toast('An error occurred retrieving the sales', { type: TYPE.ERROR })
            CommonService.showError(err);
        }

        return [];
    }

    static async saveLivestreamWithSales(livestream: Livestream, salesWithAssets: {sale: Sale, asset: NFTAsset}[], walletAssets: WalletAsset[]): Promise<Livestream | undefined> {
        const transformedSales: SaleWithAssets[] = salesWithAssets.map(s => {

            if (s.sale.saleAssetType === SaleAssetType.AssetPack) {
                s.sale.floorPrice = NumberHelper.normalizeCurrencyToSave(s.sale?.floorPrice ?? 0)
                return s;
            }

            const sale = {
                sale: s.sale,
                saleAssets: AssetHelper.transformAssets([s.asset])
            }

            sale.saleAssets.forEach(s => {
                s.walletAssetId = walletAssets.filter(w => w.contractAddress === s.contractAddress &&
                    w.blockchain === s.blockchain && w.tokenId === s.tokenId)[0]?.id ?? ''
            })

            sale.sale.floorPrice = NumberHelper.normalizeCurrencyToSave(sale.sale?.floorPrice ?? 0)

            return sale as SaleWithAssets
        });        

        return (await RestApi.Livestream.saveLivestream(livestream, transformedSales))?.data;
    }

    static async deleteLivestream(livestreamId: string): Promise<boolean | undefined> {
        try {
            return (await RestApi.Livestream.deleteLivestream(livestreamId)).data;
        } catch (err) {
            CommonService.showError(err);
        }
    }

    static async getUsersWithPlacedBids(livestreamId: string) {
        return (await RestApi.Livestream.getUsersWithPlacedBids(livestreamId)).data;
    }

    static async getUsersWhoWonAuctions(livestreamId: string) {
        return (await RestApi.Livestream.getUsersWhoWonAuctions(livestreamId)).data;
    }
    static async banUser(userId: string, livestreamId: string) {
        try {
            return (await RestApi.Livestream.banUser(userId, livestreamId)).data;
        } catch (err) {
            CommonService.showError(err);
        }
    }

    static async unbanUser(userId: string, livestreamId: string) {
        try {
            return (await RestApi.Livestream.unbanUser(userId, livestreamId)).data;
        } catch (err) {
            CommonService.showError(err);
        }
    }

}