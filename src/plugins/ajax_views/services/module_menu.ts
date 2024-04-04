import {IDynamicView} from "../../../interfaces/dynamic_view_interface"

export namespace AjaxViews {
    export class ModuleMenu implements IDynamicView {
        async getPluginData(ctx:any,viewVars:any){
            return await ctx.render('plugins/ajax_views/views/module_menu', viewVars);
        }
    }
}
