import { AuthorizerCasbinMongo as AuthorizerCasbin } from "./authorizer_casbin_mongo";

export abstract class GlobalServices  {
    
    static casbinAuthorizer:AuthorizerCasbin
    
}