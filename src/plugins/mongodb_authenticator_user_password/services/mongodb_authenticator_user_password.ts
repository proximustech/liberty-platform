import {IAuthenticator} from "../../../interfaces/authenticator_interface"
import { UserService } from "./UserService";


export class MongoDbUserPasswordAuthenticator implements IAuthenticator {
    private username: string;
    private password: string;
    
    constructor(username:string,password:string){
        this.username=username
        this.password=password
    }

    async authenticate(){

        let userService = new UserService()
        let user = await userService.getByEmailAndPassword(this.username,this.password)

        if (user.email !== "") {
            return user;
        } else {
            return false;
        }
    };
    
}