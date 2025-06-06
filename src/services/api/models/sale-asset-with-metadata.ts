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
import { Blockchain } from './blockchain';
import { RedemptionStatus } from './redemption-status';
/**
 * 
 * @export
 * @interface SaleAssetWithMetadata
 */
export interface SaleAssetWithMetadata {
    /**
     * 
     * @type {string}
     * @memberof SaleAssetWithMetadata
     */
    id?: string;
    /**
     * 
     * @type {boolean}
     * @memberof SaleAssetWithMetadata
     */
    isDeleted?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof SaleAssetWithMetadata
     */
    created?: Date;
    /**
     * 
     * @type {Date}
     * @memberof SaleAssetWithMetadata
     */
    updated?: Date;
    /**
     * 
     * @type {Blockchain}
     * @memberof SaleAssetWithMetadata
     */
    blockchain?: Blockchain;
    /**
     * 
     * @type {string}
     * @memberof SaleAssetWithMetadata
     */
    ownerAddress?: string | null;
    /**
     * 
     * @type {string}
     * @memberof SaleAssetWithMetadata
     */
    contractAddress?: string | null;
    /**
     * 
     * @type {string}
     * @memberof SaleAssetWithMetadata
     */
    tokenId?: string | null;
    /**
     * 
     * @type {RedemptionStatus}
     * @memberof SaleAssetWithMetadata
     */
    redemptionStatus?: RedemptionStatus;
    /**
     * 
     * @type {boolean}
     * @memberof SaleAssetWithMetadata
     */
    isTransferable?: boolean;
    /**
     * 
     * @type {string}
     * @memberof SaleAssetWithMetadata
     */
    saleId?: string;
    /**
     * 
     * @type {string}
     * @memberof SaleAssetWithMetadata
     */
    walletAssetId?: string;
    /**
     * 
     * @type {string}
     * @memberof SaleAssetWithMetadata
     */
    assetPackId?: string;
    /**
     * 
     * @type {any}
     * @memberof SaleAssetWithMetadata
     */
    data?: any | null;
}
