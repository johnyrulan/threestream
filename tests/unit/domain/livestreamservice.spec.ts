import NFTAsset from "@/models/NFTAsset";
import { Livestream, Sale } from "@/services/api/models";
import LivestreamService from "@/services/domain/LivestreamService";
import { RestApi } from "@/services/RestApi";

describe('LivestreamService', () => {

    test('Should call API to get livestream by id', async () => {
        RestApi.Livestream.getLivestream = jest.fn();

        const livestream = await LivestreamService.getLivestream('');

        expect(RestApi.Livestream.getLivestream).toBeCalledTimes(1);
    });

    test('Should call API to get all livestreams', async () => {
        RestApi.Livestream.getAll = jest.fn();

        const livestream = await LivestreamService.getAll();

        expect(RestApi.Livestream.getAll).toBeCalledTimes(1);
    });

    test('Should call API to get livestream by user id', async () => {
        RestApi.Livestream.getLivestreamByUserId = jest.fn();

        const livestream = await LivestreamService.getLivestreamsByUserId('');

        expect(RestApi.Livestream.getLivestreamByUserId).toBeCalledTimes(1);
    });

    // test('Should call API to save livestream', async () => {
    //     RestApi.Livestream.saveLivestream = jest.fn();
    //     const livestreamObj: Livestream = {name: '', timezone: '', startTime: new Date(), hostUserId: ''};
    //     const saleWithAssets: {sale: Sale, asset: NFTAsset}[] = [];
        
    //     const livestream = await LivestreamService.saveLivestreamWithSales(livestreamObj, saleWithAssets);

    //     expect(RestApi.Livestream.saveLivestream).toBeCalledTimes(1);
    // });

    test('Should call API to delete livestream', async () => {
        RestApi.Livestream.deleteLivestream = jest.fn();
        
        const livestream = await LivestreamService.deleteLivestream('');

        expect(RestApi.Livestream.deleteLivestream).toBeCalledTimes(1);
    });

});