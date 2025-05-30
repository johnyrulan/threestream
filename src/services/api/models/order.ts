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
import { BuyerOrderStatus } from './buyer-order-status';
import { SaleType } from './sale-type';
import { SellerOrderStatus } from './seller-order-status';
/**
 * 
 * @export
 * @interface Order
 */
export interface Order {
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    id?: string;
    /**
     * 
     * @type {boolean}
     * @memberof Order
     */
    isDeleted?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof Order
     */
    created?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Order
     */
    updated?: Date;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    saleId?: string;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    buyOrderId?: string;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    sellerUserId?: string;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    buyerUserId?: string;
    /**
     * 
     * @type {SaleType}
     * @memberof Order
     */
    saleType?: SaleType;
    /**
     * 
     * @type {SellerOrderStatus}
     * @memberof Order
     */
    sellerOrderStatus?: SellerOrderStatus;
    /**
     * 
     * @type {BuyerOrderStatus}
     * @memberof Order
     */
    buyerOrderStatus?: BuyerOrderStatus;
}
