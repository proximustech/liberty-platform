import {IAuthenticator} from "../interfaces/authenticator_interface"

export class UserPasswordAuthenticator implements IAuthenticator {
    private username: string;
    private password: string;
    
    constructor(username:string,password:string){
        this.username=username
        this.password=password
    }

    authenticate(){
        let dbUser ={
            id : 40,
            username : 'user@mail.com',
            password : 'password'
          }
        if (this.password === dbUser.password && this.username === dbUser.username) {
            return {
                id : 40,
                username : 'user',                
                role : 'admin',                
            };
        } else {
            return false;
        }
    };
    
}
