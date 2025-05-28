import { UploadType } from '@/enums/CommonEnums';
import User from '@/models/User';
import { AssetPackType, Blockchain, FileRequestType, Livestream, SocialPost } from '@/services/api/models';
import { RestApi } from '@/services/RestApi';
import StringHelper from './StringHelper';

import RebreakStandard from '@/assets/rebreaks/standard-rebreak.png';
import RebreakPro from '@/assets/rebreaks/pro-rebreak.png';
import RebreakPremium from '@/assets/rebreaks/premium-rebreak.png';

import RebreakStandardVideo from '@/assets/rebreaks/standard-rebreak-video.mp4';
import RebreakPremiumVideo from '@/assets/rebreaks/premium-rebreak-video.mp4';
import RebreakProVideo from '@/assets/rebreaks/pro-rebreak-video.mp4';

export default class ImageHelper {
    static baseUrl = import.meta.env.VITE_AZURE_STORAGE_URL;
    static ipfsUrl = import.meta.env.VITE_IPFS_GATEWAY_URL;

    static DefaultImage = {
        Account: 'https://firebasestorage.googleapis.com/v0/b/conifer-live.appspot.com/o/defaults%2Faccount-profile-photo-default.svg?alt=media&token=b8cbac20-d5fa-481a-976e-58ece3ef75d6'
    };

    static getUserPicById(id: string) {
        return `${this.baseUrl}/user/${id}`;
    }

    static getProfilePicForUser(user: User) {
        if (!user || !user?.profilePicUrl) return '';

        const profilePicUrl = `${this.baseUrl}/user/${user.profilePicUrl}`;

        return profilePicUrl;
    }

    static getCoverImageForUser(user: User) {
        if (!user || !user?.userAttributes?.coverImageUrl) return '';

        const coverImageUrl = `${this.baseUrl}/usercover/${user.userAttributes.coverImageUrl}`;

        return coverImageUrl;
    }

    static getAssetByType(img: string, type: FileRequestType) {
        if (!img) return '';

        return `${this.baseUrl}/${type.toLowerCase()}/${img}`;
    }

    static getPostImage(img: string) {
        if (!img) return '';

        const imgUrl = `${this.baseUrl}/imagepost/${img}`;

        return imgUrl;
    }

    static getPostVideo(video: string) {
        if (!video) return '';

        const videoUrl = `${this.baseUrl}/videopost/${video}`;

        return videoUrl;
    }

    static getVideo(video: string) {
        if (!video) return '';

        const videoUrl = `${this.baseUrl}/vids/${video}`;

        return videoUrl;
    }

    static async deleteImage(url: string | null | undefined, type: UploadType) {
        if (!StringHelper.isNullOrEmpty(url))
            await RestApi.Upload.deleteFile(url as string, type).catch();
    }

    static getLivestreamPromoImage(livestreamId: string, promoImage: string) {
        if (!livestreamId || !promoImage) return '';

        const promoImageUrl = `${this.baseUrl}/livestream/${promoImage}`;

        return promoImageUrl;
    }

    static getLivestreamCoverImage(liveStream: Livestream) {
        if (!liveStream || !liveStream?.imageUrl) return '';

        const coverImageUrl = `${this.baseUrl}/livestream/${liveStream.imageUrl}`;

        return coverImageUrl;
    }

    static getVidCoverImage(socialPost: SocialPost) {
        if (!socialPost || !socialPost?.socialPostAttributes?.coverImageUrl) return '';

        const coverImageUrl = `${this.baseUrl}/vidcover/${socialPost.socialPostAttributes.coverImageUrl}`;

        return coverImageUrl;
    }

    static async processIPFSCache(ipfsUrl: string) {
        if (ipfsUrl) await RestApi.Blockchain.processIPFSCache(ipfsUrl);
    }

    static tryIPFSMedia(url: string) {
        if (!url) return '';

        if (!url.startsWith('ipfs://')) return url;

        const formattedUrl = url.replace('ipfs://', '');

        if (formattedUrl.startsWith('ipfs/')) return `https://ipfs.io/${formattedUrl}`;        

        return `https://ipfs.io/ipfs/${formattedUrl}`;
    }

    static getIPFSCacheUrl(ipfsUrl: string) {
        if (!ipfsUrl) return '';

        if (ipfsUrl.startsWith('http')) return ipfsUrl;

        return `${this.ipfsUrl}/ipfs/${ipfsUrl}`;
    }

    static optimizeIPFSMedia(ipfsUrl: string, mediaType: 'image' | 'video', imgHeight = '275') {
        if (StringHelper.isNullOrEmpty(ipfsUrl)) return '';

        if (ipfsUrl.startsWith(this.baseUrl)) return ipfsUrl;

        if (mediaType === 'video') return ipfsUrl; // + '?stream=true';

        if (ipfsUrl.includes('.gif')) return ipfsUrl;

        if (!ipfsUrl.includes('ipfs')) return `${this.baseUrl}/user/${ipfsUrl}`;

        return ipfsUrl + '?img-height=275&img-fit=contain';
    }

    static getBlockchainLogo(blockchain: Blockchain) {
        if (blockchain === Blockchain.Wax) {
            return 'https://cryptologos.cc/logos/wax-waxp-logo.svg?v=021';
        } else if (blockchain === Blockchain.Flow) {
            return 'https://cryptologos.cc/logos/flow-flow-logo.svg?v=021';
        } else if (blockchain === Blockchain.Solana) {
            return 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=023';
        } else if (blockchain === Blockchain.Polygon) {
            return 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=023';
        } 
        else {
            return '';
        }
    }

    static getRebreakImage(assetPackType: AssetPackType) {        
        if (assetPackType === AssetPackType.Standard) {
            return RebreakStandard;
        }        

        if (assetPackType === AssetPackType.Premium) {
            return RebreakPremium;
        }

        return RebreakPro;
    }

    static getRebreakVideo(assetPackType: AssetPackType) {
        if (assetPackType === AssetPackType.Standard) {
            return RebreakStandardVideo;
        }        

        if (assetPackType === AssetPackType.Premium) {
            return RebreakPremiumVideo;
        }

        return RebreakProVideo;
    }
}