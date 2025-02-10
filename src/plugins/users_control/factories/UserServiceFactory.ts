import { UserModel } from "../models/UserModel";
import { UserService } from "../services/UserService";

export class UserServiceFactory{

    public static create(prefix:string,userPermissions:any,userModel = new UserModel()): UserService{

        return new UserService(
            userModel,
            prefix,
            userPermissions
        )

    }

}