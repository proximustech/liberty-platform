import {IAuthenticator} from "../interfaces/authenticator_interface"

export class UserPasswordAuthenticator implements IAuthenticator {
    private username: string;
    private password: string;
    
    constructor(username:string,password:string){
        this.username=username
        this.password=password
    }

    authenticate(){
        let user ={
            id : 1,
            username : 'user',
            password : 'password'
          }
        if (this.password === user.password && this.username === user.username) {
            return true;
        } else {
            return false;
        }
    };
    
}