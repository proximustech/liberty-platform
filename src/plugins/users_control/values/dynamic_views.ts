import * as LibertyFlagPermissions from "../../_liberty_flag/services/permissions";

export let dynamicViewsDefinition = {
    //"route_target":{viewVar[bases]}
    "role_form":{
        "permissionsModulesContent":[
            new LibertyFlagPermissions.Permissions(),

        ]
    },
}
