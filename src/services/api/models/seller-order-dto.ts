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
import { PackageSizeUnit } from './package-size-unit';
import { PackageWeightUnit } from './package-weight-unit';
import { PhysicalAssetAttributes } from './physical-asset-attributes';
import { UserAttributes } from './user-attributes';
/**
 * 
 * @export
 * @interface SellerOrderDTO
 */
export interface SellerOrderDTO {
    /**
     * 
     * @type {string}
     * @memberof SellerOrderDTO
     */
    buyerId?: string;
    /**
     * 
     * @type {string}
     * @memberof SellerOrderDTO
     */
    buyerName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof SellerOrderDTO
     */
    buyerAttributesRaw?: string | null;
    /**
     * 
     * @type {UserAttributes}
     * @memberof SellerOrderDTO
     */
    buyerAttributes?: UserAttributes;
    /**
     * 
     * @type {string}
     * @memberof SellerOrderDTO
     */
    orderId?: string;
    /**
     * 
     * @type {string}
     * @memberof SellerOrderDTO
     */
    livestreamName?: string | null;
    /**
     * 
     * @type {number}
     * @memberof SellerOrderDTO
     */
    price?: number;
    /**
     * 
     * @type {number}
     * @memberof SellerOrderDTO
     */
    quantity?: number;
    /**
     * 
     * @type {Date}
     * @memberof SellerOrderDTO
     */
    orderCreated?: Date;
    /**
     * 
     * @type {string}
     * @memberof SellerOrderDTO
     */
    productName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof SellerOrderDTO
     */
    productAttributesRaw?: string | null;
    /**
     * 
     * @type {PhysicalAssetAttributes}
     * @memberof SellerOrderDTO
     */
    productAttributes?: PhysicalAssetAttributes;
    /**
     * 
     * @type {string}
     * @memberof SellerOrderDTO
     */
    shipmentId?: string;
    /**
     * 
     * @type {number}
     * @memberof SellerOrderDTO
     */
    shipmentHeight?: number;
    /**
     * 
     * @type {number}
     * @memberof SellerOrderDTO
     */
    shipmentWidth?: number;
    /**
     * 
     * @type {number}
     * @memberof SellerOrderDTO
     */
    shipmentLength?: number;
    /**
     * 
     * @type {PackageSizeUnit}
     * @memberof SellerOrderDTO
     */
    packageSizeUnit?: PackageSizeUnit;
    /**
     * 
     * @type {number}
     * @memberof SellerOrderDTO
     */
    shipmentWeight?: number;
    /**
     * 
     * @type {PackageWeightUnit}
     * @memberof SellerOrderDTO
     */
    packageWeightUnit?: PackageWeightUnit;
    /**
     * 
     * @type {string}
     * @memberof SellerOrderDTO
     */
    shipmentAttributesRaw?: string | null;
    /**
     * 
     * @type {any}
     * @memberof SellerOrderDTO
     */
    shipmentAttributes?: any | null;
}
