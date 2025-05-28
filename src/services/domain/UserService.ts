import CommonService from "./CommonService";
import { RestApi } from "../RestApi";
import { User } from "../api/models";
import ErrorLogger from "@/helpers/ErrorLogger";

export default class UserService {

    static async register(user: User): Promise<User> {
        const userResponse = await RestApi.User.saveUser(user);

        return userResponse.data;
    }

    static async login(email: string, password: string): Promise<User> {
        const loginResponse = await RestApi.User.signIn(email, password);

        return loginResponse.data;
    }

    static async resetPassword(email: string): Promise<any> {
        const response = await RestApi.User.resetPassword(email);

        return response.data;
    }

    static async saveUser(user: User): Promise<User | undefined> {
        try {
            return (await RestApi.User.saveUser(user)).data;
        } catch (err) {
            CommonService.showError(err);
        }
    }

    static async getCurrentUser(): Promise<User | undefined> {
        try {
            return (await RestApi.User.getCurrentUser()).data;
        } catch (err) {
            CommonService.showError(err);
        }
    }

    static userCache: any = {};

    static async getUserById(userId: string): Promise<User | undefined> {
        const cachedUser: User = UserService.userCache[userId];

        if (cachedUser) return cachedUser;

        try {
            const user = (await RestApi.User.getUserById(userId)).data;

            if (user) UserService.userCache[userId] = user;

            return user;
        } catch (err) {
            CommonService.showError(err);
        }
    }

    static async getAllUsers(): Promise<User[] | undefined> {
        try {
            return (await RestApi.User.getAllUsers()).data;
        } catch (err) {
            CommonService.showError(err);
        }
    }
}