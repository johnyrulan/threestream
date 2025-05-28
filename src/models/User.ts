import { User as UserInterface } from '../services/api/models';

export default class implements UserInterface {
    /**
     *
     * @type {string}
     * @memberof User
     */
     id?: any;
     /**
      *
      * @type {boolean}
      * @memberof User
      */
     isDeleted?: any;
     /**
      *
      * @type {Date}
      * @memberof User
      */
     created?: any;
     /**
      *
      * @type {Date}
      * @memberof User
      */
     updated?: any;
     /**
      *
      * @type {string}
      * @memberof User
      */
     password?: any | null;
     /**
      *
      * @type {string}
      * @memberof User
      */
     email: string = '';
     /**
      *
      * @type {string}
      * @memberof User
      */
     phoneNumber?: any | null;
     /**
      *
      * @type {string}
      * @memberof User
      */
     firstName?: any | null;
     /**
      *
      * @type {string}
      * @memberof User
      */
     lastName?: any | null;
     /**
      *
      * @type {Date}
      * @memberof User
      */
     termsAndPrivacyAgreedDate?: any;
     /**
      *
      * @type {string}
      * @memberof User
      */
     authProvider?: any | null;
     /**
      *
      * @type {boolean}
      * @memberof User
      */
     isForgotPasswordRequested?: any;
     /**
      *
      * @type {string}
      * @memberof User
      */
     bio?: any | null;
     /**
      *
      * @type {string}
      * @memberof User
      */
     profilePicUrl?: any | null;
     /**
     * 
     * @type {UserAttributes}
     * @memberof User
     */
     userAttributes?: any;

     name: string = '';
}