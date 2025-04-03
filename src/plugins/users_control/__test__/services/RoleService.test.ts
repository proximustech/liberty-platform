import { RoleServiceFactory } from "../../factories/RoleServiceFactory";
import { RoleDataObject } from "../../dataObjects/RoleDataObject";

const prefix = "users_control"

let userPermissions = [
    ['','users_control.role','read'],['','users_control.role','write'],
    ['','users_control.user','read'],['','users_control.user','write'],
]
const roleService = RoleServiceFactory.create("users_control",userPermissions)
var createdRoleUuid = ""

describe("plugin: users_control - RoleService", () => {

    test('Create', async () => {
        let role = new RoleDataObject()
        role.name="utest-role"
        createdRoleUuid = await roleService.create(role)
        expect(createdRoleUuid.length).toBe(24);
    });
    test('Update', async () => {
        let role = (await roleService.getByUuId(createdRoleUuid) as RoleDataObject)
        role.name="utest-role-updated"

        let updatedOk = await roleService.updateOne(role)
        expect(updatedOk).toBe(true);
    });
    test('Delete', async () => {
        let deletedOk = await roleService.deleteByUuId(createdRoleUuid)
        expect(deletedOk).toBe(true);
    });        

})