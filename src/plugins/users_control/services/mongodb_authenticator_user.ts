import {IAuthenticator} from "../../../interfaces/authenticator_interface"
import { UserModel } from "../models/UserModel";


export class MongoDbUserAuthenticator implements IAuthenticator {
    private username: string;
    
    constructor(username:string){
        this.username=username
    }

    async authenticate(){

        let userModel = new UserModel()
        let user = await userModel.getByEmail(this.username)

        if (user.email !== "") {
            return user;
        } else {
            return false;
        }
    };
    
}