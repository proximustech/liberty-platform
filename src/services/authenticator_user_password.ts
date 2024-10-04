import {IAuthenticator} from "../interfaces/authenticator_interface"
import { MongoDbUserPasswordAuthenticator } from "../plugins/mongodb_authenticator_user_password/services/mongodb_authenticator_user_password";

export class UserPasswordAuthenticator implements IAuthenticator {
    private username: string;
    private password: string;
    
    constructor(username:string,password:string){
        this.username=username
        this.password=password
    }

    async authenticate(){
        let mongoDbUserPasswordAuthenticator = new MongoDbUserPasswordAuthenticator(this.username,this.password)
        return await mongoDbUserPasswordAuthenticator.authenticate()
    };
    
}
