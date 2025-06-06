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
import globalAxios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { ApiErrorResponse } from '../models';
import { BidLeader } from '../models';
import { Blockchain } from '../models';
import { FilterRequest } from '../models';
import { MarketplaceCollectionResponseModel } from '../models';
import { MarketplaceFilterRequest } from '../models';
import { MarketplaceResponseModel } from '../models';
import { MarketplaceSale } from '../models';
import { NftLeader } from '../models';
import { PhysicalSaleViewModel } from '../models';
/**
 * MarketplaceApi - axios parameter creator
 * @export
 */
export const MarketplaceApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1MarketplaceGetAuctionsPost: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/Marketplace/GetAuctions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} sellerId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1MarketplaceGetAuctionsSellerIdGet: async (sellerId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'sellerId' is not null or undefined
            if (sellerId === null || sellerId === undefined) {
                throw new RequiredError('sellerId','Required parameter sellerId was null or undefined when calling apiV1MarketplaceGetAuctionsSellerIdGet.');
            }
            const localVarPath = `/api/v1/Marketplace/getAuctions/{sellerId}`
                .replace(`{${"sellerId"}}`, encodeURIComponent(String(sellerId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1MarketplaceGetLeadersByBidsGet: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/Marketplace/GetLeadersByBids`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1MarketplaceGetLeadersByNFTsOwnedGet: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/Marketplace/GetLeadersByNFTsOwned`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} sellerId 
         * @param {FilterRequest} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1MarketplaceGetPhysicalSalesBySellerSellerIdPost: async (sellerId: string, body?: FilterRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'sellerId' is not null or undefined
            if (sellerId === null || sellerId === undefined) {
                throw new RequiredError('sellerId','Required parameter sellerId was null or undefined when calling apiV1MarketplaceGetPhysicalSalesBySellerSellerIdPost.');
            }
            const localVarPath = `/api/v1/Marketplace/getPhysicalSalesBySeller/{sellerId}`
                .replace(`{${"sellerId"}}`, encodeURIComponent(String(sellerId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {FilterRequest} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1MarketplaceGetPhysicalSalesPost: async (body?: FilterRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/Marketplace/GetPhysicalSales`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {Blockchain} blockchain 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1MarketplaceGetSaleCollectionsByBlockchainBlockchainGet: async (blockchain: Blockchain, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'blockchain' is not null or undefined
            if (blockchain === null || blockchain === undefined) {
                throw new RequiredError('blockchain','Required parameter blockchain was null or undefined when calling apiV1MarketplaceGetSaleCollectionsByBlockchainBlockchainGet.');
            }
            const localVarPath = `/api/v1/Marketplace/GetSaleCollectionsByBlockchain/{blockchain}`
                .replace(`{${"blockchain"}}`, encodeURIComponent(String(blockchain)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {MarketplaceFilterRequest} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1MarketplaceGetSalesPost: async (body?: MarketplaceFilterRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/Marketplace/GetSales`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} sellerId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1MarketplaceGetSalesSellerIdGet: async (sellerId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'sellerId' is not null or undefined
            if (sellerId === null || sellerId === undefined) {
                throw new RequiredError('sellerId','Required parameter sellerId was null or undefined when calling apiV1MarketplaceGetSalesSellerIdGet.');
            }
            const localVarPath = `/api/v1/Marketplace/getSales/{sellerId}`
                .replace(`{${"sellerId"}}`, encodeURIComponent(String(sellerId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * MarketplaceApi - functional programming interface
 * @export
 */
export const MarketplaceApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetAuctionsPost(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<MarketplaceResponseModel>>> {
            const localVarAxiosArgs = await MarketplaceApiAxiosParamCreator(configuration).apiV1MarketplaceGetAuctionsPost(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} sellerId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetAuctionsSellerIdGet(sellerId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<MarketplaceSale>>>> {
            const localVarAxiosArgs = await MarketplaceApiAxiosParamCreator(configuration).apiV1MarketplaceGetAuctionsSellerIdGet(sellerId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetLeadersByBidsGet(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<BidLeader>>>> {
            const localVarAxiosArgs = await MarketplaceApiAxiosParamCreator(configuration).apiV1MarketplaceGetLeadersByBidsGet(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetLeadersByNFTsOwnedGet(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<NftLeader>>>> {
            const localVarAxiosArgs = await MarketplaceApiAxiosParamCreator(configuration).apiV1MarketplaceGetLeadersByNFTsOwnedGet(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} sellerId 
         * @param {FilterRequest} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetPhysicalSalesBySellerSellerIdPost(sellerId: string, body?: FilterRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<PhysicalSaleViewModel>>>> {
            const localVarAxiosArgs = await MarketplaceApiAxiosParamCreator(configuration).apiV1MarketplaceGetPhysicalSalesBySellerSellerIdPost(sellerId, body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {FilterRequest} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetPhysicalSalesPost(body?: FilterRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<PhysicalSaleViewModel>>>> {
            const localVarAxiosArgs = await MarketplaceApiAxiosParamCreator(configuration).apiV1MarketplaceGetPhysicalSalesPost(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {Blockchain} blockchain 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetSaleCollectionsByBlockchainBlockchainGet(blockchain: Blockchain, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<MarketplaceCollectionResponseModel>>>> {
            const localVarAxiosArgs = await MarketplaceApiAxiosParamCreator(configuration).apiV1MarketplaceGetSaleCollectionsByBlockchainBlockchainGet(blockchain, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {MarketplaceFilterRequest} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetSalesPost(body?: MarketplaceFilterRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<MarketplaceResponseModel>>> {
            const localVarAxiosArgs = await MarketplaceApiAxiosParamCreator(configuration).apiV1MarketplaceGetSalesPost(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} sellerId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetSalesSellerIdGet(sellerId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<MarketplaceSale>>>> {
            const localVarAxiosArgs = await MarketplaceApiAxiosParamCreator(configuration).apiV1MarketplaceGetSalesSellerIdGet(sellerId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * MarketplaceApi - factory interface
 * @export
 */
export const MarketplaceApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetAuctionsPost(options?: AxiosRequestConfig): Promise<AxiosResponse<MarketplaceResponseModel>> {
            return MarketplaceApiFp(configuration).apiV1MarketplaceGetAuctionsPost(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} sellerId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetAuctionsSellerIdGet(sellerId: string, options?: AxiosRequestConfig): Promise<AxiosResponse<Array<MarketplaceSale>>> {
            return MarketplaceApiFp(configuration).apiV1MarketplaceGetAuctionsSellerIdGet(sellerId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetLeadersByBidsGet(options?: AxiosRequestConfig): Promise<AxiosResponse<Array<BidLeader>>> {
            return MarketplaceApiFp(configuration).apiV1MarketplaceGetLeadersByBidsGet(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetLeadersByNFTsOwnedGet(options?: AxiosRequestConfig): Promise<AxiosResponse<Array<NftLeader>>> {
            return MarketplaceApiFp(configuration).apiV1MarketplaceGetLeadersByNFTsOwnedGet(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} sellerId 
         * @param {FilterRequest} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetPhysicalSalesBySellerSellerIdPost(sellerId: string, body?: FilterRequest, options?: AxiosRequestConfig): Promise<AxiosResponse<Array<PhysicalSaleViewModel>>> {
            return MarketplaceApiFp(configuration).apiV1MarketplaceGetPhysicalSalesBySellerSellerIdPost(sellerId, body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {FilterRequest} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetPhysicalSalesPost(body?: FilterRequest, options?: AxiosRequestConfig): Promise<AxiosResponse<Array<PhysicalSaleViewModel>>> {
            return MarketplaceApiFp(configuration).apiV1MarketplaceGetPhysicalSalesPost(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {Blockchain} blockchain 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetSaleCollectionsByBlockchainBlockchainGet(blockchain: Blockchain, options?: AxiosRequestConfig): Promise<AxiosResponse<Array<MarketplaceCollectionResponseModel>>> {
            return MarketplaceApiFp(configuration).apiV1MarketplaceGetSaleCollectionsByBlockchainBlockchainGet(blockchain, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {MarketplaceFilterRequest} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetSalesPost(body?: MarketplaceFilterRequest, options?: AxiosRequestConfig): Promise<AxiosResponse<MarketplaceResponseModel>> {
            return MarketplaceApiFp(configuration).apiV1MarketplaceGetSalesPost(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} sellerId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1MarketplaceGetSalesSellerIdGet(sellerId: string, options?: AxiosRequestConfig): Promise<AxiosResponse<Array<MarketplaceSale>>> {
            return MarketplaceApiFp(configuration).apiV1MarketplaceGetSalesSellerIdGet(sellerId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * MarketplaceApi - object-oriented interface
 * @export
 * @class MarketplaceApi
 * @extends {BaseAPI}
 */
export class MarketplaceApi extends BaseAPI {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MarketplaceApi
     */
    public async apiV1MarketplaceGetAuctionsPost(options?: AxiosRequestConfig) : Promise<AxiosResponse<MarketplaceResponseModel>> {
        return MarketplaceApiFp(this.configuration).apiV1MarketplaceGetAuctionsPost(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} sellerId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MarketplaceApi
     */
    public async apiV1MarketplaceGetAuctionsSellerIdGet(sellerId: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<MarketplaceSale>>> {
        return MarketplaceApiFp(this.configuration).apiV1MarketplaceGetAuctionsSellerIdGet(sellerId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MarketplaceApi
     */
    public async apiV1MarketplaceGetLeadersByBidsGet(options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<BidLeader>>> {
        return MarketplaceApiFp(this.configuration).apiV1MarketplaceGetLeadersByBidsGet(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MarketplaceApi
     */
    public async apiV1MarketplaceGetLeadersByNFTsOwnedGet(options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<NftLeader>>> {
        return MarketplaceApiFp(this.configuration).apiV1MarketplaceGetLeadersByNFTsOwnedGet(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} sellerId 
     * @param {FilterRequest} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MarketplaceApi
     */
    public async apiV1MarketplaceGetPhysicalSalesBySellerSellerIdPost(sellerId: string, body?: FilterRequest, options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<PhysicalSaleViewModel>>> {
        return MarketplaceApiFp(this.configuration).apiV1MarketplaceGetPhysicalSalesBySellerSellerIdPost(sellerId, body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {FilterRequest} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MarketplaceApi
     */
    public async apiV1MarketplaceGetPhysicalSalesPost(body?: FilterRequest, options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<PhysicalSaleViewModel>>> {
        return MarketplaceApiFp(this.configuration).apiV1MarketplaceGetPhysicalSalesPost(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {Blockchain} blockchain 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MarketplaceApi
     */
    public async apiV1MarketplaceGetSaleCollectionsByBlockchainBlockchainGet(blockchain: Blockchain, options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<MarketplaceCollectionResponseModel>>> {
        return MarketplaceApiFp(this.configuration).apiV1MarketplaceGetSaleCollectionsByBlockchainBlockchainGet(blockchain, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {MarketplaceFilterRequest} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MarketplaceApi
     */
    public async apiV1MarketplaceGetSalesPost(body?: MarketplaceFilterRequest, options?: AxiosRequestConfig) : Promise<AxiosResponse<MarketplaceResponseModel>> {
        return MarketplaceApiFp(this.configuration).apiV1MarketplaceGetSalesPost(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} sellerId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MarketplaceApi
     */
    public async apiV1MarketplaceGetSalesSellerIdGet(sellerId: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<MarketplaceSale>>> {
        return MarketplaceApiFp(this.configuration).apiV1MarketplaceGetSalesSellerIdGet(sellerId, options).then((request) => request(this.axios, this.basePath));
    }
}
