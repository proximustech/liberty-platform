import {IAuthorizer} from "../interfaces/authorizer_interface"
import { newEnforcer,Enforcer } from 'casbin';

export class AuthorizerCasbinFile implements IAuthorizer {

    enforcer:Enforcer

    constructor(){
        this.initialize()
        this.enforcer = new Enforcer();

    }
    
    async initialize(){
        this.enforcer = await newEnforcer('./src/authorizers/casbin/model.conf', './src/authorizers/casbin/policy.csv');
    }

    async authorize (subject: any, element: any, action: any, environment: any) {

        if ((await this.enforcer.enforce(subject, element, action)) === true) {
            // permit alice to read data1
            console.log("authorization ok")
        } else {
            // deny the request, show an errori
            console.log("authorization bad")
        }

        return false
    };

    async getRoleAndSubjectPermissions (subject: any,role: any) {
        let userPermissions = await this.enforcer.getPermissionsForUser(subject)
        let rolePermissions = await this.enforcer.getPermissionsForUser(role)
        return userPermissions.concat(rolePermissions)
    };    
    
}