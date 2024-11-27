import {AuthorizerCasbinMongo as AuthorizerCasbin} from "../../../services/authorizer_casbin_mongo";

import { UserDataObject } from "../dataObjects/UserDataObject";
import { RoleDataObject } from "../dataObjects/RoleDataObject";

import { UserService } from "../services/UserService";
import { RoleService } from "../services/RoleService";

async function main() {

    let userService = new UserService()
    let roleService = new RoleService()

    let role = new RoleDataObject()
    role.name = "Administrator"

    let roleUuid=await roleService.create(role)
    
    let user = new UserDataObject()
    user.role_uuid = roleUuid
    user.email="admin@admin.com"
    user.password = "admin"

    await userService.create(user)

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