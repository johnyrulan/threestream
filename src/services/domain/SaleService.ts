import { BuyOrder, Sale, SaleAsset, SaleType, SaleWithAssets, UpdateAuctionEndTimeRequest, UpdateAuctionStartTimeRequest } from "../api/models";
import NumberHelper from "@/helpers/NumberHelper";
import { RestApi } from "../RestApi";

export default class SaleService {
    static async getById(id: string) {
        const sale = (await RestApi.Sales.getById(id))?.data;

        if (sale)
            (sale.sale as Sale).floorPrice = NumberHelper.normalizeCurrencyFromAPI(sale.sale?.floorPrice ?? 0);

        return sale;
    }

    static async getPhysicalById(id: string) {
        const sale = (await RestApi.Sales.getPhysicalById(id))?.data;

        if (sale)
            (sale.sale as Sale).floorPrice = NumberHelper.normalizeCurrencyFromAPI(sale.sale?.floorPrice ?? 0);

        return sale;
    }

    static async getByParentId(id: string) {
        const sales = (await RestApi.Sales.getByParentId(id))?.data;

        return sales?.map(s => {
            (s.sale as Sale).floorPrice = NumberHelper.normalizeCurrencyFromAPI(s.sale?.floorPrice ?? 0)

            return s
        })
    }

    static async getWinningBuyOrder(saleId: string) {
        const buyOrder = (await RestApi.Sales.getWinningBuyOrder(saleId))?.data;

        if (!buyOrder) return null;

        buyOrder.amount = NumberHelper.normalizeCurrencyFromAPI(buyOrder?.amount ?? 0)

        return buyOrder;
    }

    static async startAuction(saleId: string, auctionEndSeconds: number) {
        const req: UpdateAuctionStartTimeRequest = {
            saleId,
            auctionEndSeconds
        }

        return (await RestApi.Sales.startAuction(req))?.data;
    }

    static async endAuction(saleId: string, assetName: string) {
        const req: UpdateAuctionEndTimeRequest = {
            saleId,
            assetName
        }

        return (await RestApi.Sales.endAuction(req))?.data;
    }

    static async placeBuyOrder(buyOrder: BuyOrder) {
        return (await RestApi.Sales.createBuyOrder(buyOrder))?.data;
    }

    static async getUserAssets() {
        return (await RestApi.Sales.getUserAssets())?.data;
    }

    static async purchaseDirectSale (saleId: string, nftName: string) {
        return (await RestApi.Sales.purchaseDirectSale(saleId, nftName))?.data;
    }

    static async saveSaleWithAssets(sale: Sale, assets: SaleAsset[]) {
        const saleWithAssets: SaleWithAssets = {
            sale: sale,
            saleAssets: assets
        }
        return (await RestApi.Sales.saveSale(saleWithAssets))?.data;
    }

    static async listForSale(sale: Sale, assets: SaleAsset[], walletAssetId: string, nftName: string) {
        const saleWithAssets: SaleWithAssets = {
            sale: sale,
            saleAssets: assets
        }

        return (await RestApi.Sales.listForSale(saleWithAssets, walletAssetId, nftName)).data;
    }

    static async updateSalePrice(saleId: string, price: number, saleType: SaleType) {
        return (await RestApi.Sales.updateSalePrice(saleId, price, saleType)).data;
    }

    static async saveOffer(buyOrder: BuyOrder, nftName: string) {
        return (await RestApi.Sales.saveOffer(buyOrder, nftName)).data;
    }

    static async acceptOffer(buyOrderId: string, nftName: string) {
        return (await RestApi.Sales.acceptOffer(buyOrderId, nftName)).data;
    }

    static async cancelOffer(buyOrderId: string) {
        return (await RestApi.Sales.cancelOffer(buyOrderId)).data;
    }

    static async cancelSale(walletAssetId: string) {
        return (await RestApi.Sales.cancelSale(walletAssetId)).data;
    }

    static async getSalesSoldInMarketplace() {
        return (await RestApi.Sales.getSalesSoldInMarketplace()).data;
    }
}