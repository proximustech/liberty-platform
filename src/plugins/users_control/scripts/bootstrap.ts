import {AuthorizerCasbinMongo as AuthorizerCasbin} from "../../../services/authorizer_casbin_mongo";

import { UserDataObject } from "../dataObjects/UserDataObject";
import { RoleDataObject } from "../dataObjects/RoleDataObject";

import { UserServiceFactory } from "../factories/UserServiceFactory";
import { RoleServiceFactory } from "../factories/RoleServiceFactory";

async function main() {

    let userService = UserServiceFactory.create('users_control',[])
    let roleService = RoleServiceFactory.create('users_control',[])

    let role = new RoleDataObject()
    role.name = "Administrator"

    let roleUuid=await roleService.create(role)
    
    let user = new UserDataObject()
    user.role_uuid = roleUuid
    user.email="admin@admin.com"
    user.password = "5ibf6DJejfR7djf"
    user.name="Admin"
    user.last_name="Istrator"

    await userService.create(user,false)

    const permissions: any = [
        {resource:"users_control.user",permission:"read"},
        {resource:"users_control.user",permission:"write"},
        {resource:"users_control.role",permission:"read"},
        {resource:"users_control.role",permission:"write"},
    ]
    
    const authorizer: AuthorizerCasbin = new AuthorizerCasbin()
    await authorizer.initialize()
    for (let index = 0; index < permissions.length; index++) {
        const permission = permissions[index];
        let result:Boolean = await authorizer.enforcer.addPolicy(roleUuid,permission.resource, permission.permission)
    }   

    process.exit()
    
}

main()