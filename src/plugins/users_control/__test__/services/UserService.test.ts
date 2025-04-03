import { UserServiceFactory } from "../../factories/UserServiceFactory";
import { UserDataObject } from "../../dataObjects/UserDataObject";

const generatePassword = () => {

    const lowerChars = "abcdefghijklmnopqrstuvwxyz";  
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";     
    const numChars = "0123456789";
    const specialChars = "!#;:,.?@";

    let chars = "";
    
    chars += specialChars;
    chars += lowerChars;
    chars += numChars;
    chars += specialChars;
    chars += upperChars;
    chars += numChars;
    chars += specialChars;

    let min = 12
    let max = 20

    let pass = "";
    for (let i = 0; i < Math.floor(Math.random() * (max - min + 1) + min); i++) {
        const randIdx = Math.floor(Math.random() * chars.length);
        pass += chars[randIdx];
    }

    let randIdx = Math.floor(Math.random() * lowerChars.length);
    pass += lowerChars[randIdx];        
    randIdx = Math.floor(Math.random() * upperChars.length);
    pass += upperChars[randIdx];        
    randIdx = Math.floor(Math.random() * numChars.length);
    pass += numChars[randIdx];        
    randIdx = Math.floor(Math.random() * specialChars.length);
    pass += specialChars[randIdx];        

    return pass;

}

const prefix = "users_control"

let userPermissions = [
    ['','users_control.user','read'],['','users_control.user','write'],
    ['','users_control.user','read'],['','users_control.user','write'],
]
const userService = UserServiceFactory.create("users_control",userPermissions)
var createdUserUuid = ""

describe("plugin: users_control - UserService", () => {

    test('Create', async () => {
        let user = new UserDataObject()
        user.email="utest@user.com"
        user.password=generatePassword()
        user.name="utest-user"
        user.last_name="LastName"
        createdUserUuid = await userService.create(user)
        expect(createdUserUuid.length).toBe(24);
    });
    test('Update', async () => {
        let user = (await userService.getByUuId(createdUserUuid) as UserDataObject)
        user.name="utest-user-updated"
        let updatedOk = await userService.updateOne(user)
        expect(updatedOk).toBe(true);
    });
    test('Delete', async () => {
        let deletedOk = await userService.deleteByUuId(createdUserUuid)
        expect(deletedOk).toBe(true);
    });        

})