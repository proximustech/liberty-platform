import {IDynamicView} from "../../../interfaces/dynamic_view_interface"

export class ModuleMenu implements IDynamicView {
    async getPluginData(ctx:any,viewVars:any){
        return await ctx.render('plugins/dynamic_view_base/views/module_menu', viewVars);
    }
}

