//import * as LibertyFlagPermissions from "../../_liberty_flag/services/permissions";
import * as UsersControlPermissions from "../../users_control/services/permissions";

export let dynamicViewsDefinition = {
    //"route_target":{viewVar[bases]}
    "role_form":{
        "permissionsModulesContent":[
            new UsersControlPermissions.Permissions(),
            //new LibertyFlagPermissions.Permissions(),

        ]
    },
}
