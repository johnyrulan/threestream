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
import { PhysicalAsset } from './physical-asset';
import { Sale } from './sale';
/**
 * 
 * @export
 * @interface SaleWithPhysicalAsset
 */
export interface SaleWithPhysicalAsset {
    /**
     * 
     * @type {Sale}
     * @memberof SaleWithPhysicalAsset
     */
    sale?: Sale;
    /**
     * 
     * @type {PhysicalAsset}
     * @memberof SaleWithPhysicalAsset
     */
    physicalAsset?: PhysicalAsset;
}
