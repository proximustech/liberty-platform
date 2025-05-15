import {IDynamicView} from "../../../interfaces/dynamic_view_interface"
import { UsersControl_permissionsSchema } from "../values/PermissionsSchema";

export default class Permissions implements IDynamicView {
    async getPluginData(ctx:any,viewVars:any){
        viewVars.usersControl_permissionsSchema = UsersControl_permissionsSchema
        return await ctx.render('plugins/users_control/views/permissions', viewVars);
    }
}

