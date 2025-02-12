import {IAuthorizer} from "../interfaces/authorizer_interface"
import { newEnforcer,Enforcer } from 'casbin';
import { MongoAdapter } from 'casbin-mongodb-adapter';

export class AuthorizerCasbinMongo implements IAuthorizer {

    enforcer:Enforcer

    constructor(){
        this.enforcer = new Enforcer();
    }
    
    public async initialize(){
        const adapter = await MongoAdapter.newAdapter({
            uri: (process.env.CASBIN_MONGO_URI as string),
            collection: 'casbin',
            database: 'liberty_platform',
        });   

        this.enforcer = await newEnforcer('./src/authorizers/casbin/model.conf', adapter);
    }

    async authorize (subject: any, element: any, action: any, environment: any) {

        //this.enforcer.addPolicy('data2_admin','data2', 'write')
        //this.enforcer.addGroupingPolicy('alice', 'data2_admin')

        let authorized = false
        
        if ((await this.enforcer.enforce(subject, element, action)) === true) {
            authorized = true
        } 

        return authorized
    };

    async getRoleAndSubjectPermissions (role: any,subject: any) {
        let userPermissions:any = []
        let rolePermissions:any = []
        /*
        if (role!=="") {
            rolePermissions = await this.enforcer.getPermissionsForUser(role)
            
        }
        */
        if (subject!=="") {
            userPermissions = await this.enforcer.getPermissionsForUser(subject)
            
        }
        return userPermissions.concat(rolePermissions)
    };
    
}