let p = {
    read:"read",
    write:"write"
}
export let UsersControl_permissionsSchema = {
    /*
    "plugin_name": {
        "label": "---",
        "schema": [
            {
                "resource":"one",
                "permissions":[p.read,p.write]
            },
            {
                "resource":"two",
                "permissions":[p.read,p.write]
            },
        ]
    }    
    */
    "users_control": {
        "label": "Permissions Module",
        "schema": [
            {
                "resource":"role",
                "permissions":[p.read,p.write]
            },
            {
                "resource":"user",
                "permissions":[p.read,p.write]
            }
        ]
    }
}