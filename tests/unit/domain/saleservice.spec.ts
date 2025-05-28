import NFTAsset from "@/models/NFTAsset";
import { BuyOrder, Livestream, Sale, SaleWithAssets } from "@/services/api/models";
import LivestreamService from "@/services/domain/LivestreamService";
import SaleService from "@/services/domain/SaleService";
import { RestApi } from "@/services/RestApi";

describe('SaleService', () => {

    test('Should call API to get sale by id', async () => {
        RestApi.Sales.getById = jest.fn();

        const sale = await SaleService.getById('');

        expect(RestApi.Sales.getById).toBeCalledTimes(1);
    });

    test('Should call API to get winning buy order', async () => {
        RestApi.Sales.getWinningBuyOrder = jest.fn();

        const buyOrder = await SaleService.getWinningBuyOrder('');

        expect(RestApi.Sales.getWinningBuyOrder).toBeCalledTimes(1);
    });

    test('Should call API to get livestream by parent id', async () => {
        RestApi.Sales.getByParentId = jest.fn();

        const sales = await SaleService.getByParentId('');

        expect(RestApi.Sales.getByParentId).toBeCalledTimes(1);
    });

    test('Should call API to start the auction', async () => {
        RestApi.Sales.startAuction = jest.fn();

        const sales = await SaleService.startAuction('', 0);

        expect(RestApi.Sales.startAuction).toBeCalledTimes(1);
    });

    test('Should call API to end the auction', async () => {
        RestApi.Sales.endAuction = jest.fn();

        const sales = await SaleService.endAuction('', '');

        expect(RestApi.Sales.endAuction).toBeCalledTimes(1);
    });

    test('Should call API to place a bid', async () => {
        RestApi.Sales.createBuyOrder = jest.fn();
        const buyOrder: BuyOrder = {};

        const sales = await SaleService.placeBuyOrder(buyOrder);

        expect(RestApi.Sales.createBuyOrder).toBeCalledTimes(1);
    });
});