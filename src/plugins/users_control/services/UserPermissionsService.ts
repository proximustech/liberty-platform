// Casbin user permissions
export let UserHasPermissionOnElement=(userPermissions:any,elements:Array<string>,permissions:Array<string>) => {
    let result = false
    let continueLoop = true
    for (let userPermissionIndex = 0; userPermissionIndex < userPermissions.length; userPermissionIndex++) {
        const rule = userPermissions[userPermissionIndex]
        const ruleElement = rule[1]
        const rulePermission = rule[2]

        for (let elementsIndex = 0; elementsIndex < elements.length; elementsIndex++) {
            const element = elements[elementsIndex];
            
            for (let permissionsIndex = 0; permissionsIndex < permissions.length; permissionsIndex++) {
                const permission = permissions[permissionsIndex];
                
                if (ruleElement === element && rulePermission === permission && continueLoop) {
                    result = true
                    continueLoop = false
                    break
                }

                if (!continueLoop) {
                    break
                }                

            }

            if (!continueLoop) {
                break
            }

        }

        
    }

    return result
}