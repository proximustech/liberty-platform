import {IAuthorizer} from "../interfaces/authorizer_interface"
import { newEnforcer,Enforcer } from 'casbin';
import { MongoAdapter } from 'casbin-mongodb-adapter';
import { Config } from "../values/config";

export class AuthorizerCasbinMongo implements IAuthorizer {

    enforcer:Enforcer

    constructor(){
        this.enforcer = new Enforcer();
    }
    
    public async initialize(){
        const adapter = await MongoAdapter.newAdapter({
            uri: (Config.CASBIN_MONGO_URI as string),
            collection: 'casbin',
            database: 'liberty_platform',
        });   

        this.enforcer = await newEnforcer('./src/authorizers/casbin/model.conf', adapter);
    }

    async authorize (subject: any, element: any, action: any, environment: any) {

        let authorized = false
        
        if ((await this.enforcer.enforce(subject, element, action)) === true) {
            authorized = true
        } 

        return authorized
    };

    async getRoleAndSubjectPermissions (role: any,subject: any) {
        let userPermissions:any = []
        let rolePermissions:any = []

        if (subject!=="") {
            userPermissions = await this.enforcer.getImplicitPermissionsForUser(subject)
            
        }
        return userPermissions.concat(rolePermissions)
    };
    
}