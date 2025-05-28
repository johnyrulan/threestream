import { DateTime } from "luxon";
import mixpanel from 'mixpanel-browser';

export default class AnalyticsService {

    static mixPanelToken = import.meta.env.VITE_MIXPANEL_TOKEN;

    static initialize() {
      // mixpanel.init(this.mixPanelToken);
    }

    static track(event: string, data: any) {
      // mixpanel.track(event, data)
    }

    static logUserInGoogleTagManager(id: string, name: string, email: string) {
        (<any>window).dataLayer = (<any>window).dataLayer || [];
        (<any>window).dataLayer.push({
          'userId': id,
          'first_name': name,
          'email': email,
        });
    }

    static logLivestreamRegistrationInGoogleTagManager(id: string, name: string, email: string,
      livestreamId: string, livestreamTitle: string, livestreamPromoDescription: string,
      signUpDate: string, referrer_id: string) {

      const dataLayerObject = {
        'event': 'userSignedUp',
        'userId': id,
        'first_name': name,
        'email': email,
        'livestreamId': livestreamId,
        'livestream_signed_up_for_title': livestreamTitle,
        'livestream_promo_description': livestreamPromoDescription,
        'livestream_signed_up_for_date': '',
        'livestream_datetime_utc': '',
        'referrer_id': referrer_id
      };

      const livestreamDate = DateTime.fromISO(signUpDate);

      if (livestreamDate.isValid) {
        dataLayerObject.livestream_signed_up_for_date = livestreamDate.toLocaleString(DateTime.DATE_SHORT);
        dataLayerObject.livestream_datetime_utc = livestreamDate.toISO();
      }

      (<any>window).dataLayer = (<any>window).dataLayer || [];
      (<any>window).dataLayer.push(dataLayerObject);
  }
}