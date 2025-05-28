import { User } from "@/services/api/models";
import UserService from "@/services/domain/UserService";
import { RestApi } from "@/services/RestApi";

describe('UserService', () => {

    test('Should call API to get current user', async () => {
        RestApi.User.getCurrentUser = jest.fn();

        const bid = await UserService.getCurrentUser();

        expect(RestApi.User.getCurrentUser).toBeCalledTimes(1);
    });

    test('Should call API to save user', async () => {
        RestApi.User.saveUser = jest.fn();
        const obj: User = {email: '', name:''};
        
        const bid = await UserService.saveUser(obj);

        expect(RestApi.User.saveUser).toBeCalledTimes(1);
    });

    test('Should call API to get user by id', async () => {
        RestApi.User.getUserById = jest.fn();
        
        const bid = await UserService.getUserById('');

        expect(RestApi.User.getUserById).toBeCalledTimes(1);
    });

});