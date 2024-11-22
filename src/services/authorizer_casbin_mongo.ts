import {IAuthorizer} from "../interfaces/authorizer_interface"
import { newEnforcer,Enforcer } from 'casbin';
import { MongoAdapter } from 'casbin-mongodb-adapter';

export class AuthorizerCasbinMongo implements IAuthorizer {

    enforcer:Enforcer

    constructor(){
        this.enforcer = new Enforcer();
        this.readConfig()
    }
    
    private async readConfig(){
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

        if ((await this.enforcer.enforce(subject, element, action)) === true) {
            // permit alice to read data1
            console.log("authorization ok")
        } else {
            // deny the request, show an errori
            console.log("authorization bad")
        }

        return false
    };
    
}