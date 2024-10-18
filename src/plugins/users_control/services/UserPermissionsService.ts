// Casbin user permissions
export let UserHasPermissionOnElement=(userPermissions:any,element:string,permission:string) => {
    let result = false
    for (let index = 0; index < userPermissions.length; index++) {
        const rule = userPermissions[index]
        const ruleElement = rule[1]
        const rulePermission = rule[2]
        if (ruleElement === element && rulePermission === permission) {
            result = true
            break
        }
        
    }

    return result
}