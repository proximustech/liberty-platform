import { UserService } from "../services/UserService";
import { RoleService } from "../services/RoleService";
import { UserDataObject } from "../dataObjects/UserDataObject";
import { RoleDataObject } from "../dataObjects/RoleDataObject";

let userService = new UserService()
let roleService = new RoleService()

let role = new RoleDataObject()
role.name = "Administrator"

let user = new UserDataObject()
user.role_uuid = role.uuid
user.email="admin@admin.com"
user.password = "admin"

let main = async() => {
    await roleService.create(role)
    await userService.create(user)
    process.exit()
}
main()