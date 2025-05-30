/* tslint:disable */
/* eslint-disable */
/**
 * Conifer.NFT.API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { BuyOrder } from './buy-order';
import { SaleAsset } from './sale-asset';
/**
 * 
 * @export
 * @interface BuyOrderOffer
 */
export interface BuyOrderOffer {
    /**
     * 
     * @type {BuyOrder}
     * @memberof BuyOrderOffer
     */
    buyOrder?: BuyOrder;
    /**
     * 
     * @type {string}
     * @memberof BuyOrderOffer
     */
    userName?: string | null;
    /**
     * 
     * @type {SaleAsset}
     * @memberof BuyOrderOffer
     */
    saleAsset?: SaleAsset;
    /**
     * 
     * @type {boolean}
     * @memberof BuyOrderOffer
     */
    isSent?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof BuyOrderOffer
     */
    isReceived?: boolean;
}
