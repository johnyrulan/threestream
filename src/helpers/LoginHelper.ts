import { RestApi } from "@/services/RestApi";
import router from "@/router";
import CommonHelper from "./CommonHelper";
import axios from "axios";
import StoreMutations from "@/store/store.constants";
import CommonService from "@/services/domain/CommonService";
import { useStore } from "@/store/main.store";

const store = useStore()

export class LoginHelper {
  static async signIn(credentials: { email: string, password: string }) {
    try {
      const user = await RestApi.User.signIn(credentials.email.toLowerCase(), credentials.password);

      store.setCurrentUser(user.data);
      router.push({ name: 'Home' });
    }
    catch (err) {
      CommonService.showError(err);
    }
  }

  static googleSignIn(response: any, responsePayload: any) {
    let user = {
        email: responsePayload.email,
        firstName: responsePayload.given_name,
        lastName: responsePayload.family_name,
        termsAndPrivacyAgreedDate: new Date()
    };

    CommonHelper.setCookie("cf-auth-token", response.credential, 1);
    CommonHelper.setCookie("cf-auth-provider", "Google", 1);
    CommonHelper.setCookie("cf-auth-user", responsePayload.email, 1);

    axios.post('https://localhost:7252/api/v1/user', user, { withCredentials: true })
    .then(res => {
        store.setCurrentUser(user as any);
        router.push({ name: 'Home' });
    })
    .catch(err => {
        console.log(err);
    });
  }

  static faceBookSignIn(response: any) {
    let accessToken = response.authResponse.accessToken;
    axios.get(`https://graph.facebook.com/v2.8/me?access_token=${accessToken}&fields=first_name,last_name,email`)
    .then(async (res) => {
        let user = {
            email: res.data.email,
            firstName: res.data.first_name,
            lastName: res.data.last_name,
            termsAndPrivacyAgreedDate: new Date()
        };

        CommonHelper.setCookie("cf-auth-token", accessToken, 1);
        CommonHelper.setCookie("cf-auth-provider", "Facebook", 1);
        CommonHelper.setCookie("cf-auth-user", res.data.email, 1);

        await axios.post('https://localhost:7252/api/v1/user', user, { withCredentials: true });

        store.setCurrentUser(user as any);
        router.push({ name: 'Home' });
    })
    .catch(err => {
        console.log(err);
    });
  }
}
