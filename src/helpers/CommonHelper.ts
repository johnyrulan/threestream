import { ScreenWidth } from '@/enums/ScreenWidth';
import { Address, SocialPost, User } from '@/services/api/models';
import dayJs from 'dayjs';
import { DateTime } from 'luxon';
import StringHelper from './StringHelper';

export default class CommonHelper {

    static setCookie(cName: string, cValue: string, expDays: number) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
    }

    static scrollTo(ref: any, refs: any) {
        const refEl = refs[ref];

        if (!refEl) return;

        const el: any = Array.isArray(refEl) ? (refs[ref] as Element[])[0] : refEl;
        el.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }

    static getMinInArrayByPropertyName(values: Array<any>, propertyName: string): any {
        if (values.length === 0) return {};
        if (values.length === 1) return values[0];

        let minValue = values[0];

        for (let i = 1; i < values.length; ++i) {
            if (values[i][propertyName] < minValue[propertyName]) minValue = values[i];
        }

        return minValue;
    }

    static formatDate(date: Date | string, format: string) {
        return dayJs(date).format(format);
    }

    static formatLivestreamDate(date: Date | string) {

        if (new Date(date).toDateString() === new Date().toDateString()) {

            return 'Today - ' + this.formatDate(date, 'hh:mm A');

        } else if (this.isTomorrow(date)) {
            
            return 'Tomorrow - ' + this.formatDate(date, 'hh:mm A');

        } else if (this.withinSixDays(date)) {

            return this.formatDate(date, 'dddd - hh:mm A');

        } else {

            return this.formatDate(date, 'MMMM D - hh:mm A')
        }
    }

    private static isTomorrow(date: Date | string) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        return (tomorrow.toDateString() === new Date(date).toDateString());
    }

    private static withinSixDays(date: Date | string) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 2);

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 6);

        const _date = new Date(date);

        return (_date >= startDate && _date <= endDate);
    }

    static deepCopy(object: any) {
        return JSON.parse(JSON.stringify(object));
    }

    static removeBg(id: string) {
        const el = document.getElementById(id);

        if (!el) return;

        el.classList.add('bg-none');
    }

    static getScreenWidth() {
        const screenWidth = screen.width;

        if (screenWidth >= 1400) return ScreenWidth.XXL;
        if (screenWidth >= 1200) return ScreenWidth.XL;
        if (screenWidth >= 992) return ScreenWidth.LG;
        if (screenWidth >= 768) return ScreenWidth.MD;
        if (screenWidth >= 576) return ScreenWidth.SM;
        
        return ScreenWidth.XS;
    }

    static getUserFromSocialPost(post: SocialPost) {
        const user = { userAttributes: {} } as User;
    
        user.id = post.userId;
        user.name = post.userName;
        user.userAttributes.profilePicUrl = post.profilePicUrl;
        user.userAttributes.coverImageUrl = post.coverImageUrl;
        user.userAttributes.isProfilePicVideo = post.isProfilePicVideo;
    
        return user;
    }

    static formatDateAsWeekday(date: any) {
        const dateTime = DateTime.fromISO(date);
    
        return dateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    }

    static hasValidShippingAddress(address: Address | null | undefined) {
        if (!address) return false; 

        return !StringHelper.isNullOrEmpty(address?.fullName)
            || !StringHelper.isNullOrEmpty(address?.city)
            || !StringHelper.isNullOrEmpty(address?.state)
            || !StringHelper.isNullOrEmpty(address?.zip);
    }

    static getStreamChatMember(members: any, ignoreUserName: string) {
        for (let key of Object.keys(members)) {
            const member = members[key];

            if (member.user_id === ignoreUserName) {
                continue;
            }

            return member.user;
        }

        return { name: 'Unnamed' };
    }
}