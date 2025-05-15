import {IDynamicView} from "../../../interfaces/dynamic_view_interface"
import { UserHasPermissionOnElement } from "./UserPermissionsService";

export default class ModuleMenu implements IDynamicView {
    async getPluginData(ctx:any,viewVars:any){
        viewVars.UserHasPermissionOnElement = UserHasPermissionOnElement
        return await ctx.render('plugins/users_control/views/module_menu', viewVars);
    }
}

